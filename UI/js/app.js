let initInput = () => {
  let inputFields = document.querySelectorAll('.input > input')
  if (inputFields.length === 0) return
  for (inputField of inputFields) {
    inputField.addEventListener('focus', function () {
      this.parentNode.classList.add('active')
    })
    inputField.addEventListener('blur', function () {
      this.parentNode.classList.remove('active')
    })
  }
}
initInput()