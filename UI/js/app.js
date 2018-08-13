// const apiRoot = 'http://localhost:3030/api/v1';
const apiRoot = 'https://api-mydiary.herokuapp.com/api/v1';
const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const now = new Date();
let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editMode = false;
let showAddDiaryView = false;
let currentDiary;

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
let pushSubscription;
const registerWorker = async () => {
  const registration = await navigator.serviceWorker.register('/MyDiary/UI/js/worker.js');
  pushSubscription = await registration.pushManager.getSubscription();
  if (!pushSubscription) {
    const response = await fetch(`${apiRoot}/push/publicKey`, {
      mode: 'cors',
    });
    const data = await response.text();
    const publicKey = urlBase64ToUint8Array(data);
    pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });
  }
};
if ('serviceWorker' in navigator) {
  registerWorker().catch(error => console.log(error));
}
const initInput = () => {
  const inputFields = [...document.querySelectorAll('.input > input, .textarea > textarea')];
  if (inputFields.length === 0) return;
  inputFields.map((inputField) => {
    if (inputField.value) inputField.parentNode.classList.add('active');
    else inputField.parentNode.classList.remove('active');
    inputField.addEventListener('focus', function () {
      this.parentNode.classList.add('active');
    });
    inputField.addEventListener('blur', function () {
      if (!this.value) this.parentNode.classList.remove('active');
    });
    return inputField;
  });
};
const initOpenClose = () => {
  const openCloseArray = [...document.querySelectorAll('.settings .open-close')];
  if (openCloseArray.length === 0) return;
  openCloseArray.map((openClose) => {
    return openClose.previousElementSibling.addEventListener('click', () => {
      openCloseArray.map((x) => {
        if (x !== openClose) x.classList.remove('active');
      });
      initInput();
      openClose.classList.toggle('active');
    });
  });
};
const toggleView = (view) => {
  const authContainer = document.querySelector('section.auth');
  authContainer.className = `auth ${view}-view`;
};
function scrollToItem(item) {
  const diff = (item.offsetTop - window.scrollY) / 8;
  if (Math.abs(diff) > 1) {
    window.scrollTo(0, (window.scrollY + diff));
    clearTimeout(window._TO);
    window._TO = setTimeout(scrollToItem, 30, item);
  } else {
    window.scrollTo(0, item.offsetTop);
  }
}
const slideTo = () => {
  const scroller = document.querySelector('div.scroller');
  const addDiary = document.querySelector('section.add-diary');
  const diaries = document.querySelector('section.diaries');
  if (showAddDiaryView) {
    addDiary.style.display = 'initial';
    scroller.style.transform = `translate3d(${0}px, 0, 0)`;
    if (window.innerWidth <= 550) {
      scrollToItem(addDiary);
    }
  } else if (window.innerWidth > 550) {
    addDiary.style.display = 'initial';
    scroller.style.transform = `translate3d(${-diaries.offsetLeft}px, 0, 0)`;
  } else {
    scroller.style.transform = `translate3d(${0}px, 0, 0)`;
    addDiary.style.display = 'none';
  }
};
const hideAdd = () => {
  showAddDiaryView = false;
  slideTo();
};
const initDropdown = () => {
  document.querySelector('.drop-container .drop').addEventListener('click', e => e.stopPropagation());
};
const readDiary = (i = 0) => {
  let diary = entries[i];
  if (!diary) {
    diary = { title: 'You have not added any entries to your diary', body: 'Please click the green  button at bottom left to get started', created: '' };
    currentDiary = 0;
  } else {
    const date = new Date(diary.created);
    diary.created = `${months[date.getMonth()]} ${date.getDate()}`;
  }
  currentDiary = i;
  document.querySelector('section.diary h2').textContent = diary.title;
  document.querySelector('section.diary .date').textContent = diary.created;
  document.querySelector('section.diary .body').textContent = diary.body;
  const diaryList = [...document.querySelectorAll('section.diaries ul > li')];
  if (diaryList.length === 0) return;
  diaryList.map(entry => entry.classList.remove('active'));
  diaryList[currentDiary].classList.add('active');
  hideAdd();
};
const initDiaries = () => {
  const diaries = document.querySelector('section.diaries');
  const numberOfDiaries = document.querySelector('#info');
  diaries.innerHTML = `
  <div class="today">
    <span id="date">${now.getDate()}</span>
    <span id="day">${days[now.getDay()]}</span>
  </div>
  `;
  const ul = document.createElement('ul');
  entries.map((diary, i) => {
    const created = new Date(diary.created);
    const li = document.createElement('li');
    const template = `
    <span class="pointer"></span>
    <h4 class="title">${diary.title}</h4>
    <p class="body">${diary.body}</p>
    <span class="date">${months[created.getMonth()]}<br />${created.getDate()}</span>
    `;
    li.innerHTML = template;
    li.addEventListener('click', () => readDiary(i));
    return ul.appendChild(li);
  });
  numberOfDiaries.innerHTML = `${entries.length} ${entries.length > 1 ? 'entries' : 'entry'} added`;
  diaries.appendChild(ul);
  readDiary(currentDiary);
  localStorage.setItem('entries', JSON.stringify(entries));
};
const notification = document.createElement('div');
notification.className = 'notification-dialog';
document.body.appendChild(notification);
const confirmDialog = document.createElement('div');
confirmDialog.className = 'notification-dialog confirm-dialog';
document.body.appendChild(confirmDialog);
const showNotification = ({
  message = 'test',
  timeout = 5000,
  status = 'success',
}) => {
  notification.innerHTML = message;
  notification.classList.add(status);
  notification.classList.add('active');
  setTimeout(() => notification.classList.remove('active'), timeout);
};
const confirmAction = (message, callback) => {
  confirmDialog.innerHTML = `
  <p>${message}</p>
  <button id='cancel' class="btn round cancel">Cancel</button>
  <button id='proceed' class="btn round">Confirm</button>  
  `;
  confirmDialog.classList.add('active');
  confirmDialog.querySelector('#proceed').addEventListener('click', () => {
    confirmDialog.classList.remove('active');
    callback();
  });
  confirmDialog.querySelector('#cancel').addEventListener('click', () => {
    confirmDialog.classList.remove('active');
  });
};
const changeAddView = () => {
  const h2 = document.querySelector('section.add-diary h2');
  const editForm = document.forms['edit-entry'];
  h2.textContent = editMode && entries[currentDiary] ? 'Edit diary entry' : 'Add new entry';
  editForm.update.value = editMode && entries[currentDiary] ? 'Update' : 'Add';
  if (editMode && entries[currentDiary]) {
    editForm.title.value = entries[currentDiary].title;
    editForm.body.value = entries[currentDiary].body;
  }
  initInput();
  showAddDiaryView = true;
  slideTo();
};
const editDiary = () => {
  if (!entries[currentDiary]) return;
  editMode = true;
  changeAddView();
};
const addDiary = () => {
  if (editMode) document.forms['edit-entry'].reset();
  editMode = false;
  changeAddView();
};
initInput();
const signup = async (event) => {
  event.preventDefault();
  const form = event.target;
  const body = {};
  body.fullName = form.fullName.value;
  body.username = form.username.value;
  body.password = form.password.value;
  body.email = form.email.value;
  try {
    const response = await fetch(`${apiRoot}/auth/signup`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      form.reset();
      initInput();
      showNotification({
        message: 'Your account has been created',
      });
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const login = async (event) => {
  event.preventDefault();
  const form = event.target;
  const body = {};
  body.username = form.username.value;
  body.password = form.password.value;
  try {
    const response = await fetch(`${apiRoot}/auth/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(body),
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      form.reset();
      initInput();
      localStorage.setItem('user', JSON.stringify(jsonResponse.data));
      showNotification({
        message: 'Login successful',
      });
      setTimeout(() => window.location.assign('home.html'), 1000);
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const setNotification = async (status) => {
  try {
    const response = await fetch(`${apiRoot}/push/subscribe`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': JSON.parse(localStorage.getItem('user')).token,
      },
      body: JSON.stringify({
        status,
        subscription: status && pushSubscription ? pushSubscription : {},
      }),
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      const user = JSON.parse(localStorage.getItem('user'));
      user.notificationStatus = jsonResponse.data.status;
      localStorage.setItem('user', JSON.stringify(user));
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const addEntry = async (event) => {
  event.preventDefault();
  const form = event.target;
  const diary = {};
  diary.title = form.title.value;
  diary.body = form.body.value;
  try {
    const response = await fetch(editMode ? `${apiRoot}/entries/${entries[currentDiary].id}` : `${apiRoot}/entries`, {
      method: editMode ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': JSON.parse(localStorage.getItem('user')).token,
      },
      body: JSON.stringify(diary),
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      form.reset();
      initInput();
      if (editMode) {
        entries[currentDiary] = jsonResponse.data;
      } else {
        entries.unshift(jsonResponse.data);
      }
      initDiaries();
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const deleteEntry = async () => {
  if (!entries[currentDiary]) return;
  try {
    const response = await fetch(`${apiRoot}/entries/${entries[currentDiary].id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'x-auth-token': JSON.parse(localStorage.getItem('user')).token,
      },
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      entries.splice(currentDiary, 1);
      if (!entries[currentDiary]) currentDiary -= 1;
      if (currentDiary < 0) currentDiary = 0;
      initDiaries();
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const getEntries = async () => {
  initDiaries();
  try {
    const response = await fetch(`${apiRoot}/entries`, {
      mode: 'cors',
      headers: {
        'x-auth-token': JSON.parse(localStorage.getItem('user')).token,
      },
    });
    const jsonResponse = await response.json();
    if (response.ok) {
      entries = jsonResponse.data;
      initDiaries();
      return jsonResponse.data;
    }
    throw new Error(jsonResponse.error);
  } catch (error) {
    return showNotification({
      message: error.message,
      status: 'error',
      timeout: 7000,
    });
  }
};
const logout = () => {
  localStorage.clear();
  window.location.assign('index.html');
};
