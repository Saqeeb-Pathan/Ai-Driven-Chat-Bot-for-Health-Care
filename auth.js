/* Login + Registration (ready for backend integration) */

const USE_MOCK = true; // set to false when wiring real API

// Elements
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertBox = document.getElementById('alertBox');

const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

const pwd = document.getElementById('regPassword');
const confirmPwd = document.getElementById('regConfirm');
const pwdBar = document.getElementById('pwdBar');
const pwdHint = document.getElementById('pwdHint');
const matchHint = document.getElementById('matchHint');

// Tabs
function showLogin() {
  tabLogin.classList.add('active'); tabLogin.setAttribute('aria-selected', 'true');
  tabRegister.classList.remove('active'); tabRegister.setAttribute('aria-selected', 'false');
  loginForm.classList.add('active'); registerForm.classList.remove('active');
  clearAlert();
}
function showRegister() {
  tabRegister.classList.add('active'); tabRegister.setAttribute('aria-selected', 'true');
  tabLogin.classList.remove('active'); tabLogin.setAttribute('aria-selected', 'false');
  registerForm.classList.add('active'); loginForm.classList.remove('active');
  clearAlert();
}

tabLogin.addEventListener('click', showLogin);
tabRegister.addEventListener('click', showRegister);
switchToRegister.addEventListener('click', showRegister);
switchToLogin.addEventListener('click', showLogin);

// Toggle password visibility
document.querySelectorAll('.eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-target');
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// Password strength
function strengthScore(s) {
  let score = 0;
  if (s.length >= 8) score++;
  if (/[A-Z]/.test(s)) score++;
  if (/[a-z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  return Math.min(score, 5);
}
function updateStrength() {
  const s = pwd.value;
  const sc = strengthScore(s); // 0..5
  const pct = (sc / 5) * 100;
  pwdBar.style.width = `${pct}%`;
  if (sc <= 2) {
    pwdBar.style.background = '#ff6b6b';
  } else if (sc === 3) {
    pwdBar.style.background = '#ffd166';
  } else {
    pwdBar.style.background = '#3bd671';
  }
  pwdHint.textContent = sc < 4 ? 'Stronger passwords mix upper/lowercase, numbers, and symbols.' : 'Strong password ✔';
}
function confirmMatch() {
  if (!confirmPwd.value) { matchHint.textContent = ''; return; }
  if (pwd.value === confirmPwd.value) {
    matchHint.textContent = 'Passwords match ✔'; matchHint.className = 'hint success';
  } else {
    matchHint.textContent = 'Passwords do not match'; matchHint.className = 'hint error';
  }
}
pwd.addEventListener('input', () => { updateStrength(); confirmMatch(); });
confirmPwd.addEventListener('input', confirmMatch);

// Alerts
function setAlert(msg, type = 'success') {
  alertBox.className = `alert ${type}`;
  alertBox.textContent = msg;
}
function clearAlert() { setAlert(''); }

// Mock backend (localStorage) for quick testing
const LS_USERS = 'ha_users_v1';
const LS_SESSION = 'ha_session_v1';

const mock = {
  readUsers() {
    try { return JSON.parse(localStorage.getItem(LS_USERS)) || []; } catch { return []; }
  },
  writeUsers(list) { localStorage.setItem(LS_USERS, JSON.stringify(list)); },
  encode(s) { return btoa(unescape(encodeURIComponent(s))); }, // not secure; demo only
  login(email, password) {
    const users = mock.readUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, message: 'User not found' };
    if (u.pass !== mock.encode(password)) return { ok: false, message: 'Invalid password' };
    const token = Math.random().toString(36).slice(2);
    localStorage.setItem(LS_SESSION, JSON.stringify({ token, user: { id: u.id, name: u.name, email: u.email } }));
    return { ok: true, user: { id: u.id, name: u.name, email: u.email }, token };
  },
  register(name, email, password) {
    const users = mock.readUsers();
    if (users.some(x => x.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Email already registered' };
    }
    const id = Math.random().toString(36).slice(2);
    users.push({ id, name, email, pass: mock.encode(password) });
    mock.writeUsers(users);
    return { ok: true, user: { id, name, email } };
  }
};

// Real API placeholders
async function apiLogin(email, password, remember) {
  if (USE_MOCK) return new Promise(r => setTimeout(() => r(mock.login(email, password)), 400));

  // Replace with your backend
  // const res = await fetch('/api/auth/login', {
  //   method: 'POST', headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password, remember })
  // });
  // return res.json();
}
async function apiRegister(name, email, password) {
  if (USE_MOCK) return new Promise(r => setTimeout(() => r(mock.register(name, email, password)), 500));

  // Replace with your backend
  // const res = await fetch('/api/auth/register', {
  //   method: 'POST', headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, email, password })
  // });
  // return res.json();
}

// Submit handlers
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(loginForm);
  const email = fd.get('email').trim();
  const password = fd.get('password');
  const remember = fd.get('remember') === 'on';

  setAlert('Signing in…', 'success');
  const result = await apiLogin(email, password, remember);
  if (result?.ok) {
    setAlert('Signed in successfully. Redirecting…', 'success');
    // Redirect to app (or read ?next=)
    const params = new URLSearchParams(location.search);
    const next = params.get('next') || '/';
    setTimeout(() => location.href = next, 750);
  } else {
    setAlert(result?.message || 'Sign-in failed', 'error');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(registerForm);
  const name = fd.get('name').trim();
  const email = fd.get('email').trim();
  const password = fd.get('password');
  const confirm = fd.get('confirm');

  // Basic validation
  if (password !== confirm) { setAlert('Passwords do not match', 'error'); return; }
  if (strengthScore(password) < 3) { setAlert('Password too weak. Please strengthen it.', 'error'); return; }

  setAlert('Creating your account…', 'success');
  const result = await apiRegister(name, email, password);
  if (result?.ok) {
    setAlert('Account created. You can now sign in.', 'success');
    showLogin();
  } else {
    setAlert(result?.message || 'Registration failed', 'error');
  }
});

// Initialize defaults
updateStrength();
clearAlert();