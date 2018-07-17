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
let scroller = document.querySelector('div.scroller')
let main = document.querySelector('.logged-in main')
let diaries = document.querySelector('section.diaries')
let setTransform = () => {
  let mainStyle = main.currentStyle || window.getComputedStyle(main)
  let offset = -(diaries.offsetLeft - mainStyle.paddingLeft.match(/\d+/g)[0])
  console.log({offset})
  scroller.style.transform = 'translate3d(' + (offset) + 'px,0,0)';
}
let navigateTo = (url) => {
  window.location.assign = url
}
initInput()