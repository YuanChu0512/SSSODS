const seatLabel = document.getElementById('seat-label');
const occupancyBadge = document.getElementById('occupancy-badge');
const occupancyText = document.getElementById('occupancy-text');
const reservationBadge = document.getElementById('reservation-badge');
const reservationText = document.getElementById('reservation-text');
const reserveButton = document.getElementById('reserve-button');
const cancelButton = document.getElementById('cancel-button');
const logoutButton = document.getElementById('logout-button');
const actionMessage = document.getElementById('action-message');
const authStatus = document.getElementById('auth-status');
const occupancyLog = document.getElementById('occupancy-log');
const reservationLog = document.getElementById('reservation-log');
const updatedAt = document.getElementById('updated-at');
const metaLabel = document.getElementById('meta-label');
const occupancyCaptionLabel = document.getElementById('occupancy-caption-label');
const occupancyCaption = document.getElementById('occupancy-caption');
const reservationCaptionLabel = document.getElementById('reservation-caption-label');
const reservationCaption = document.getElementById('reservation-caption');
const accountCaptionLabel = document.getElementById('account-caption-label');
const accountCaption = document.getElementById('account-caption');
const occupancyChip = document.getElementById('occupancy-chip');
const reservationChip = document.getElementById('reservation-chip');
const pageTitle = document.getElementById('page-title');
const eyebrow = document.getElementById('eyebrow');
const pageSubtitle = document.getElementById('page-subtitle');
const occupancyPanelLabel = document.getElementById('occupancy-panel-label');
const reservationPanelLabel = document.getElementById('reservation-panel-label');
const reservationHeading = document.getElementById('reservation-heading');
const reservationHelper = document.getElementById('reservation-helper');
const activityHeading = document.getElementById('activity-heading');
const occupancyLogLabel = document.getElementById('occupancy-log-label');
const reservationLogLabel = document.getElementById('reservation-log-label');
const promoLabel = document.getElementById('promo-label');
const promoTitle = document.getElementById('promo-title');
const promoText = document.getElementById('promo-text');
const goLoginLink = document.getElementById('go-login-link');
const goRegisterLink = document.getElementById('go-register-link');
const langZhButton = document.getElementById('lang-zh');
const langEnButton = document.getElementById('lang-en');

