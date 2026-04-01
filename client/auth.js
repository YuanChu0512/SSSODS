const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const displayNameInput = document.getElementById('display-name');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const authMessage = document.getElementById('auth-message');
const authBadge = document.getElementById('auth-badge');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const asideEyebrow = document.getElementById('aside-eyebrow');
const asideTitle = document.getElementById('aside-title');
const asideText = document.getElementById('aside-text');
const backHomeLink = document.getElementById('back-home-link');
const usernameLabel = document.getElementById('username-label');
const passwordLabel = document.getElementById('password-label');
const displayNameLabel = document.getElementById('display-name-label');
const footerText = document.getElementById('footer-text');
const footerLink = document.getElementById('footer-link');
const langZhButton = document.getElementById('lang-zh');
const langEnButton = document.getElementById('lang-en');

const isRegisterPage = window.location.pathname.endsWith('/register.html') || window.location.pathname.endsWith('register.html');
let currentLanguage = localStorage.getItem('seatMonitorLanguage') || 'en';

const translations = {
  en: {
    htmlLang: 'en',
    loginTitle: 'Login',
    registerTitle: 'Register',
    loginBadge: 'Account Access',
    registerBadge: 'Create Account',
    loginSubtitle: 'Enter your username and password to continue.',
    registerSubtitle: 'Fill in your information to create a new student account.',
    asideEyebrow: 'Smart Study Space',
    loginAsideTitle: 'Welcome Back',
    registerAsideTitle: 'Create Your Account',
    loginAsideText: 'Sign in to check the latest seat status and manage your reservation.',
    registerAsideText: 'Register a student account to reserve the seat and track reservation activity.',
    backHome: 'Dashboard',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    displayNameLabel: 'Display Name',
    usernamePlaceholder: isRegisterPage ? 'Choose a username' : 'Enter your username',
    passwordPlaceholder: isRegisterPage ? 'At least 6 characters' : 'Enter your password',
    displayNamePlaceholder: 'Enter your display name',
    loginButton: 'Login',
    registerButton: 'Register',
    loginFooterText: 'Need a new account?',
    registerFooterText: 'Already have an account?',
    loginFooterLink: 'Register here',
    registerFooterLink: 'Go to login',
    defaultMessage: 'System messages will appear here.',
    registrationSuccessful: 'Registration successful. Redirecting to dashboard...',
    loginSuccessful: 'Login successful. Redirecting to dashboard...',
    invalidUsernameOrPassword: 'Invalid username or password.',
    usernameExists: 'Username already exists.'
  },
  zh: {
    htmlLang: 'zh-CN',
    loginTitle: '\u767b\u5f55',
    registerTitle: '\u6ce8\u518c',
    loginBadge: '\u8d26\u6237\u8bbf\u95ee',
    registerBadge: '\u521b\u5efa\u8d26\u6237',
    loginSubtitle: '\u8f93\u5165\u4f60\u7684\u7528\u6237\u540d\u548c\u5bc6\u7801\u540e\u7ee7\u7eed\u3002',
    registerSubtitle: '\u586b\u5199\u4f60\u7684\u4fe1\u606f\uff0c\u521b\u5efa\u65b0\u7684\u5b66\u751f\u8d26\u6237\u3002',
    asideEyebrow: '\u667a\u80fd\u81ea\u4e60\u7a7a\u95f4',
    loginAsideTitle: '\u6b22\u8fce\u56de\u6765',
    registerAsideTitle: '\u521b\u5efa\u4f60\u7684\u8d26\u6237',
    loginAsideText: '\u767b\u5f55\u540e\u67e5\u770b\u6700\u65b0\u5ea7\u4f4d\u72b6\u6001\uff0c\u5e76\u7ba1\u7406\u4f60\u7684\u9884\u7ea6\u3002',
    registerAsideText: '\u6ce8\u518c\u5b66\u751f\u8d26\u6237\uff0c\u7528\u4e8e\u9884\u7ea6\u5ea7\u4f4d\u5e76\u8ddf\u8e2a\u4f7f\u7528\u8bb0\u5f55\u3002',
    backHome: '\u4e3b\u9875',
    usernameLabel: '\u7528\u6237\u540d',
    passwordLabel: '\u5bc6\u7801',
    displayNameLabel: '\u663e\u793a\u540d\u79f0',
    usernamePlaceholder: isRegisterPage ? '\u8bf7\u8bbe\u7f6e\u7528\u6237\u540d' : '\u8bf7\u8f93\u5165\u7528\u6237\u540d',
    passwordPlaceholder: isRegisterPage ? '\u81f3\u5c11 6 \u4f4d\u5b57\u7b26' : '\u8bf7\u8f93\u5165\u5bc6\u7801',
    displayNamePlaceholder: '\u8bf7\u8f93\u5165\u663e\u793a\u540d\u79f0',
    loginButton: '\u767b\u5f55',
    registerButton: '\u6ce8\u518c',
    loginFooterText: '\u8fd8\u6ca1\u6709\u8d26\u6237\uff1f',
    registerFooterText: '\u5df2\u7ecf\u6709\u8d26\u6237\uff1f',
    loginFooterLink: '\u53bb\u6ce8\u518c',
    registerFooterLink: '\u53bb\u767b\u5f55',
    defaultMessage: '\u7cfb\u7edf\u6d88\u606f\u4f1a\u663e\u793a\u5728\u8fd9\u91cc\u3002',
    registrationSuccessful: '\u6ce8\u518c\u6210\u529f\uff0c\u6b63\u5728\u8df3\u8f6c\u5230\u4e3b\u9875...',
    loginSuccessful: '\u767b\u5f55\u6210\u529f\uff0c\u6b63\u5728\u8df3\u8f6c\u5230\u4e3b\u9875...',
    invalidUsernameOrPassword: '\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef\u3002',
    usernameExists: '\u8be5\u7528\u6237\u540d\u5df2\u5b58\u5728\u3002'
  }
};

