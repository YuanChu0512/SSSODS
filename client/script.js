const els = {
  seatLabel: document.getElementById('seat-label'),
  authStatus: document.getElementById('auth-status'),
  updatedAt: document.getElementById('updated-at'),
  metaLabel: document.getElementById('meta-label'),
  roomCaptionLabel: document.getElementById('room-caption-label'),
  roomCaption: document.getElementById('room-caption'),
  occupancyCaptionLabel: document.getElementById('occupancy-caption-label'),
  occupancyCaption: document.getElementById('occupancy-caption'),
  reservationCaptionLabel: document.getElementById('reservation-caption-label'),
  reservationCaption: document.getElementById('reservation-caption'),
  accountCaptionLabel: document.getElementById('account-caption-label'),
  accountCaption: document.getElementById('account-caption'),
  occupancyPanelLabel: document.getElementById('occupancy-panel-label'),
  reservationPanelLabel: document.getElementById('reservation-panel-label'),
  occupancyChip: document.getElementById('occupancy-chip'),
  reservationChip: document.getElementById('reservation-chip'),
  occupancyBadge: document.getElementById('occupancy-badge'),
  occupancyText: document.getElementById('occupancy-text'),
  reservationBadge: document.getElementById('reservation-badge'),
  reservationText: document.getElementById('reservation-text'),
  reservationHeading: document.getElementById('reservation-heading'),
  reservationHelper: document.getElementById('reservation-helper'),
  reservationDateLabel: document.getElementById('reservation-date-label'),
  reservationDateInput: document.getElementById('reservation-date'),
  reservationStartLabel: document.getElementById('reservation-start-label'),
  reservationStartSelect: document.getElementById('reservation-start'),
  reservationEndLabel: document.getElementById('reservation-end-label'),
  reservationEndSelect: document.getElementById('reservation-end'),
  selectedSlotSummary: document.getElementById('selected-slot-summary'),
  slotGrid: document.getElementById('slot-grid'),
  reserveButton: document.getElementById('reserve-button'),
  cancelButton: document.getElementById('cancel-button'),
  actionMessage: document.getElementById('action-message'),
  promoLabel: document.getElementById('promo-label'),
  promoTitle: document.getElementById('promo-title'),
  promoText: document.getElementById('promo-text'),
  goLoginLink: document.getElementById('go-login-link'),
  goRegisterLink: document.getElementById('go-register-link'),
  activityHeading: document.getElementById('activity-heading'),
  occupancyLogLabel: document.getElementById('occupancy-log-label'),
  reservationLogLabel: document.getElementById('reservation-log-label'),
  occupancyLog: document.getElementById('occupancy-log'),
  reservationLog: document.getElementById('reservation-log'),
  pageTitle: document.getElementById('page-title'),
  eyebrow: document.getElementById('eyebrow'),
  pageSubtitle: document.getElementById('page-subtitle'),
  adminLink: document.getElementById('admin-link'),
  logoutButton: document.getElementById('logout-button'),
  langZhButton: document.getElementById('lang-zh'),
  langEnButton: document.getElementById('lang-en'),
  changeSeatLink: document.getElementById('change-seat-link')
};

const OPEN = 8 * 60;
const CLOSE = 22 * 60;
const STEP = 15;
const MAX_MINUTES = 6 * 60;
const STORAGE_LANGUAGE = 'seatMonitorLanguage';
const STORAGE_TOKEN = 'seatMonitorToken';
const STORAGE_TARGET = 'seatMonitorSelectedTarget';
const STORAGE_SEAT = 'seatMonitorSelectedSeat';
const STORAGE_ROOM = 'seatMonitorSelectedRoom';