const translations = {
  en: {
    htmlLang: 'en',
    title: 'Seat Management Dashboard',
    eyebrow: 'Smart Study Space',
    pageSubtitle: 'Monitor one study seat in real time and manage reservations with a logged-in account.',
    seatLabel: 'Seat ID',
    metaLabel: 'Last Sync',
    occupancyPanelLabel: 'Occupancy',
    reservationPanelLabel: 'Reservation',
    occupancyChip: 'Sensor',
    reservationChip: 'Booking',
    occupancyCaptionLabel: 'Live Sensor Feed',
    reservationCaptionLabel: 'Reservation Owner',
    accountCaptionLabel: 'Current Account',
    occupancyCaptionWaiting: 'Waiting for occupancy update.',
    occupancyCaptionOccupied: 'A person is currently detected on the seat.',
    occupancyCaptionFree: 'No person is currently detected on the seat.',
    reservationCaptionEmpty: 'No active reservation.',
    accountCaptionChecking: 'Checking account...',
    accountCaptionSignedOut: 'Please sign in.',
    accountCaptionSignedIn: (name) => `${name}`,
    authSignedOut: 'Please sign in again to continue.',
    authSignedIn: (name) => `Signed in as ${name}.`,
    reservationHeading: 'Seat Reservation',
    reservationHelper: 'Reserve the seat or cancel your reservation from here.',
    activityHeading: 'Recent Activity',
    occupancyLogLabel: 'Recent Occupancy Events',
    reservationLogLabel: 'Recent Reservations',
    promoLabel: 'Quick Access',
    promoTitle: 'Need another account?',
    promoText: 'Open the sign-in pages to switch account or create a new student account.',
    goLogin: 'Go to Login',
    goRegister: 'Go to Register',
    reserveButton: 'Reserve Seat',
    cancelButton: 'Cancel Reservation',
    logoutButton: 'Logout',
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
    logoutSuccessful: 'Logged out successfully.',
    cancelOwnOnly: 'Only the user who reserved the seat can cancel it.'
  },
  zh: {
    htmlLang: 'zh-CN',
    title: '\u5ea7\u4f4d\u7ba1\u7406\u9762\u677f',
    eyebrow: '\u667a\u80fd\u81ea\u4e60\u7a7a\u95f4',
    pageSubtitle: '\u5b9e\u65f6\u67e5\u770b\u5355\u4e2a\u81ea\u4e60\u5ea7\u4f4d\u72b6\u6001\uff0c\u5e76\u5728\u767b\u5f55\u540e\u7ba1\u7406\u9884\u7ea6\u3002',
    seatLabel: '\u5ea7\u4f4d\u7f16\u53f7',
    metaLabel: '\u6700\u8fd1\u540c\u6b65',
    occupancyPanelLabel: '\u5360\u7528\u72b6\u6001',
    reservationPanelLabel: '\u9884\u7ea6\u72b6\u6001',
    occupancyChip: '\u4f20\u611f\u5668',
    reservationChip: '\u9884\u7ea6',
    occupancyCaptionLabel: '\u5b9e\u65f6\u4f20\u611f',
    reservationCaptionLabel: '\u9884\u7ea6\u4eba',
    accountCaptionLabel: '\u5f53\u524d\u8d26\u6237',
    occupancyCaptionWaiting: '\u6b63\u5728\u7b49\u5f85\u5360\u7528\u66f4\u65b0\u3002',
    occupancyCaptionOccupied: '\u7cfb\u7edf\u5df2\u68c0\u6d4b\u5230\u5ea7\u4f4d\u4e0a\u6709\u4eba\u3002',
    occupancyCaptionFree: '\u7cfb\u7edf\u5f53\u524d\u672a\u68c0\u6d4b\u5230\u4f7f\u7528\u8005\u3002',
    reservationCaptionEmpty: '\u5f53\u524d\u6ca1\u6709\u9884\u7ea6\u4eba\u3002',
    accountCaptionChecking: '\u6b63\u5728\u68c0\u67e5\u8d26\u6237...',
    accountCaptionSignedOut: '\u8bf7\u5148\u767b\u5f55\u3002',
    accountCaptionSignedIn: (name) => `${name}`,
    authSignedOut: '\u8bf7\u5148\u91cd\u65b0\u767b\u5f55\u540e\u518d\u7ee7\u7eed\u3002',
    authSignedIn: (name) => `\u5f53\u524d\u767b\u5f55\u7528\u6237\uff1a${name}\u3002`,
    reservationHeading: '\u5ea7\u4f4d\u9884\u7ea6',
    reservationHelper: '\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u9884\u7ea6\u6216\u53d6\u6d88\u9884\u7ea6\u3002',
    activityHeading: '\u6700\u8fd1\u6d3b\u52a8',
    occupancyLogLabel: '\u6700\u8fd1\u5360\u7528\u8bb0\u5f55',
    reservationLogLabel: '\u6700\u8fd1\u9884\u7ea6\u8bb0\u5f55',
    promoLabel: '\u5feb\u6377\u5165\u53e3',
    promoTitle: '\u9700\u8981\u5176\u4ed6\u8d26\u53f7\uff1f',
    promoText: '\u53ef\u4ee5\u6253\u5f00\u767b\u5f55\u6216\u6ce8\u518c\u9875\u9762\uff0c\u5207\u6362\u8d26\u53f7\u6216\u521b\u5efa\u65b0\u7684\u5b66\u751f\u8d26\u53f7\u3002',
    goLogin: '\u524d\u5f80\u767b\u5f55',
    goRegister: '\u524d\u5f80\u6ce8\u518c',
    reserveButton: '\u9884\u7ea6\u5ea7\u4f4d',
    cancelButton: '\u53d6\u6d88\u9884\u7ea6',
    logoutButton: '\u9000\u51fa\u767b\u5f55',
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
    logoutSuccessful: '\u5df2\u6210\u529f\u9000\u51fa\u767b\u5f55\u3002',
    cancelOwnOnly: '\u53ea\u6709\u9884\u7ea6\u8005\u672c\u4eba\u624d\u80fd\u53d6\u6d88\u9884\u7ea6\u3002'
  }
};

let currentLanguage = localStorage.getItem('seatMonitorLanguage') || 'en';
let latestSeatState = null;
let latestActivity = { recentReservations: [], recentOccupancyEvents: [] };
let currentUser = null;
let currentMessage = '';

