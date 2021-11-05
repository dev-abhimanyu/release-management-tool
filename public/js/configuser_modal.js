let configuserModal = new bootstrap.Modal(document.getElementById('configuserModal'), {
    keyboard: false
})
configuserModal.toggle()
const form = document.querySelector("#authForm");
const incorrectPassMsg = document.querySelector('#incorrect_pass');
form.addEventListener('submit', function (e) {
    // prevent the form from submitting
    e.preventDefault();
    let inputPass = document.querySelector("#password");
    // console.log(inputPass.value);
    // console.log(pass);
    if (inputPass.value === pass) {
        // console.log('PASS');
        incorrectPassMsg.hidden = true;
        configuserModal.toggle()
    }
    else {
        // console.log('FAIL');
        form.reset();
        incorrectPassMsg.hidden = false;
    }
});