const i18n = {
  en: {
    eyebrow: 'Smart Study Space',
    seatTitle: 'Seat Dashboard',
    roomTitle: 'Room Dashboard',
    seatSubtitle: 'Manage seat status and seat reservations.',
    roomSubtitle: 'Manage room reservations independently from seats.',
    seatLabel: 'Current Seat',
    roomLabel: 'Current Room',
    roomCaptionLabel: 'Selected Room',
    occupancyCaptionLabel: 'Live Sensor Feed',
    reservationCaptionLabel: 'Current Reservation',
    accountCaptionLabel: 'Current Account',
    occupancyPanelLabel: 'Occupancy',
    reservationPanelLabel: 'Reservation',
    occupancyChip: 'Sensor',
    reservationChip: 'Current Slot',
    reservationHeading: 'Flexible Reservation',
    reservationHelperSeat: 'Reserve the selected seat in 15-minute increments. Each booking can last up to 6 hours.',
    reservationHelperRoom: 'Reserve the selected room in 15-minute increments. Each booking can last up to 6 hours.',
    reservationDateLabel: 'Reservation Date',
    reservationStartLabel: 'Start Time',
    reservationEndLabel: 'End Time',
    reserveButton: 'Reserve Selected Range',
    cancelButton: 'Cancel Selected Reservation',
    activityHeading: 'Recent Activity',
    occupancyLogLabel: 'Recent Occupancy Events',
    reservationLogLabel: 'Recent Reservations',
    promoLabel: 'Quick Access',
    promoTitle: 'Need another account?',
    promoText: 'Open the sign-in pages to switch account or create a new user account.',
    goLogin: 'Go to Login',
    goRegister: 'Go to Register',
    logoutButton: 'Logout',
    changeSeat: 'Change Selection',
    admin: 'Admin',
    metaLabel: 'Last Sync',
    noTargetSelected: 'Please choose a room or seat first.',
    noReservations: 'No reservations have been recorded yet.',
    noOccupancyEvents: 'No occupancy events have been recorded yet.',
    noSlots: 'No reservations for the selected target on this date yet.',
    currentUser: 'You',
    privateOwner: 'Private',
    reserved: 'Reserved',
    notReserved: 'Not Reserved',
    occupied: 'Occupied',
    free: 'Free',
    authSignedIn: (n) => `Signed in as ${n}.`,
    authSignedOut: 'Please sign in again to continue.',
    selectedRange: (name, start, end) => `Ready to reserve ${name}: ${start} - ${end}`,
    selectedOwn: (label) => `Selected your reservation: ${label}`,
    selectionHint: 'Choose a time range, or click one of your reservations below.',
    systemMessage: 'System messages will appear here.',
    fetchStatusError: 'Unable to load target status from the server.',
    occupancyCaptionOccupied: 'The sensor currently reports someone at this seat.',
    occupancyCaptionFree: 'The sensor currently reports no one at this seat.',
    occupancyCaptionRoom: 'Room mode does not depend on sensor occupancy.',
    reservationCaptionEmpty: 'No active reservation right now.',
    accountCaptionSignedOut: 'Not signed in',
    occupancyOccupiedText: 'This seat is marked as occupied by the device feed.',
    occupancyFreeText: 'This seat is currently available according to the device feed.',
    occupancyRoomText: 'Room reservation mode is independent from seat occupancy.',
    reservationReservedText: (name, start, end) => `${name || 'Reserved'}${start && end ? ` / ${start}-${end}` : ''}`,
    reservationNotReservedText: 'There is no active reservation for the current time.',
    timeRangeHeader: 'Time Range',
    ownerHeader: 'Owner',
    statusHeader: 'Status',
    ownedStatus: 'Mine',
    noReservationSelected: 'No reservation selected.'
  },
  zh: {
    eyebrow: '智能自习空间',
    seatTitle: '座位仪表盘',
    roomTitle: '自习室仪表盘',
    seatSubtitle: '管理座位状态和座位预约。',
    roomSubtitle: '管理自习室预约（与座位独立）。',
    seatLabel: '当前座位',
    roomLabel: '当前自习室',
    roomCaptionLabel: '已选自习室',
    occupancyCaptionLabel: '实时传感',
    reservationCaptionLabel: '当前预约',
    accountCaptionLabel: '当前账户',
    occupancyPanelLabel: '占用状态',
    reservationPanelLabel: '预约状态',
    occupancyChip: '传感器',
    reservationChip: '当前时段',
    reservationHeading: '灵活时段预约',
    reservationHelperSeat: '以 15 分钟为粒度预约当前座位，单次最长 6 小时。',
    reservationHelperRoom: '以 15 分钟为粒度预约当前自习室，单次最长 6 小时。',
    reservationDateLabel: '预约日期',
    reservationStartLabel: '开始时间',
    reservationEndLabel: '结束时间',
    reserveButton: '预约所选时间范围',
    cancelButton: '取消所选预约',
    activityHeading: '最近活动',
    occupancyLogLabel: '最近占用记录',
    reservationLogLabel: '最近预约记录',
    promoLabel: '快捷入口',
    promoTitle: '需要其他账号？',
    promoText: '可以打开登录或注册页面，切换账号或创建新的普通用户账号。',
    goLogin: '前往登录',
    goRegister: '前往注册',
    logoutButton: '退出登录',
    changeSeat: '重新选择',
    admin: '后台管理',
    metaLabel: '最近同步',
    noTargetSelected: '请先选择自习室或座位。',
    noReservations: '暂无预约记录。',
    noOccupancyEvents: '暂无占用记录。',
    noSlots: '该对象在该日期暂无预约。',
    currentUser: '你',
    privateOwner: '隐私保护',
    reserved: '已预约',
    notReserved: '未预约',
    occupied: '有人',
    free: '空闲',
    authSignedIn: (n) => `当前登录用户：${n}。`,
    authSignedOut: '请先重新登录后再继续。',
    selectedRange: (name, start, end) => `当前待预约 ${name}：${start} - ${end}`,
    selectedOwn: (label) => `已选中你的预约：${label}`,
    selectionHint: '请选择时间范围，或点击下方你自己的预约。',
    systemMessage: '系统消息会显示在这里。',
    fetchStatusError: '无法加载当前对象状态。',
    occupancyCaptionOccupied: '传感器当前检测到有人在座。',
    occupancyCaptionFree: '传感器当前检测到座位空闲。',
    occupancyCaptionRoom: '自习室模式不依赖座位传感状态。',
    reservationCaptionEmpty: '当前时段暂无有效预约。',
    accountCaptionSignedOut: '未登录',
    occupancyOccupiedText: '这个座位当前被设备标记为有人。',
    occupancyFreeText: '这个座位当前根据设备状态为空闲。',
    occupancyRoomText: '自习室预约模式与座位占用状态独立。',
    reservationReservedText: (name, start, end) => `${name || '已预约'}${start && end ? ` / ${start}-${end}` : ''}`,
    reservationNotReservedText: '当前时段暂无有效预约。',
    timeRangeHeader: '时间范围',
    ownerHeader: '预约人',
    statusHeader: '状态',
    ownedStatus: '我的',
    noReservationSelected: '请先选择一条预约。'
  }
};

