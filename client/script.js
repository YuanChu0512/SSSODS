const seatLabel = document.getElementById('seat-label');
const occupancyBadge = document.getElementById('occupancy-badge');
const occupancyText = document.getElementById('occupancy-text');
const reservationBadge = document.getElementById('reservation-badge');
const reservationText = document.getElementById('reservation-text');
const displayNameInput = document.getElementById('display-name');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const reserveButton = document.getElementById('reserve-button');
const cancelButton = document.getElementById('cancel-button');
const actionMessage = document.getElementById('action-message');
const authStatus = document.getElementById('auth-status');
const occupancyLog = document.getElementById('occupancy-log');
const reservationLog = document.getElementById('reservation-log');
const pageTitle = document.getElementById('page-title');
const eyebrow = document.getElementById('eyebrow');
const occupancyPanelLabel = document.getElementById('occupancy-panel-label');
const reservationPanelLabel = document.getElementById('reservation-panel-label');
const authHeading = document.getElementById('auth-heading');
const reservationHeading = document.getElementById('reservation-heading');
const reservationHelper = document.getElementById('reservation-helper');
const activityHeading = document.getElementById('activity-heading');
const occupancyLogLabel = document.getElementById('occupancy-log-label');
const reservationLogLabel = document.getElementById('reservation-log-label');
const displayNameLabel = document.getElementById('display-name-label');
const usernameLabel = document.getElementById('username-label');
const passwordLabel = document.getElementById('password-label');
const langZhButton = document.getElementById('lang-zh');
const langEnButton = document.getElementById('lang-en');

