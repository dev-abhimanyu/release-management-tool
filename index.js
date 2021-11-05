const express = require('express');
const app = express();
const ntlm = require('express-ntlm');
const mongoose = require('mongoose');
const path = require('path')
const Release = require('./models/releases');
const StatusConfig = require('./models/statusconfig');
const ConfigUser = require('./models/configuser');
const ReleaseHistory = require('./models/releasehistory');
const methodOverride = require('method-override');
const PAGE_SIZE = 10;       // number of records to show at a time in advanced search

// middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true})); //needed for body-parsing of post request-parses the form data
app.use(express.static(path.join(__dirname, 'public')));     // for loading static resources like css and js (bootstrap)
app.use(ntlm());

function getIST(dt){
    return(dt.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' }).replace(",",""));
}
mongoose.connect('mongodb://localhost:27017/releaseDb')
.then(()=>{
    console.log('CONNECTED TO MONGO!');
})
.catch((err)=>{
    console.log('ERROR! CONNECTING TO MONGO!');
    console.log(err);
});
function getSearchObj(inputObj){
    const searchObj = {};
    if(inputObj.customerSelect!=='undefined'){
        searchObj.customer = inputObj.customerSelect;
    }
    if(inputObj.moduleSelect!=='undefined'){
        searchObj.module = inputObj.moduleSelect;
    }
    if(inputObj.statusSelect!=='undefined'){
        searchObj.status = inputObj.statusSelect;
    }
    return searchObj;
}
function getNewInsertObj(inputObj){
    const insertObj = {};
    insertObj.releaseNumber = inputObj.releaseNumber;
    insertObj.desc = inputObj.desc;
    if(inputObj.customerSelect==='new'){
        insertObj.customer = inputObj.customerInput;
    }
    else{
        insertObj.customer = inputObj.customerSelect;
    }
    if(inputObj.moduleSelect==='new'){
        insertObj.module = inputObj.moduleInput;
    }
    else{
        insertObj.module = inputObj.moduleSelect;
    }
    if(inputObj.statusSelect==='new'){
        insertObj.status = inputObj.statusInput;
    }
    else{
        insertObj.status = inputObj.statusSelect;
    }
    return insertObj;
}
async function getSearchResults(Model, page, searchObj, sortCriteria){
    const skip = (page - 1) * PAGE_SIZE;
    try{
        const searchResults = await Model.find(searchObj).sort(sortCriteria).skip(skip).limit(PAGE_SIZE);
        return searchResults;
    }
    catch(err){
        console.log(err);
        let navActive = '';
        let userName = '';
        res.render('./releases/notfound', { userName, navActive });
    }
}
async function getSearchResultsPageCount(Model,searchObj){
    // const PAGE_SIZE = 10;
    try{
        const documentCount = await Model.find(searchObj).count();
        const remainder=documentCount%PAGE_SIZE;
        let totalPageCount = 1;
        if(remainder === 0){
            totalPageCount = documentCount/PAGE_SIZE;
        }
        else{
            totalPageCount = (documentCount-remainder)/PAGE_SIZE;
            totalPageCount = totalPageCount + 1;
        }
        return totalPageCount;
    }
    catch(err){
        console.log(err);
        let navActive = '';
        let userName = '';
        res.render('./releases/notfound', { userName, navActive });
    }
}
// paths
app.get('/releases',async(req,res)=>{
    let navActive = 'home';
    let userName = res.locals.ntlm.UserName;
    try{
        const recentReleases = await Release.find({}).sort('-createdAt').limit(5);
        res.render('./releases/index', { userName, navActive, recentReleases });
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/history',async(req,res)=>{
    let navActive = 'history';
    let userName = res.locals.ntlm.UserName;
    try{
        let page = 1;
        const searchObj = {};
        const sortCriteria = '-createdAt';
        if(req.query.page){
            page = parseInt(req.query.page);
        }
        const pageCount = await getSearchResultsPageCount(ReleaseHistory,searchObj);
        // console.log(pageCount);
        const searchResults = await getSearchResults(ReleaseHistory, page, searchObj, sortCriteria);
        // console.log(searchResults);
        res.render('./releases/history', { userName, navActive, searchResults, pageCount, page, PAGE_SIZE } );
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.post('/releases/history',async(req,res)=>{
    let userName = res.locals.ntlm.UserName;
    try{
        const deletedDocs = await ReleaseHistory.deleteMany({});
        res.redirect('/releases/history');
    }
    catch(err){
        console.log(err);
        let navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/new', async(req,res)=>{
    let navActive = 'new';
    let userName = res.locals.ntlm.UserName;
    try{
        const customers = await Release.distinct("customer");
        const modules = await Release.distinct("module");
        const status = await StatusConfig.distinct("status");
        let isDuplicate = false;
        if(req.query.isDuplicate){
            // console.log(req.query.isDuplicate);
            isDuplicate = req.query.isDuplicate;
        }
        res.render('./releases/new', { userName, navActive, customers, modules, status, isDuplicate });
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/advancedsearch',async(req,res)=>{
    let navActive = 'advanced_search';
    let userName = res.locals.ntlm.UserName;
    try{
        const customers = await Release.distinct("customer");
        const modules = await Release.distinct("module");
        const status = await Release.distinct("status");
        // console.log(req.query);
        if(Object.keys(req.query).length !== 0){
            const searchFilters = req.query;
            const searchObj = getSearchObj(searchFilters);
            const sortCriteria = searchFilters.sortBy === 'releaseDate' ? '-createdAt' : '-updatedAt'; 
            let page = 1;
            if(req.query.page){
                page = parseInt(req.query.page);
            }
            const pageCount = await getSearchResultsPageCount(Release,searchObj);
            // console.log(pageCount);
            const searchResults = await getSearchResults(Release, page, searchObj, sortCriteria);
            // console.log(searchResults);
            res.render('./releases/advancedsearchresults', { userName, navActive, searchFilters, customers, modules, status, searchResults, pageCount, page, PAGE_SIZE } );
        }
        else{
            res.render('./releases/advancedsearch', { userName, navActive, customers, modules, status });
        }
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { navActive });
    }
})
app.get('/releases/coincidingreleases',async(req,res)=>{
    let navActive = 'coinciding_releases';
    let userName = res.locals.ntlm.UserName;
    try{
        const completeStatesRes = await StatusConfig.find({ isCompleteState: true }, { status: 1, _id: 0 });
        if( completeStatesRes.length === 0 ){
            // console.log('NO COMPLETE STATE FOUND! PLEASE CONFIGURE THE STATES');
            res.redirect('/releases/statusconfig');
        }
        else{
            let completeStates = [];
            for(state of completeStatesRes){
                completeStates.push(state.status)
            }
            // console.log(completeStates);
            const aggregateRes = await Release.aggregate([
                { $match: {"status": { $nin: completeStates } } } ,
                { $group : { _id : { customer: "$customer", module: "$module" }, count: { $sum: 1 }}},
                { $match: { "count": { $gt: 1} }},
                { $sort: { "_id.customer": 1 } }
            ]);
            // console.log(aggregateRes);
            if(aggregateRes.length !== 0){
                let coincidingReleases = [];
                for(doc of aggregateRes){
                    doc._id.status = { '$nin': completeStates } ;
                    // console.log(doc._id);
                    let releaseResult = await Release.find(doc._id);
                    // console.log(releaseResult);
                    for(r of releaseResult){
                        coincidingReleases.push(r);
                    }
                }
                // console.log(coincidingReleases);
                let pageCount = 1;
                if (coincidingReleases.length/PAGE_SIZE === 0){
                    pageCount = coincidingReleases.length/PAGE_SIZE
                }
                else{
                    const remainder=coincidingReleases.length%PAGE_SIZE;
                    pageCount = (coincidingReleases.length-remainder)/PAGE_SIZE;
                    pageCount = pageCount + 1;
                }
                let page = 1;
                if(req.query.page){
                    page = parseInt(req.query.page);
                }
                const pageResults = coincidingReleases.slice(((PAGE_SIZE*page)-PAGE_SIZE),(PAGE_SIZE*page));
                // console.log(pageResults);
                res.render('./releases/coincidingreleases', { userName, navActive, pageResults, pageCount, page, PAGE_SIZE } );
            }
            else{
                // console.log("DISPLAY NO COINCIDING RELEASES FOUND");
                navActive = '';
                res.render('./releases/notfound', { userName, navActive });
                // res.redirect('/releases');
            }
        }
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/statusconfig',async(req,res)=>{
    let navActive = 'status_config';
    let userName = res.locals.ntlm.UserName;
    try{
        // get config user
        const configUserCount = await ConfigUser.find({}).count();
        if(configUserCount===0){
            const configUserInsert = await ConfigUser.insertMany( { user: 'admin', lastmodifiedby: userName} );
        }
        const configUserResult = await ConfigUser.findOne( { user: 'admin' } );
        // console.log(configUserResult);
        const statusResults = await StatusConfig.find({});
        res.render('./releases/statusconfig', { userName, navActive, statusResults, configUserResult });
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.post('/releases/statusconfig',async(req,res)=>{
    try{
        // console.log(req.body);
        let statusConfigInput = {};
        statusConfigInput.status = req.body.status; 
        if(req.body.isCompleteState){
            statusConfigInput.isCompleteState = true;
        }
        else{
            statusConfigInput.isCompleteState = false;
        }
        const insertedStatusResponse = await StatusConfig.insertMany(statusConfigInput);
        const insertedStatusResult = insertedStatusResponse[0];
        // console.log(insertedStatusResult);
        res.redirect('/releases/statusconfig');
    }
    catch(err){
        console.log(err);
        let navActive = '';
        let userName = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/statusconfig/delete', async(req,res)=>{
    let navActive = '';
    let userName = res.locals.ntlm.UserName;
    try{
        if(req.query._id && mongoose.isValidObjectId(req.query._id)){
            const deletedStatus = await StatusConfig.findByIdAndDelete(req.query._id);
            // console.log(deletedStatus);
            res.redirect('/releases/statusconfig');
        }
        else{
            res.render('./releases/notfound', { userName, navActive });   
        }
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.post('/releases/statusconfig/resetpass',async(req,res)=>{
    let userName = res.locals.ntlm.UserName;
    try{
        const passUpdateConfigUser = await ConfigUser.findOneAndUpdate( { user: 'admin' }, { pass: req.body.new_pass }, { new: true });
        // console.log(req.body);
        res.redirect('/releases/statusconfig/');
    }
    catch(err){
        console.log(err);
        let navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.post('/releases/advancedsearch',(req,res)=>{
    const searchFilters = req.body;
    // console.log(searchFilters);
    res.redirect(`/releases/advancedsearch?customerSelect=${searchFilters.customerSelect}&moduleSelect=${searchFilters.moduleSelect}&statusSelect=${searchFilters.statusSelect}&sortBy=${searchFilters.sortBy}&page=1`)
})
app.get('/releases/:id',async(req,res)=>{
    let navActive = '';
    let userName = res.locals.ntlm.UserName;
    try{
        const { id } = req.params;
        // console.log(req.query);
        // check if the release is newly inserted or not
        let insertedSuccessfully = false;
        let disableBack = false;
        if(req.query.insertedSuccessfully)
        {
            insertedSuccessfully = true;
            disableBack = true;
        }
        if(req.query.updatedSuccessfully)
        {
            disableBack = true;
        }
        //mongoose.isValidObjectId(id)
        // check if release is present
        const selectedRelease = await Release.findOne({releaseNumber:id});
        if(Object.keys(selectedRelease).length !== 0){
            const releaseHistoryArr = await ReleaseHistory.find({releaseNumber:selectedRelease.releaseNumber}).sort('-createdAt');
            res.render('./releases/details', { userName, navActive, selectedRelease, insertedSuccessfully, disableBack, releaseHistoryArr });
        }
        else{
            res.render('./releases/notfound', { userName, navActive });
        }
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
// new release POST
app.post('/releases',async(req,res)=>{
    let userName = res.locals.ntlm.UserName;
    try{
        const insertObj = getNewInsertObj(req.body);
        // check if release already exsists
        let isDuplicate = false;
        const foundRelease = await Release.findOne({releaseNumber: insertObj.releaseNumber});
        if(foundRelease){
            isDuplicate = true;
            // console.log("Release already exists!!");
            res.redirect(`/releases/new?isDuplicate=${isDuplicate}`);
        }
        else{
            // console.log("Ready to INSERT!");
            insertObj.user = userName;
            const insertResponse = await Release.insertMany(insertObj);
            const insertedRelease = insertResponse[0];
            // console.log(insertedRelease);
            
            // insert doc into release history
            let releaseHistoryDoc = insertObj;
            releaseHistoryDoc.action = 'INSERT';
            releaseHistoryDoc.user = userName;
            const insertReleaseHistory = await ReleaseHistory.insertMany(releaseHistoryDoc);
            
            res.redirect(`/releases/${insertedRelease.releaseNumber}?insertedSuccessfully=true`);
        }
    }
    catch(err){
        console.log(err);
        let navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.get('/releases/:id/edit',async(req,res)=>{
    let navActive = 'edit';
    let userName = res.locals.ntlm.UserName;
    try{
        const { id } = req.params;
        const selectedRelease = await Release.findOne({releaseNumber:id});
        const customers = await Release.distinct("customer");
        const modules = await Release.distinct("module");
        const status = await StatusConfig.distinct("status");
        res.render('./releases/edit', { userName, navActive, customers, modules, status,selectedRelease });
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.put('/releases/:id',async(req,res)=>{
    let userName = res.locals.ntlm.UserName;
    try{
        const { id } = req.params;
        const newInput = getNewInsertObj(req.body);
        newInput.user = userName;
        const updatedRelease = await Release.findOneAndUpdate({releaseNumber: id}, newInput, { new: true });
        // console.log(updatedRelease);

        // insert doc into release history
        let releaseHistoryDoc = newInput;
        releaseHistoryDoc.action = 'UPDATE';
        releaseHistoryDoc.user = userName;
        const updateReleaseHistory = await ReleaseHistory.insertMany(releaseHistoryDoc);

        res.redirect(`/releases/${id}?updatedSuccessfully=true`);
    }
    catch(err){
        console.log(err);
        let navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.delete('/releases/:id',async(req,res)=>{
    let userName = res.locals.ntlm.UserName;
    try{
        const { id } = req.params;
        // console.log(`'Deleting ${id}`);
        const deletedRelease = await Release.findOneAndDelete({releaseNumber: id});
        // console.log(deletedRelease);

        // insert doc into release history
        let releaseHistoryDoc = {};
        releaseHistoryDoc.releaseNumber = deletedRelease.releaseNumber;
        releaseHistoryDoc.customer = deletedRelease.customer;
        releaseHistoryDoc.module = deletedRelease.module;
        releaseHistoryDoc.status = deletedRelease.status;
        releaseHistoryDoc.desc = deletedRelease.desc;
        releaseHistoryDoc.action = 'DELETE'; 
        releaseHistoryDoc.user = userName;
        const deleteReleaseHistory = await ReleaseHistory.insertMany(releaseHistoryDoc);
        
        res.redirect('/releases');
    }
    catch(err){
        console.log(err);
        let navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.post('/release/search',async(req,res)=>{
    let navActive = '';
    let userName = res.locals.ntlm.UserName;
    try{
        const releaseNumber = req.body.searchRelease;
        // console.log(releaseNumber);
        const foundRelease = await Release.findOne({releaseNumber: releaseNumber});
        // console.log(foundRelease);
        if(foundRelease){
            // const { _id } = foundRelease;
            // // console.log(_id);
            res.redirect(`/releases/${foundRelease.releaseNumber}`);
        }
        else{
            res.render('./releases/notfound', { userName, navActive });
        }
    }
    catch(err){
        console.log(err);
        navActive = '';
        res.render('./releases/notfound', { userName, navActive });
    }
})
app.listen(3000,()=>{
    console.log('LISTENING ON PORT 3000');
})