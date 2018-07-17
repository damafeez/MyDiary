let initInput = () => {
  let inputFields = document.querySelectorAll('.input > input, .textarea > textarea')
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
let slideTo = (val) => {
  let scroller = document.querySelector('div.scroller')
  let diaries = document.querySelector('section.diaries')
  let transform = val === 0 ? val : -diaries.offsetLeft
  scroller.style.transform = `translate3d(${transform}px, 0, 0)`;
}
let navigateTo = (url) => {
  window.location.assign = url
}
initInput()