function t(key) {
  return translations[currentLanguage][key];
}

function getToken() {
  return localStorage.getItem('seatMonitorToken') || '';
}

function setSession(token) {
  if (token) {
    localStorage.setItem('seatMonitorToken', token);
  } else {
    localStorage.removeItem('seatMonitorToken');
  }
}

async function apiFetch(url, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    throw error;
  }

  return data;
}

function localizeMessage(message) {
  const map = {
    'Registration successful.': t('registrationSuccessful'),
    'Login successful.': t('loginSuccessful'),
    'Invalid username or password.': t('invalidUsernameOrPassword'),
    'Username already exists.': t('usernameExists')
  };

  return map[message] || message;
}

function setMessage(message) {
  authMessage.textContent = message ? localizeMessage(message) : t('defaultMessage');
}

function applyTranslations() {
  localStorage.setItem('seatMonitorLanguage', currentLanguage);
  document.documentElement.lang = t('htmlLang');
  document.title = isRegisterPage ? t('registerTitle') : t('loginTitle');
  asideEyebrow.textContent = t('asideEyebrow');
  asideTitle.textContent = isRegisterPage ? t('registerAsideTitle') : t('loginAsideTitle');
  asideText.textContent = isRegisterPage ? t('registerAsideText') : t('loginAsideText');
  authBadge.textContent = isRegisterPage ? t('registerBadge') : t('loginBadge');
  authTitle.textContent = isRegisterPage ? t('registerTitle') : t('loginTitle');
  authSubtitle.textContent = isRegisterPage ? t('registerSubtitle') : t('loginSubtitle');
  backHomeLink.textContent = t('backHome');
  usernameLabel.textContent = t('usernameLabel');
  passwordLabel.textContent = t('passwordLabel');
  usernameInput.placeholder = t('usernamePlaceholder');
  passwordInput.placeholder = t('passwordPlaceholder');

  if (displayNameInput && displayNameLabel) {
    displayNameLabel.textContent = t('displayNameLabel');
    displayNameInput.placeholder = t('displayNamePlaceholder');
  }

  if (loginButton) {
    loginButton.textContent = t('loginButton');
  }

  if (registerButton) {
    registerButton.textContent = t('registerButton');
  }

  footerText.textContent = isRegisterPage ? t('registerFooterText') : t('loginFooterText');
  footerLink.textContent = isRegisterPage ? t('registerFooterLink') : t('loginFooterLink');
  langZhButton.classList.toggle('active', currentLanguage === 'zh');
  langEnButton.classList.toggle('active', currentLanguage === 'en');
}

async function login() {
  try {
    const result = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim()
      })
    });

    setSession(result.token);
    setMessage(result.message);
    window.setTimeout(() => {
      window.location.href = './index.html';
    }, 250);
  } catch (error) {
    setMessage(error.message);
  }
}

async function register() {
  try {
    const result = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: displayNameInput.value.trim(),
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim()
      })
    });

    setSession(result.token);
    setMessage(result.message);
    window.setTimeout(() => {
      window.location.href = './index.html';
    }, 250);
  } catch (error) {
    setMessage(error.message);
  }
}

langZhButton.addEventListener('click', () => {
  currentLanguage = 'zh';
  applyTranslations();
  setMessage('');
});

langEnButton.addEventListener('click', () => {
  currentLanguage = 'en';
  applyTranslations();
  setMessage('');
});

if (loginButton) {
  loginButton.addEventListener('click', login);
}

if (registerButton) {
  registerButton.addEventListener('click', register);
}

(function initializeAuthPage() {
  if (getToken()) {
    window.location.href = './index.html';
    return;
  }

  applyTranslations();
  setMessage('');
})();