let lang = localStorage.getItem(STORAGE_LANGUAGE) || 'en';
let user = null;
let message = '';
let targetState = null;
let activity = { recentReservations: [], recentOccupancyEvents: [] };
let slots = { slots: [] };
let selectedReservationId = null;
let targetType = localStorage.getItem(STORAGE_TARGET) || 'seat';

const t = (key) => i18n[lang][key];

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN) || '';
}

function setSession(token) {
  if (token) localStorage.setItem(STORAGE_TOKEN, token);
  else localStorage.removeItem(STORAGE_TOKEN);
}

function getSelectedSeatId() {
  return localStorage.getItem(STORAGE_SEAT) || '';
}

function getSelectedRoomCode() {
  return localStorage.getItem(STORAGE_ROOM) || '';
}

function syncSelectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const seatId = params.get('seatId');
  const roomCode = params.get('roomCode');
  const queryTarget = params.get('targetType');

  if (queryTarget === 'seat' || queryTarget === 'room') {
    targetType = queryTarget;
    localStorage.setItem(STORAGE_TARGET, targetType);
  }
  if (roomCode) localStorage.setItem(STORAGE_ROOM, roomCode);
  if (seatId) localStorage.setItem(STORAGE_SEAT, seatId);
}

function updateAdminLinkVisibility() {
  const isAdmin = Boolean(user && user.role === 'admin');
  els.adminLink.hidden = !isAdmin;
  els.adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
  if (isAdmin) els.adminLink.setAttribute('href', './admin.html');
  else els.adminLink.removeAttribute('href');
}

async function apiFetch(url, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function formatMinute(minute) {
  const hours = String(Math.floor(minute / 60)).padStart(2, '0');
  const mins = String(minute % 60).padStart(2, '0');
  return `${hours}:${mins}`;
}

function getTimes() {
  const values = [];
  for (let minute = OPEN; minute <= CLOSE; minute += STEP) values.push(formatMinute(minute));
  return values;
}

function timeToMinute(value) {
  const [hours, mins] = value.split(':').map(Number);
  return (hours * 60) + mins;
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  }).format(date);
}

function fillSelect(select, values, current) {
  select.innerHTML = '';
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    option.selected = value === current;
    select.appendChild(option);
  });
}

