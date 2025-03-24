// URL публичного JSON-файла
const USERS_JSON_URL = 'https://raw.githubusercontent.com/A1ame/train22/main/users.json';
const GITHUB_API_URL = 'https://api.github.com/repos/A1ame/train22/contents/users.json';
const GITHUB_TOKEN = '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'; // Замени на свой токен

// Загрузка пользователей из публичного JSON
async function loadUsersFromJson() {
  try {
    const response = await fetch(USERS_JSON_URL);
    if (!response.ok) throw new Error('Не удалось загрузить users.json');
    return await response.json();
  } catch (error) {
    console.error(error);
    return { users: [] };
  }
}

// Обновление users.json через GitHub API
async function updateUsersJson(newUser) {
  const usersData = await loadUsersFromJson();
  usersData.users.push(newUser);

  // Получаем текущий SHA файла
  const getResponse = await fetch(GITHUB_API_URL, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const fileData = await getResponse.json();
  const sha = fileData.sha;

  // Обновляем файл
  const updateResponse = await fetch(GITHUB_API_URL, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: `Add new user: ${newUser.username}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(usersData, null, 2)))),
      sha: sha
    })
  });

  if (updateResponse.ok) {
    console.log('users.json успешно обновлен');
    return true;
  } else {
    console.error('Ошибка при обновлении users.json:', await updateResponse.json());
    return false;
  }
}

// Проверка авторизации
function checkAuth() {
  return !!localStorage.getItem('currentUser');
}

// Редирект на login.html, если не авторизован
if (window.location.pathname.includes('index.html') && !checkAuth()) {
  window.location.href = 'login.html';
}

// Логика для всех страниц
document.addEventListener('DOMContentLoaded', async function() {
  const loginFormContainer = document.getElementById('login-form-container');
  const genderSelection = document.getElementById('gender-selection');
  const registerFormContainer = document.getElementById('register-form-container');
  const loginForm = document.getElementById('login-form');
  const toRegisterButton = document.getElementById('to-register-button');
  const registerForm = document.getElementById('register-form');
  const backToLoginButton = document.getElementById('back-to-login-button');
  let selectedGender = null;

  if (loginFormContainer && genderSelection && registerFormContainer) {
    toRegisterButton.addEventListener('click', function() {
      loginFormContainer.style.display = 'none';
      genderSelection.style.display = 'block';
    });

    document.querySelectorAll('.gender-card').forEach(card => {
      card.addEventListener('click', function() {
        selectedGender = this.dataset.gender;
        genderSelection.style.display = 'none';
        registerFormContainer.style.display = 'block';
      });
    });

    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      const usersData = await loadUsersFromJson();
      const user = usersData.users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        alert('Неверный логин или пароль');
      }
    });

    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;

      const usersData = await loadUsersFromJson();
      const localUser = JSON.parse(localStorage.getItem('currentUser'));
      if (usersData.users.some(u => u.username === username) || (localUser && localUser.username === username)) {
        alert('Пользователь с таким логином уже существует');
        return;
      }

      const newUser = {
        username,
        password,
        gender: selectedGender,
        joinDate: new Date().toISOString().split('T')[0]
      };

      // Сохраняем локально и пытаемся обновить на GitHub
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      const updated = await updateUsersJson(newUser);

      if (updated) {
        alert('Регистрация успешна! Данные сохранены в users.json.');
      } else {
        alert('Регистрация успешна локально, но не удалось обновить users.json. Добавьте пользователя вручную.');
      }
      window.location.href = 'index.html';
    });

    backToLoginButton.addEventListener('click', function() {
      registerFormContainer.style.display = 'none';
      loginFormContainer.style.display = 'block';
    });
  }

  const profileUsername = document.getElementById('profile-username');
  const profileGender = document.getElementById('profile-gender');
  const profileJoinDate = document.getElementById('profile-join-date');
  const logoutButton = document.getElementById('logout-button');

  if (profileUsername && profileGender && profileJoinDate) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const usersData = await loadUsersFromJson();
      const serverUser = usersData.users.find(u => u.username === currentUser.username) || currentUser;

      profileUsername.textContent = serverUser.username;
      profileGender.textContent = serverUser.gender === 'male' ? 'Мужчина' : 'Женщина';
      profileJoinDate.textContent = serverUser.joinDate;
    }

    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }

  const homeContainer = document.querySelector('.home-container');
  const categoryContainer = document.querySelector('.category-container');
  
  if (homeContainer) {
    setTimeout(() => homeContainer.style.opacity = '1', 100);
  }
  
  if (categoryContainer) {
    setTimeout(() => categoryContainer.style.opacity = '1', 100);
  }
  
  setupARView();
});

function setupARView() {
  const arInactive = document.getElementById('ar-inactive');
  const arActive = document.getElementById('ar-active');
  const arLoading = document.getElementById('ar-loading');
  
  if (!arInactive || !arActive) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const exerciseData = exercisesData[exerciseId];
  
  if (exerciseData) {
    document.getElementById('exercise-title').textContent = exerciseData.name;
    document.getElementById('ar-exercise-name').textContent = exerciseData.name;
    document.getElementById('ar-exercise-description').textContent = exerciseData.description;
    document.getElementById('ar-overlay-title').textContent = exerciseData.name;
    document.getElementById('ar-overlay-description').textContent = exerciseData.description;
    
    if (exerciseData.demoImage) {
      document.getElementById('demo-image').src = exerciseData.demoImage;
    }
  }
  
  const startARButton = document.getElementById('start-ar-button');
  if (startARButton) {
    startARButton.addEventListener('click', function() {
      arInactive.style.display = 'none';
      arActive.style.display = 'block';
      setTimeout(() => arLoading.style.display = 'none', 2000);
    });
  }
  
  const stopARButton = document.getElementById('stop-ar-button');
  if (stopARButton) {
    stopARButton.addEventListener('click', function() {
      arActive.style.display = 'none';
      arInactive.style.display = 'flex';
      arLoading.style.display = 'flex';
    });
  }
}

const exercisesData = {
  'pushups': { name: 'Отжимания', description: 'Классическое упражнение для развития грудных мышц, трицепсов и плеч', difficulty: 'beginner', duration: '3 подхода по 15 раз', demoImage: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?q=80&w=1770&auto=format&fit=crop' },
  'squats': { name: 'Приседания', description: 'Базовое упражнение для развития мышц ног и ягодиц', difficulty: 'beginner', duration: '4 подхода по 20 раз', demoImage: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1770&auto=format&fit=crop' },
  'pullups': { name: 'Подтягивания', description: 'Эффективное упражнение для развития мышц спины и бицепсов', difficulty: 'intermediate', duration: '3 подхода по 8-12 раз', demoImage: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1776&auto=format&fit=crop' },
  'dumbbell-press': { name: 'Жим гантелей', description: 'Упражнение для развития грудных мышц и трицепсов с использованием гантелей', difficulty: 'intermediate', duration: '4 подхода по 10-12 раз', demoImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1770&auto=format&fit=crop' },
  'deadlift': { name: 'Становая тяга', description: 'Комплексное упражнение для развития мышц спины, ног и кора', difficulty: 'advanced', duration: '3 подхода по 8-10 раз', demoImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1769&auto=format&fit=crop' }
};
