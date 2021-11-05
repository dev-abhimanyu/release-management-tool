let configuserModal = new bootstrap.Modal(document.getElementById('configuserModal'), {
  keyboard: false
})
configuserModal.toggle()

// const form = document.querySelector("#authForm");
// const pass = '<%= configUserResult.pass %>';
// console.log(pass);
// form.addEventListener('submit', function(e){
//   // prevent the form from submitting
//   e.preventDefault();
//   let inputPass = document.querySelector("#password");
//   console.log(inputPass.value);
//   console.log(pass);
// });