function syncTimeInputs() {
  const allTimes = getTimes();
  fillSelect(els.reservationStartSelect, allTimes.slice(0, -1), els.reservationStartSelect.value || allTimes[0]);
  const startMinute = timeToMinute(els.reservationStartSelect.value);
  const endOptions = allTimes.filter((value) => {
    const minute = timeToMinute(value);
    return minute > startMinute && minute <= Math.min(startMinute + MAX_MINUTES, CLOSE);
  });
  fillSelect(els.reservationEndSelect, endOptions, endOptions.includes(els.reservationEndSelect.value) ? els.reservationEndSelect.value : endOptions[0]);
}

function selectedOwnedReservation() {
  return (slots.slots || []).find((slot) => slot.reservationId === selectedReservationId && slot.isOwnedByCurrentUser) || null;
}

function targetName() {
  if (!targetState) return '-';
  return targetType === 'room'
    ? targetState.roomName
    : (targetState.seatName || targetState.seatId);
}

function applyStaticText() {
  const isRoomMode = targetType === 'room';
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = isRoomMode ? t('roomTitle') : t('seatTitle');
  els.eyebrow.textContent = t('eyebrow');
  els.pageTitle.textContent = isRoomMode ? t('roomTitle') : t('seatTitle');
  els.pageSubtitle.textContent = isRoomMode ? t('roomSubtitle') : t('seatSubtitle');
  els.metaLabel.textContent = t('metaLabel');
  els.roomCaptionLabel.textContent = t('roomCaptionLabel');
  els.occupancyCaptionLabel.textContent = t('occupancyCaptionLabel');
  els.reservationCaptionLabel.textContent = t('reservationCaptionLabel');
  els.accountCaptionLabel.textContent = t('accountCaptionLabel');
  els.occupancyPanelLabel.textContent = t('occupancyPanelLabel');
  els.reservationPanelLabel.textContent = t('reservationPanelLabel');
  els.occupancyChip.textContent = t('occupancyChip');
  els.reservationChip.textContent = t('reservationChip');
  els.reservationHeading.textContent = t('reservationHeading');
  els.reservationHelper.textContent = isRoomMode ? t('reservationHelperRoom') : t('reservationHelperSeat');
  els.reservationDateLabel.textContent = t('reservationDateLabel');
  els.reservationStartLabel.textContent = t('reservationStartLabel');
  els.reservationEndLabel.textContent = t('reservationEndLabel');
  els.reserveButton.textContent = t('reserveButton');
  els.cancelButton.textContent = t('cancelButton');
  els.activityHeading.textContent = t('activityHeading');
  els.occupancyLogLabel.textContent = t('occupancyLogLabel');
  els.reservationLogLabel.textContent = t('reservationLogLabel');
  els.promoLabel.textContent = t('promoLabel');
  els.promoTitle.textContent = t('promoTitle');
  els.promoText.textContent = t('promoText');
  els.goLoginLink.textContent = t('goLogin');
  els.goRegisterLink.textContent = t('goRegister');
  els.adminLink.textContent = t('admin');
  updateAdminLinkVisibility();
  els.logoutButton.textContent = t('logoutButton');
  els.changeSeatLink.textContent = t('changeSeat');
  els.langZhButton.classList.toggle('active', lang === 'zh');
  els.langEnButton.classList.toggle('active', lang === 'en');
}

function renderTargetStatus() {
  const isRoomMode = targetType === 'room';
  if (!targetState) {
    els.seatLabel.textContent = `${isRoomMode ? t('roomLabel') : t('seatLabel')}: -`;
    els.updatedAt.textContent = '-';
    els.roomCaption.textContent = '-';
    els.occupancyCaption.textContent = t('fetchStatusError');
    els.reservationCaption.textContent = t('fetchStatusError');
    els.accountCaption.textContent = t('fetchStatusError');
    els.occupancyText.textContent = t('fetchStatusError');
    els.reservationText.textContent = t('fetchStatusError');
    return;
  }

  const reserved = targetState.reservationStatus === 'Reserved';
  els.seatLabel.textContent = isRoomMode
    ? `${t('roomLabel')}: ${targetState.roomName} (${targetState.roomCode})`
    : `${t('seatLabel')}: ${targetState.seatName || targetState.seatId} (${targetState.seatId})`;
  els.updatedAt.textContent = targetState.updatedAt ? formatDate(targetState.updatedAt) : '-';
  els.roomCaption.textContent = targetState.roomName || '-';

  if (!isRoomMode) {
    const occupied = targetState.occupancyStatus === 'Occupied';
    els.occupancyBadge.className = `status-badge ${occupied ? 'status-occupied' : 'status-free'}`;
    els.occupancyBadge.textContent = occupied ? t('occupied') : t('free');
    els.occupancyCaption.textContent = occupied ? t('occupancyCaptionOccupied') : t('occupancyCaptionFree');
    els.occupancyText.textContent = occupied ? t('occupancyOccupiedText') : t('occupancyFreeText');
  } else {
    els.occupancyBadge.className = 'status-badge status-unknown';
    els.occupancyBadge.textContent = '-';
    els.occupancyCaption.textContent = t('occupancyCaptionRoom');
    els.occupancyText.textContent = t('occupancyRoomText');
  }

  els.reservationBadge.className = `status-badge ${reserved ? 'status-reserved' : 'status-not-reserved'}`;
  els.reservationBadge.textContent = reserved ? t('reserved') : t('notReserved');
  els.reservationCaption.textContent = reserved
    ? `${targetState.reservedBy || t('reserved')}${targetState.currentReservationStartTime ? ` / ${targetState.currentReservationStartTime}-${targetState.currentReservationEndTime}` : ''}`
    : t('reservationCaptionEmpty');
  els.accountCaption.textContent = user ? (user.displayName || user.username) : t('accountCaptionSignedOut');
  updateAdminLinkVisibility();
  els.authStatus.textContent = user ? t('authSignedIn')(user.displayName || user.username) : t('authSignedOut');
  els.reservationText.textContent = reserved
    ? t('reservationReservedText')(targetState.reservedBy, targetState.currentReservationStartTime, targetState.currentReservationEndTime)
    : t('reservationNotReservedText');
}