function t(key) {
  return translations[currentLanguage][key];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
}

function getToken() {
  return localStorage.getItem('seatMonitorToken') || '';
}

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

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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
    'Reservation created successfully.': currentLanguage === 'zh' ? '\u9884\u7ea6\u521b\u5efa\u6210\u529f\u3002' : 'Reservation created successfully.',
    'Reservation cancelled successfully.': currentLanguage === 'zh' ? '\u9884\u7ea6\u5df2\u53d6\u6d88\u3002' : 'Reservation cancelled successfully.',
    'This seat is already reserved.': currentLanguage === 'zh' ? '\u8be5\u5ea7\u4f4d\u5df2\u7ecf\u88ab\u9884\u7ea6\u3002' : 'This seat is already reserved.',
    'There is no active reservation to cancel.': currentLanguage === 'zh' ? '\u5f53\u524d\u6ca1\u6709\u53ef\u53d6\u6d88\u7684\u9884\u7ea6\u3002' : 'There is no active reservation to cancel.',
    'Only the user who reserved the seat can cancel it.': t('cancelOwnOnly'),
    'Authentication required.': t('needLoginMessage'),
    'Logged out successfully.': t('logoutSuccessful')
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
    updatedAt.textContent = t('loading');
    occupancyCaption.textContent = t('occupancyCaptionWaiting');
    reservationCaption.textContent = t('reservationCaptionEmpty');
    return;
  }

  const isOccupied = latestSeatState.occupancyStatus === 'Occupied';
  const isReserved = latestSeatState.reservationStatus === 'Reserved';

  seatLabel.textContent = `${t('seatLabel')}: ${latestSeatState.seatId}`;
  setBadge(occupancyBadge, isOccupied ? 'status-occupied' : 'status-free', isOccupied ? t('occupancyOccupied') : t('occupancyFree'));
  setBadge(reservationBadge, isReserved ? 'status-reserved' : 'status-not-reserved', isReserved ? t('reservationReserved') : t('reservationNotReserved'));
  occupancyText.textContent = isOccupied ? t('occupancyOccupiedText') : t('occupancyFreeText');
  reservationText.textContent = isReserved ? t('reservationReservedText')(latestSeatState.reservedBy) : t('reservationNotReservedText');
  updatedAt.textContent = formatDate(latestSeatState.updatedAt);
  occupancyCaption.textContent = isOccupied ? t('occupancyCaptionOccupied') : t('occupancyCaptionFree');
  reservationCaption.textContent = isReserved ? latestSeatState.reservedBy || t('reservationReserved') : t('reservationCaptionEmpty');
}

function renderActivity() {
  occupancyLog.innerHTML = '';
  reservationLog.innerHTML = '';

  const occupancyItems = latestActivity.recentOccupancyEvents || [];
  const reservationItems = latestActivity.recentReservations || [];

  if (!occupancyItems.length) {
    const li = document.createElement('li');
    li.textContent = t('noOccupancyEvents');
    occupancyLog.appendChild(li);
  } else {
    occupancyItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = t('occupancyLogItem')(item);
      occupancyLog.appendChild(li);
    });
  }

  if (!reservationItems.length) {
    const li = document.createElement('li');
    li.textContent = t('noReservations');
    reservationLog.appendChild(li);
  } else {
    reservationItems.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = t('reservationLogItem')(item);
      reservationLog.appendChild(li);
    });
  }
}

function renderAuthState() {
  authStatus.textContent = currentUser ? t('authSignedIn')(currentUser.displayName || currentUser.username) : t('authSignedOut');
  accountCaption.textContent = currentUser
    ? t('accountCaptionSignedIn')(currentUser.displayName || currentUser.username)
    : t('accountCaptionSignedOut');
}

function renderMessage() {
  actionMessage.textContent = currentMessage ? localizeMessage(currentMessage) : t('systemMessageDefault');
}