const translations = {
  en: {
    htmlLang: 'en',
    title: 'Seat Management Dashboard',
    eyebrow: 'Study Seat Platform',
    seatLabel: 'Seat ID',
    occupancyPanelLabel: 'Occupancy',
    reservationPanelLabel: 'Reservation',
    authHeading: 'User Account',
    authSignedOut: 'Not signed in.',
    authSignedIn: (name) => `Signed in as ${name}.`,
    reservationHeading: 'Seat Reservation',
    reservationHelper: 'Sign in first, then reserve or cancel the seat.',
    activityHeading: 'Recent Activity',
    occupancyLogLabel: 'Recent Occupancy Events',
    reservationLogLabel: 'Recent Reservations',
    displayNameLabel: 'Display Name',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    displayNamePlaceholder: 'Enter your display name',
    usernamePlaceholder: 'Enter a username',
    passwordPlaceholder: 'At least 6 characters',
    registerButton: 'Register',
    loginButton: 'Login',
    logoutButton: 'Logout',
    reserveButton: 'Reserve Seat',
    cancelButton: 'Cancel Reservation',
    loading: 'Loading...',
    occupancyFree: 'Free',
    occupancyOccupied: 'Occupied',
    reservationReserved: 'Reserved',
    reservationNotReserved: 'Not Reserved',
    occupancyOccupiedText: 'The sensor currently reports that someone is sitting in this seat.',
    occupancyFreeText: 'The sensor currently reports that this seat is empty.',
    reservationReservedText: (reservedBy) => reservedBy ? `This seat is currently reserved by ${reservedBy}.` : 'This seat is currently reserved.',
    reservationNotReservedText: 'This seat is currently not reserved.',
    systemMessageDefault: 'System messages will appear here.',
    needLoginMessage: 'Please log in before making a reservation.',
    unavailable: 'Unavailable',
    fetchOccupancyError: 'Unable to load occupancy status from the server.',
    fetchReservationError: 'Unable to load reservation status from the server.',
    noOccupancyEvents: 'No occupancy events have been recorded yet.',
    noReservations: 'No reservations have been recorded yet.',
    occupancyLogItem: (item) => `${item.occupancyStatus} from ${item.source} at ${formatDate(item.createdAt)}`,
    reservationLogItem: (item) => `${item.displayName || item.username} - ${item.status} at ${formatDate(item.createdAt)}`,
    registrationSuccessful: 'Registration successful.',
    loginSuccessful: 'Login successful.',
    logoutSuccessful: 'Logged out successfully.',
    invalidUsernameOrPassword: 'Invalid username or password.',
    usernameExists: 'Username already exists.',
    cancelOwnOnly: 'Only the user who reserved the seat can cancel it.'
  },
  zh: {
    htmlLang: 'zh-CN',
    title: '\u5ea7\u4f4d\u7ba1\u7406\u9762\u677f',
    eyebrow: '\u81ea\u4e60\u5ea7\u4f4d\u5e73\u53f0',
    seatLabel: '\u5ea7\u4f4d\u7f16\u53f7',
    occupancyPanelLabel: '\u5360\u7528\u72b6\u6001',
    reservationPanelLabel: '\u9884\u7ea6\u72b6\u6001',
    authHeading: '\u7528\u6237\u8d26\u6237',
    authSignedOut: '\u5f53\u524d\u672a\u767b\u5f55\u3002',
    authSignedIn: (name) => `\u5f53\u524d\u767b\u5f55\u7528\u6237\uff1a${name}\u3002`,
    reservationHeading: '\u5ea7\u4f4d\u9884\u7ea6',
    reservationHelper: '\u8bf7\u5148\u767b\u5f55\uff0c\u7136\u540e\u518d\u9884\u7ea6\u6216\u53d6\u6d88\u9884\u7ea6\u3002',
    activityHeading: '\u6700\u8fd1\u6d3b\u52a8',
    occupancyLogLabel: '\u6700\u8fd1\u5360\u7528\u8bb0\u5f55',
    reservationLogLabel: '\u6700\u8fd1\u9884\u7ea6\u8bb0\u5f55',
    displayNameLabel: '\u663e\u793a\u540d\u79f0',
    usernameLabel: '\u7528\u6237\u540d',
    passwordLabel: '\u5bc6\u7801',
    displayNamePlaceholder: '\u8bf7\u8f93\u5165\u663e\u793a\u540d\u79f0',
    usernamePlaceholder: '\u8bf7\u8f93\u5165\u7528\u6237\u540d',
    passwordPlaceholder: '\u81f3\u5c11 6 \u4f4d\u5b57\u7b26',
    registerButton: '\u6ce8\u518c',
    loginButton: '\u767b\u5f55',
    logoutButton: '\u9000\u51fa\u767b\u5f55',
    reserveButton: '\u9884\u7ea6\u5ea7\u4f4d',
    cancelButton: '\u53d6\u6d88\u9884\u7ea6',
    loading: '\u52a0\u8f7d\u4e2d...',
    occupancyFree: '\u7a7a\u95f2',
    occupancyOccupied: '\u6709\u4eba',
    reservationReserved: '\u5df2\u9884\u7ea6',
    reservationNotReserved: '\u672a\u9884\u7ea6',
    occupancyOccupiedText: '\u4f20\u611f\u5668\u5f53\u524d\u4e0a\u62a5\u8be5\u5ea7\u4f4d\u6709\u4eba\u4f7f\u7528\u3002',
    occupancyFreeText: '\u4f20\u611f\u5668\u5f53\u524d\u4e0a\u62a5\u8be5\u5ea7\u4f4d\u4e3a\u7a7a\u95f2\u72b6\u6001\u3002',
    reservationReservedText: (reservedBy) => reservedBy ? `\u8be5\u5ea7\u4f4d\u5f53\u524d\u7531 ${reservedBy} \u9884\u7ea6\u3002` : '\u8be5\u5ea7\u4f4d\u5f53\u524d\u5df2\u88ab\u9884\u7ea6\u3002',
    reservationNotReservedText: '\u8be5\u5ea7\u4f4d\u5f53\u524d\u672a\u88ab\u9884\u7ea6\u3002',
    systemMessageDefault: '\u7cfb\u7edf\u6d88\u606f\u4f1a\u663e\u793a\u5728\u8fd9\u91cc\u3002',
    needLoginMessage: '\u8bf7\u5148\u767b\u5f55\uff0c\u518d\u8fdb\u884c\u9884\u7ea6\u64cd\u4f5c\u3002',
    unavailable: '\u4e0d\u53ef\u7528',
    fetchOccupancyError: '\u65e0\u6cd5\u4ece\u670d\u52a1\u5668\u52a0\u8f7d\u5360\u7528\u72b6\u6001\u3002',
    fetchReservationError: '\u65e0\u6cd5\u4ece\u670d\u52a1\u5668\u52a0\u8f7d\u9884\u7ea6\u72b6\u6001\u3002',
    noOccupancyEvents: '\u6682\u65e0\u5360\u7528\u8bb0\u5f55\u3002',
    noReservations: '\u6682\u65e0\u9884\u7ea6\u8bb0\u5f55\u3002',
    occupancyLogItem: (item) => `${item.occupancyStatus === 'Occupied' ? '\u6709\u4eba' : '\u7a7a\u95f2'} / ${item.source} / ${formatDate(item.createdAt)}`,
    reservationLogItem: (item) => `${item.displayName || item.username} / ${item.status === 'Active' ? '\u6709\u6548' : '\u5df2\u53d6\u6d88'} / ${formatDate(item.createdAt)}`,
    registrationSuccessful: '\u6ce8\u518c\u6210\u529f\u3002',
    loginSuccessful: '\u767b\u5f55\u6210\u529f\u3002',
    logoutSuccessful: '\u5df2\u6210\u529f\u9000\u51fa\u767b\u5f55\u3002',
    invalidUsernameOrPassword: '\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef\u3002',
    usernameExists: '\u8be5\u7528\u6237\u540d\u5df2\u5b58\u5728\u3002',
    cancelOwnOnly: '\u53ea\u6709\u9884\u7ea6\u8005\u672c\u4eba\u624d\u80fd\u53d6\u6d88\u9884\u7ea6\u3002'
  }
};

