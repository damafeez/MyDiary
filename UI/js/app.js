let initInput = () => {
  let inputFields = document.querySelectorAll('.input > input')
  if (inputFields.length === 0) return
  for (inputField of inputFields) {
    inputField.addEventListener('focus', function () {
      this.parentNode.classList.add('active')
    })
    inputField.addEventListener('blur', function () {
      if (!this.value) this.parentNode.classList.remove('active')
    })
  }
}
let toggleView = (view) => {
  let authContainer = document.querySelector('section.auth')
  authContainer.className = `auth ${view}-view`
}
initInput()