function applyStaticTranslations() {
  localStorage.setItem('seatMonitorLanguage', currentLanguage);
  document.documentElement.lang = t('htmlLang');
  document.title = t('title');
  eyebrow.textContent = t('eyebrow');
  pageTitle.textContent = t('title');
  pageSubtitle.textContent = t('pageSubtitle');
  metaLabel.textContent = t('metaLabel');
  occupancyPanelLabel.textContent = t('occupancyPanelLabel');
  reservationPanelLabel.textContent = t('reservationPanelLabel');
  occupancyChip.textContent = t('occupancyChip');
  reservationChip.textContent = t('reservationChip');
  occupancyCaptionLabel.textContent = t('occupancyCaptionLabel');
  reservationCaptionLabel.textContent = t('reservationCaptionLabel');
  accountCaptionLabel.textContent = t('accountCaptionLabel');
  reservationHeading.textContent = t('reservationHeading');
  reservationHelper.textContent = t('reservationHelper');
  activityHeading.textContent = t('activityHeading');
  occupancyLogLabel.textContent = t('occupancyLogLabel');
  reservationLogLabel.textContent = t('reservationLogLabel');
  promoLabel.textContent = t('promoLabel');
  promoTitle.textContent = t('promoTitle');
  promoText.textContent = t('promoText');
  goLoginLink.textContent = t('goLogin');
  goRegisterLink.textContent = t('goRegister');
  reserveButton.textContent = t('reserveButton');
  cancelButton.textContent = t('cancelButton');
  logoutButton.textContent = t('logoutButton');
  langZhButton.classList.toggle('active', currentLanguage === 'zh');
  langEnButton.classList.toggle('active', currentLanguage === 'en');
}

function rerenderAll() {
  applyStaticTranslations();
  renderSeatStatus();
  renderActivity();
  renderAuthState();
  renderMessage();
}

async function loadSeatStatus() {
  try {
    latestSeatState = await apiFetch('/api/seat-status');
    renderSeatStatus();
  } catch (error) {
    latestSeatState = null;
    setBadge(occupancyBadge, 'status-unknown', t('unavailable'));
    setBadge(reservationBadge, 'status-unknown', t('unavailable'));
    occupancyText.textContent = t('fetchOccupancyError');
    reservationText.textContent = t('fetchReservationError');
  }
}

async function loadSeatActivity() {
  try {
    latestActivity = await apiFetch('/api/seat-activity');
    renderActivity();
  } catch (error) {
    latestActivity = { recentReservations: [], recentOccupancyEvents: [] };
    renderActivity();
  }
}

async function loadCurrentUser() {
  const token = getToken();

  if (!token) {
    window.location.href = './login.html';
    return;
  }

  try {
    const result = await apiFetch('/api/auth/me');
    currentUser = result.user;
    renderAuthState();
  } catch (error) {
    setSession('', null);
    window.location.href = './login.html';
  }
}

function logoutUser() {
  setSession('', null);
  currentMessage = 'Logged out successfully.';
  renderMessage();
  window.setTimeout(() => {
    window.location.href = './login.html';
  }, 250);
}

async function reserveSeat() {
  if (!currentUser) {
    currentMessage = 'Authentication required.';
    renderMessage();
    return;
  }

  try {
    const result = await apiFetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    latestSeatState = result.seat;
    currentMessage = result.message;
    renderSeatStatus();
    renderMessage();
    await loadSeatActivity();
  } catch (error) {
    currentMessage = error.message;
    renderMessage();
  }
}

async function cancelReservation() {
  if (!currentUser) {
    currentMessage = 'Authentication required.';
    renderMessage();
    return;
  }

  try {
    const result = await apiFetch('/api/reservations/current', {
      method: 'DELETE'
    });
    latestSeatState = result.seat;
    currentMessage = result.message;
    renderSeatStatus();
    renderMessage();
    await loadSeatActivity();
  } catch (error) {
    currentMessage = error.message;
    renderMessage();
  }
}

langZhButton.addEventListener('click', () => {
  currentLanguage = 'zh';
  rerenderAll();
});

langEnButton.addEventListener('click', () => {
  currentLanguage = 'en';
  rerenderAll();
});

logoutButton.addEventListener('click', logoutUser);
reserveButton.addEventListener('click', reserveSeat);
cancelButton.addEventListener('click', cancelReservation);

(async function initializePage() {
  rerenderAll();
  await loadCurrentUser();
  await Promise.all([loadSeatStatus(), loadSeatActivity()]);
  window.setInterval(() => {
    loadSeatStatus();
    loadSeatActivity();
  }, 5000);
})();
