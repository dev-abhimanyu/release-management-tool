function CheckCustomer(val) {
    const element = document.getElementById('customerInput');
    if (val == 'new'){
        element.style.display = 'block';
        element.required = true;
    }
    else{
        element.style.display = 'none';
        element.required = false;
    }
}
function CheckModule(val) {
    const element = document.getElementById('moduleInput');
    if (val == 'new'){
        element.style.display = 'block';
        element.required = true;
    }
    else{
        element.style.display = 'none';
        element.required = false;
    }
}
// function CheckStatus(val) {
//     const element = document.getElementById('statusInput');
//     if (val == 'new'){
//         element.style.display = 'block';
//         element.required = true;
//     }
//     else{
//         element.style.display = 'none';
//         element.required = false;
//     }
// }
// form validation
const isEmpty = value => value === 'undefined' ? true : false;
const form = document.querySelector('#newForm');
const formError = document.querySelector('#formError');
form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();
    let customerSelect = document.querySelector('#customerSelect');
    let moduleSelect = document.querySelector('#moduleSelect');
    let statusSelect = document.querySelector('#statusSelect');
    // console.log(customerSelect.value);
    // console.log(moduleSelect.value);
    // console.log(statusSelect.value);
    const isFormInvalid = isEmpty(customerSelect.value) || isEmpty(moduleSelect.value) || isEmpty(statusSelect.value);
    // console.log(isFormInvalid);
    if(isFormInvalid){
        formError.style.display = 'block';
    }
    else{
        formError.style.display = 'none';
        form.submit();
    }
});