// const apiRoot = 'http://localhost:3030/api/v1';
const apiRoot = 'https://api-mydiary.herokuapp.com/api/v1';
const days = ['SUNDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const now = new Date();
let entries = [];
let editMode = false;
let showAddDiaryView = false;
let currentDiary;
const initInput = () => {
  const inputFields = document.querySelectorAll('.input > input, .textarea > textarea');
  if (inputFields.length === 0) return;
  for (inputField of inputFields) {
    if (inputField.value) inputField.parentNode.classList.add('active');
    else inputField.parentNode.classList.remove('active');
    inputField.addEventListener('focus', function () {
      this.parentNode.classList.add('active');
    });
    inputField.addEventListener('blur', function () {
      if (!this.value) this.parentNode.classList.remove('active');
    });
  }
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
const removeSettings = () => {
  document.querySelector('footer .settings').classList.remove('active');
};
const initDropdown = () => {
  document.querySelector('.drop-container .drop').addEventListener('click', e => e.stopPropagation());
};
const initDiaries = () => {
  const diaries = document.querySelector('section.diaries');
  diaries.innerHTML = `
  <div class="today">
    <span id="date">${now.getDate()}</span>
    <span id="day">${days[now.getDay() - 1]}</span>
  </div>
  `;
  const ul = document.createElement('ul');
  for (const [i, diary] of entries.entries()) {
    let created = new Date(diary.created);
    const li = document.createElement('li');
    const template = `
    <span class="pointer"></span>
    <h4 class="title">${diary.title}</h4>
    <p class="body">${diary.body}</p>
    <span class="date">${months[created.getMonth()]}<br />${created.getDate()}</span>
    `;
    li.innerHTML = template;
    li.addEventListener('click', () => readDiary(i));
    ul.appendChild(li);
  }
  diaries.appendChild(ul);
  readDiary(currentDiary);
};
let readDiary = (i = 0) => {
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
  const diaryList = document.querySelectorAll('section.diaries ul > li');
  if (diaryList.length === 0) return;
  for (const diary of diaryList) {
    diary.classList.remove('active');
  }
  diaryList[currentDiary].classList.add('active');
  hideAdd();
};
const deleteDiary = (i) => {
  entries.splice(i, 1);
  initDiaries();
};
const changeAddView = () => {
  const h2 = document.querySelector('section.add-diary h2');
  const editForm = document.forms['edit-entry'];
  h2.textContent = editMode && entries[currentDiary] ? 'Edit diary entry' : 'Add new entry';
  editForm.title.value = editMode && entries[currentDiary] ? entries[currentDiary].title : '';
  editForm.body.value = editMode && entries[currentDiary] ? entries[currentDiary].body : '';
  editForm.update.value = editMode && entries[currentDiary] ? 'Update' : 'Add';
  initInput();
  showAddDiaryView = true;
  slideTo();
};
const editDiary = () => {
  editMode = true;
  changeAddView();
};
const addDiary = () => {
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
      alert('Your account has been created');
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    alert(error.message);
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
      window.location.assign('home.html');
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    alert(error.message);
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
        entries.push(jsonResponse.data);
      }
      initDiaries();
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    alert(error.message);
  }
};
const getEntries = async () => {
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
    alert(error);
  }
};
const logout = () => {
  localStorage.clear();
  window.location.assign('index.html');
};