let currentLanguage = 'en';
let latestSeatState = null;
let latestActivity = { recentReservations: [], recentOccupancyEvents: [] };
let currentUser = null;
let currentMessage = '';

function t(key) { return translations[currentLanguage][key]; }
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
}
function getToken() { return localStorage.getItem('seatMonitorToken') || ''; }
function setSession(token, user) {
  if (token) {
    localStorage.setItem('seatMonitorToken', token);
  } else {
    localStorage.removeItem('seatMonitorToken');
  }
  currentUser = user || null;
}
async function apiFetch(url, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}
function localizeMessage(message) {
  const map = {
    'Registration successful.': t('registrationSuccessful'),
    'Login successful.': t('loginSuccessful'),
    'Logged out successfully.': t('logoutSuccessful'),
    'Invalid username or password.': t('invalidUsernameOrPassword'),
    'Username already exists.': t('usernameExists'),
    'Reservation created successfully.': currentLanguage === 'zh' ? '\u9884\u7ea6\u521b\u5efa\u6210\u529f\u3002' : 'Reservation created successfully.',
    'Reservation cancelled successfully.': currentLanguage === 'zh' ? '\u9884\u7ea6\u5df2\u53d6\u6d88\u3002' : 'Reservation cancelled successfully.',
    'This seat is already reserved.': currentLanguage === 'zh' ? '\u8be5\u5ea7\u4f4d\u5df2\u7ecf\u88ab\u9884\u7ea6\u3002' : 'This seat is already reserved.',
    'There is no active reservation to cancel.': currentLanguage === 'zh' ? '\u5f53\u524d\u6ca1\u6709\u53ef\u53d6\u6d88\u7684\u9884\u7ea6\u3002' : 'There is no active reservation to cancel.',
    'Only the user who reserved the seat can cancel it.': t('cancelOwnOnly'),
    'Authentication required.': t('needLoginMessage')
  };
  return map[message] || message;
}
function setBadge(element, statusClass, text) {
  element.className = `status-badge ${statusClass}`;
  element.textContent = text;
}
function renderSeatStatus() {
  if (!latestSeatState) {
    seatLabel.textContent = `${t('seatLabel')}: seat-001`;
    setBadge(occupancyBadge, 'status-unknown', t('loading'));
    setBadge(reservationBadge, 'status-unknown', t('loading'));
    occupancyText.textContent = t('fetchOccupancyError');
    reservationText.textContent = t('fetchReservationError');
    return;
  }
  const isOccupied = latestSeatState.occupancyStatus === 'Occupied';
  const isReserved = latestSeatState.reservationStatus === 'Reserved';
  seatLabel.textContent = `${t('seatLabel')}: ${latestSeatState.seatId}`;
  setBadge(occupancyBadge, isOccupied ? 'status-occupied' : 'status-free', isOccupied ? t('occupancyOccupied') : t('occupancyFree'));
  setBadge(reservationBadge, isReserved ? 'status-reserved' : 'status-not-reserved', isReserved ? t('reservationReserved') : t('reservationNotReserved'));
  occupancyText.textContent = isOccupied ? t('occupancyOccupiedText') : t('occupancyFreeText');
  reservationText.textContent = isReserved ? t('reservationReservedText')(latestSeatState.reservedBy) : t('reservationNotReservedText');
}
function renderActivity() {
  occupancyLog.innerHTML = '';
  reservationLog.innerHTML = '';
  const occupancyItems = latestActivity.recentOccupancyEvents || [];
  const reservationItems = latestActivity.recentReservations || [];
  if (!occupancyItems.length) {
    const li = document.createElement('li'); li.textContent = t('noOccupancyEvents'); occupancyLog.appendChild(li);
  } else {
    occupancyItems.forEach((item) => { const li = document.createElement('li'); li.textContent = t('occupancyLogItem')(item); occupancyLog.appendChild(li); });
  }
  if (!reservationItems.length) {
    const li = document.createElement('li'); li.textContent = t('noReservations'); reservationLog.appendChild(li);
  } else {
    reservationItems.forEach((item) => { const li = document.createElement('li'); li.textContent = t('reservationLogItem')(item); reservationLog.appendChild(li); });
  }
}
function renderAuthState() { authStatus.textContent = currentUser ? t('authSignedIn')(currentUser.displayName || currentUser.username) : t('authSignedOut'); }
function renderMessage() { actionMessage.textContent = currentMessage ? localizeMessage(currentMessage) : t('systemMessageDefault'); }
function applyStaticTranslations() {
  document.documentElement.lang = t('htmlLang');
  document.title = t('title');
  eyebrow.textContent = t('eyebrow');
  pageTitle.textContent = t('title');
  occupancyPanelLabel.textContent = t('occupancyPanelLabel');
  reservationPanelLabel.textContent = t('reservationPanelLabel');
  authHeading.textContent = t('authHeading');
  reservationHeading.textContent = t('reservationHeading');
  reservationHelper.textContent = t('reservationHelper');
  activityHeading.textContent = t('activityHeading');
  occupancyLogLabel.textContent = t('occupancyLogLabel');
  reservationLogLabel.textContent = t('reservationLogLabel');
  displayNameLabel.textContent = t('displayNameLabel');
  usernameLabel.textContent = t('usernameLabel');
  passwordLabel.textContent = t('passwordLabel');
  displayNameInput.placeholder = t('displayNamePlaceholder');
  usernameInput.placeholder = t('usernamePlaceholder');
  passwordInput.placeholder = t('passwordPlaceholder');
  registerButton.textContent = t('registerButton');
  loginButton.textContent = t('loginButton');
  logoutButton.textContent = t('logoutButton');
  reserveButton.textContent = t('reserveButton');
  cancelButton.textContent = t('cancelButton');
  langZhButton.classList.toggle('active', currentLanguage === 'zh');
  langEnButton.classList.toggle('active', currentLanguage === 'en');
}
function rerenderAll() { applyStaticTranslations(); renderSeatStatus(); renderActivity(); renderAuthState(); renderMessage(); }
async function loadSeatStatus() {
  try { latestSeatState = await apiFetch('/api/seat-status'); renderSeatStatus(); }
  catch (error) { latestSeatState = null; setBadge(occupancyBadge, 'status-unknown', t('unavailable')); setBadge(reservationBadge, 'status-unknown', t('unavailable')); occupancyText.textContent = t('fetchOccupancyError'); reservationText.textContent = t('fetchReservationError'); }
}
async function loadSeatActivity() {
  try { latestActivity = await apiFetch('/api/seat-activity'); renderActivity(); }
  catch (error) { latestActivity = { recentReservations: [], recentOccupancyEvents: [] }; renderActivity(); }
}
async function loadCurrentUser() {
  const token = getToken();
  if (!token) { currentUser = null; renderAuthState(); return; }
  try { const result = await apiFetch('/api/auth/me'); currentUser = result.user; }
  catch (error) { setSession('', null); }
  renderAuthState();
}
async function registerUser() {
  try {
    const result = await apiFetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName: displayNameInput.value.trim(), username: usernameInput.value.trim(), password: passwordInput.value.trim() }) });
    setSession(result.token, result.user); currentMessage = result.message; renderAuthState(); renderMessage(); await loadSeatActivity();
  } catch (error) { currentMessage = error.message; renderMessage(); }
}
async function loginUser() {
  try {
    const result = await apiFetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: usernameInput.value.trim(), password: passwordInput.value.trim() }) });
    setSession(result.token, result.user); currentMessage = result.message; renderAuthState(); renderMessage();
  } catch (error) { currentMessage = error.message; renderMessage(); }
}
function logoutUser() { setSession('', null); currentMessage = 'Logged out successfully.'; renderAuthState(); renderMessage(); }
async function reserveSeat() {
  if (!currentUser) { currentMessage = 'Authentication required.'; renderMessage(); return; }
  try {
    const result = await apiFetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    latestSeatState = result.seat; currentMessage = result.message; renderSeatStatus(); renderMessage(); await loadSeatActivity();
  } catch (error) { currentMessage = error.message; renderMessage(); }
}
async function cancelReservation() {
  if (!currentUser) { currentMessage = 'Authentication required.'; renderMessage(); return; }
  try {
    const result = await apiFetch('/api/reservations/current', { method: 'DELETE' });
    latestSeatState = result.seat; currentMessage = result.message; renderSeatStatus(); renderMessage(); await loadSeatActivity();
  } catch (error) { currentMessage = error.message; renderMessage(); }
}
langZhButton.addEventListener('click', () => { currentLanguage = 'zh'; rerenderAll(); });
langEnButton.addEventListener('click', () => { currentLanguage = 'en'; rerenderAll(); });
registerButton.addEventListener('click', registerUser);
loginButton.addEventListener('click', loginUser);
logoutButton.addEventListener('click', logoutUser);
reserveButton.addEventListener('click', reserveSeat);
cancelButton.addEventListener('click', cancelReservation);
(async function initializePage() {
  rerenderAll();
  await Promise.all([loadCurrentUser(), loadSeatStatus(), loadSeatActivity()]);
  window.setInterval(() => { loadSeatStatus(); loadSeatActivity(); }, 5000);
})();