function renderActivity() {
  els.occupancyLog.innerHTML = '';
  els.reservationLog.innerHTML = '';
  const occ = activity.recentOccupancyEvents || [];
  const res = activity.recentReservations || [];

  (occ.length ? occ : [{ empty: true }]).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.empty ? t('noOccupancyEvents') : `${item.occupancyStatus} / ${item.source} / ${formatDate(item.createdAt)}`;
    els.occupancyLog.appendChild(li);
  });

  (res.length ? res : [{ empty: true }]).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.empty
      ? t('noReservations')
      : `${item.isOwnedByCurrentUser ? (item.displayName || item.username || t('currentUser')) : (item.displayName || t('privateOwner'))} / ${item.status} / ${item.reservationDate || '-'} ${item.slotLabel || ''}`.trim();
    els.reservationLog.appendChild(li);
  });
}

function renderSlots() {
  els.slotGrid.innerHTML = '';
  const own = selectedOwnedReservation();
  if (own) {
    els.selectedSlotSummary.textContent = t('selectedOwn')(own.reservationLabel || own.label);
  } else if (targetState) {
    els.selectedSlotSummary.textContent = t('selectedRange')(targetName(), els.reservationStartSelect.value, els.reservationEndSelect.value);
  } else {
    els.selectedSlotSummary.textContent = t('selectionHint');
  }

  const grouped = new Map();
  (slots.slots || []).forEach((slot) => {
    if (!slot.reservationId || grouped.has(slot.reservationId)) return;
    grouped.set(slot.reservationId, slot);
  });
  const rows = Array.from(grouped.values());
  if (!rows.length) {
    els.slotGrid.innerHTML = `<div class="selection-summary">${t('noSlots')}</div>`;
  } else {
    const table = document.createElement('div');
    table.className = 'reservation-table';
    table.innerHTML = `<div class="reservation-table-row reservation-table-header"><span>${t('timeRangeHeader')}</span><span>${t('ownerHeader')}</span><span>${t('statusHeader')}</span></div>`;
    rows.forEach((slot) => {
      const row = document.createElement('button');
      const owned = slot.isOwnedByCurrentUser;
      row.type = 'button';
      row.className = `reservation-table-row reservation-table-item${slot.reservationId === selectedReservationId ? ' selected' : ''}`;
      row.disabled = !owned;
      row.innerHTML = `<span class="reservation-table-time">${slot.reservationLabel}</span><span>${owned ? (slot.reservedBy || t('currentUser')) : (slot.reservedBy || t('privateOwner'))}</span><span class="reservation-table-status status-${owned ? 'owned' : 'reserved'}">${owned ? t('ownedStatus') : t('reserved')}</span>`;
      row.onclick = () => {
        selectedReservationId = owned ? slot.reservationId : null;
        renderSlots();
      };
      table.appendChild(row);
    });
    els.slotGrid.appendChild(table);
  }

  els.reserveButton.disabled = !(
    targetState &&
    els.reservationStartSelect.value &&
    els.reservationEndSelect.value &&
    timeToMinute(els.reservationEndSelect.value) > timeToMinute(els.reservationStartSelect.value)
  );
  els.cancelButton.disabled = !selectedOwnedReservation();
}

