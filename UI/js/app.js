const apiRoot = 'http://localhost:3030/api/v1';
const fetchedDiaries = [
  {
    title: 'My awesome diary',
    date: 'Mar 2',
    desc: 'I love myDiary cos its awesome, and Im a big fan of "awesome". Sapiente tenetur excepturi quam blanditiis placeat! Suscipit repellat perferendis exercitationem quos corrupti nihil molestias sequi incidunt distinctio idipsum dolor sit amet consectetur adipisicing elit. Impedit sed vitae cupiditate quidem, aliquam cumque dolore ea, pariatur, fugiat similique consequuntur necessitatibus architecto et quae! Mollitia porro illum velit modi!',
  },
  {
    title: 'A beautiful day',
    date: 'jun 20',
    desc: 'The sun is shining bright and the sky. The birds fly flapping their wings like a beautiful song ipsum dolor sit amet, consectetur adipisicing elit. Minima totam quae obcaecati. Sapiente tenetur excepturi quam blanditiis placeat! Suscipit repellat perferendis exercitationem quos corrupti nihil molestias sequi incidunt distinctio idipsum dolor sit amet consectetur adipisicing elit. Impedit sed vitae cupiditate quidem, aliquam cumque dolore ea, pariatur, fugiat similique consequuntur necessitatibus architecto et quae! Mollitia porro illum velit modi!',
  },
  {
    title: 'Why I love Andela',
    date: 'jun 24',
    desc: 'I love Andela cos there are lots of beautiful faces and quam blanditiis placeat! Suscipit repellat perferendis exercitationem quos corrupti nihil molestias sequi incidunt distinctio idipsum dolor sit amet consectetur adipisicing elit. Impedit sed vitae cupiditate quidem, aliquam cumque dolore ea, pariatur, fugiat similique consequuntur necessitatibus architecto et quae! Mollitia porro illum velit modi!',
  },
  {
    title: 'My super awesome diary',
    date: 'jun 27',
    desc: 'This is my super awesom diary because piente tenetur excepturi quam blanditiis placeat! Suscipit repellat perferendis exercitationem quos corrupti nihil molestias sequi incidunt distinctio idipsum dolor sit amet consectetur adipisicing elit. Impedit sed vitae cupiditate quidem, aliquam cumque dolore ea, pariatur, fugiat similique consequuntur necessitatibus architecto et quae! Mollitia porro illum velit modi!',
  },
];
let showAddDiaryView = false;
let currentDiary;
const initInput = () => {
  const inputFields = document.querySelectorAll('.input > input, .textarea > textarea');
  if (inputFields.length === 0) return;
  for (inputField of inputFields) {
    if (inputField.value) inputField.focus();
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
  console.log('resize');
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
const showAdd = () => {
  showAddDiaryView = true;
  slideTo();
};
const hideAdd = () => {
  showAddDiaryView = false;
  slideTo();
};
const navigateTo = (url) => {
  window.location.assign = url;
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
    <span id="date">15</span>
    <span id="day">TUESDAY</span>
  </div>
  `;
  const ul = document.createElement('ul');
  for (const [i, diary] of fetchedDiaries.entries()) {
    const li = document.createElement('li');
    const template = `
    <span class="pointer"></span>
    <h4 class="title">${diary.title}</h4>
    <p class="desc">${diary.desc}</p>
    <span class="date">${diary.date.split(' ')[0]}<br />${diary.date.split(' ')[1]}</span>
    `;
    li.innerHTML = template;
    li.addEventListener('click', () => readDiary(i));
    ul.appendChild(li);
  }
  diaries.appendChild(ul);
  readDiary(currentDiary);
};
let readDiary = (i = 0) => {
  let diary = fetchedDiaries[i];
  if (!diary) {
    diary = fetchedDiaries[0];
    currentDiary = 0;
  }
  currentDiary = i;
  diary = diary || { title: 'You have not added any entries to your diary', date: '', desc: 'Please click the green  button at bottom left to get started' };
  document.querySelector('section.diary h2').textContent = diary.title;
  document.querySelector('section.diary .date').textContent = diary.date;
  document.querySelector('section.diary .desc').textContent = diary.desc;
  const diaryList = document.querySelectorAll('section.diaries ul > li');
  if (diaryList.length === 0) return;
  for (const diary of diaryList) {
    diary.classList.remove('active');
  }
  diaryList[currentDiary].classList.add('active');
};
const deleteDiary = (i) => {
  fetchedDiaries.splice(i, 1);
  initDiaries();
};
const editDiary = (payload) => {
  const dataToEdit = payload || fetchedDiaries[currentDiary];
  if (!dataToEdit) return;
  const h2 = document.querySelector('section.add-diary h2');
  const editForm = document.forms['edit-entry'];
  editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    this.reset();
    hideAdd();
  });
  h2.textContent = dataToEdit.header || 'Edit diary entry';
  editForm.title.value = dataToEdit.title;
  editForm.event.value = dataToEdit.desc;
  editForm.update.value = dataToEdit.update || 'Update';
  initInput();
  showAdd();
};
const addDiary = () => editDiary({
  header: 'Add diary Entry', update: 'add', title: '', desc: '',
});
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
      setTimeout(initInput, 500);
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
      setTimeout(initInput, 500);
      localStorage.setItem('user', JSON.stringify(jsonResponse.data));
      window.location.assign('/UI/home.html');
    } else if (jsonResponse.error) {
      const error = jsonResponse.error.map(eachError => `<p>${eachError}</p>`)
        .join('');
      throw new Error(error);
    }
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
};
const logout = () => {
  localStorage.clear();
  window.location.assign('/UI/index.html');
}
// const authenticate = ({
//   security = 'protected',
//   redirect = true,
//   url = '/UI/index.html',
// }) => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if (security === 'protected' && !user.token) {
//     window.location.assign(url);
//   } else if (security !== 'protected' && redirect) {
//     window.location.assign('/UI/home.html');
//   }
// };