function renderMessage() {
  els.actionMessage.textContent = message || t('systemMessage');
}

async function loadCurrentUser() {
  if (!getToken()) {
    window.location.href = './login.html';
    return;
  }
  const result = await apiFetch('/api/auth/me');
  user = result.user;
}

async function reloadTarget() {
  const seatId = getSelectedSeatId();
  const roomCode = getSelectedRoomCode();

  if (targetType === 'seat') {
    if (!seatId) {
      window.location.href = './choose-seat.html';
      return;
    }
    [targetState, activity, slots] = await Promise.all([
      apiFetch(`/api/seat-status?seatId=${encodeURIComponent(seatId)}`),
      apiFetch(`/api/seat-activity?seatId=${encodeURIComponent(seatId)}`),
      apiFetch(`/api/reservations/slots?seatId=${encodeURIComponent(seatId)}&date=${encodeURIComponent(els.reservationDateInput.value)}`)
    ]);
  } else {
    if (!roomCode) {
      window.location.href = './choose-seat.html';
      return;
    }
    [targetState, slots] = await Promise.all([
      apiFetch(`/api/room-status?roomCode=${encodeURIComponent(roomCode)}`),
      apiFetch(`/api/room-reservations/slots?roomCode=${encodeURIComponent(roomCode)}&date=${encodeURIComponent(els.reservationDateInput.value)}`)
    ]);
    activity = { recentReservations: [], recentOccupancyEvents: [] };
  }

  renderTargetStatus();
  renderActivity();
  renderSlots();
}

async function reserveTarget() {
  const seatId = getSelectedSeatId();
  const roomCode = getSelectedRoomCode();

  if (targetType === 'seat' && !seatId) {
    message = t('noTargetSelected');
    renderMessage();
    return;
  }
  if (targetType === 'room' && !roomCode) {
    message = t('noTargetSelected');
    renderMessage();
    return;
  }

  const url = targetType === 'seat' ? '/api/reservations' : '/api/room-reservations';
  const payload = targetType === 'seat'
    ? { seatId, reservationDate: els.reservationDateInput.value, startTime: els.reservationStartSelect.value, endTime: els.reservationEndSelect.value }
    : { roomCode, reservationDate: els.reservationDateInput.value, startTime: els.reservationStartSelect.value, endTime: els.reservationEndSelect.value };

  const result = await apiFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  message = result.message;
  selectedReservationId = null;
  await reloadTarget();
  renderMessage();
}

async function cancelReservation() {
  const reservation = selectedOwnedReservation();
  if (!reservation) {
    message = t('noReservationSelected');
    renderMessage();
    return;
  }

  const url = targetType === 'seat'
    ? `/api/reservations/${reservation.reservationId}`
    : `/api/room-reservations/${reservation.reservationId}`;
  const result = await apiFetch(url, { method: 'DELETE' });

  message = result.message;
  selectedReservationId = null;
  await reloadTarget();
  renderMessage();
}

els.langZhButton.onclick = () => {
  lang = 'zh';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyStaticText();
  renderTargetStatus();
  renderActivity();
  renderSlots();
  renderMessage();
};

els.langEnButton.onclick = () => {
  lang = 'en';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyStaticText();
  renderTargetStatus();
  renderActivity();
  renderSlots();
  renderMessage();
};

els.logoutButton.onclick = () => {
  setSession('');
  localStorage.removeItem(STORAGE_SEAT);
  localStorage.removeItem(STORAGE_ROOM);
  localStorage.removeItem(STORAGE_TARGET);
  window.location.href = './login.html';
};

els.reservationDateInput.onchange = async () => {
  selectedReservationId = null;
  await reloadTarget();
};

els.reservationStartSelect.onchange = () => {
  selectedReservationId = null;
  syncTimeInputs();
  renderSlots();
};

els.reservationEndSelect.onchange = () => {
  selectedReservationId = null;
  renderSlots();
};

els.reserveButton.onclick = reserveTarget;
els.cancelButton.onclick = cancelReservation;

(async function init() {
  syncSelectionFromUrl();
  els.reservationDateInput.value = getToday();
  syncTimeInputs();
  applyStaticText();
  renderMessage();
  try {
    await loadCurrentUser();
    await reloadTarget();
  } catch (error) {
    message = error.message || t('fetchStatusError');
    renderMessage();
  }
})();
