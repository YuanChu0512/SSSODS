const els = {
  eyebrow: document.getElementById('selection-eyebrow'),
  title: document.getElementById('selection-title'),
  subtitle: document.getElementById('selection-subtitle'),
  adminLink: document.getElementById('selection-admin-link'),
  dashboardLink: document.getElementById('selection-dashboard-link'),
  langZhButton: document.getElementById('selection-lang-zh'),
  langEnButton: document.getElementById('selection-lang-en'),
  logoutButton: document.getElementById('selection-logout-button'),
  authStatus: document.getElementById('selection-auth-status'),
  metaLabel: document.getElementById('selection-meta-label'),
  seatCount: document.getElementById('selection-seat-count'),
  areaLabel: document.getElementById('selection-area-label'),
  areaTitle: document.getElementById('selection-area-title'),
  currentAreaChip: document.getElementById('selection-current-area-chip'),
  areaTabs: document.getElementById('selection-area-tabs'),
  modeLabel: document.getElementById('selection-mode-label'),
  modeTitle: document.getElementById('selection-mode-title'),
  currentModeChip: document.getElementById('selection-current-mode-chip'),
  modeRoomButton: document.getElementById('selection-mode-room'),
  modeSeatButton: document.getElementById('selection-mode-seat'),
  roomPanel: document.getElementById('selection-room-panel'),
  seatPanel: document.getElementById('selection-seat-panel'),
  roomLabel: document.getElementById('selection-room-label'),
  roomTitle: document.getElementById('selection-room-title'),
  seatLabel: document.getElementById('selection-seat-label'),
  seatTitle: document.getElementById('selection-seat-title'),
  currentRoomChip: document.getElementById('selection-current-room-chip'),
  roomTabs: document.getElementById('selection-room-tabs'),
  seatGrid: document.getElementById('selection-seat-grid'),
  selectedAreaLabel: document.getElementById('selection-selected-area-label'),
  selectedArea: document.getElementById('selection-selected-area'),
  selectedRoomLabel: document.getElementById('selection-selected-room-label'),
  selectedRoom: document.getElementById('selection-selected-room'),
  selectedSeatLabel: document.getElementById('selection-selected-seat-label'),
  selectedSeat: document.getElementById('selection-selected-seat'),
  selectedSeatStatusLabel: document.getElementById('selection-selected-seat-status-label'),
  selectedSeatStatus: document.getElementById('selection-selected-seat-status'),
  message: document.getElementById('selection-message'),
  confirmButton: document.getElementById('selection-confirm-button')
};

const STORAGE_LANGUAGE = 'seatMonitorLanguage';
const STORAGE_TOKEN = 'seatMonitorToken';
const STORAGE_AREA = 'seatMonitorSelectedArea';
const STORAGE_ROOM = 'seatMonitorSelectedRoom';
const STORAGE_SEAT = 'seatMonitorSelectedSeat';
const STORAGE_TARGET = 'seatMonitorSelectedTarget';

const i18n = {
  en: {
    eyebrow: 'Smart Study Space',
    title: 'Choose an Area, Room and Seat',
    subtitle: 'Choose the area first, then pick one target type: room or seat.',
    dashboard: 'Dashboard',
    admin: 'Admin',
    logout: 'Logout',
    authSignedIn: (name) => `Signed in as ${name}.`,
    areasLabel: 'Areas',
    areaTitle: 'Step 1. Choose an area',
    modeLabel: 'Reservation Target',
    modeTitle: 'Step 2. Choose room or seat',
    modeNone: 'No target selected',
    modeRoom: 'Room Mode',
    modeSeat: 'Seat Mode',
    modeRoomButton: 'Room',
    modeSeatButton: 'Seat',
    roomsLabel: 'Study Rooms',
    roomTitle: 'Step 3. Choose a room',
    seatLabel: 'Seats',
    seatSectionTitle: 'Step 3. Choose a seat',
    noAreaSelected: 'No area selected',
    noRoomSelected: 'No room selected',
    selectedAreaLabel: 'Selected Area',
    selectedRoomLabel: 'Selected Room',
    selectedSeatLabel: 'Selected Seat',
    selectedSeatStatusLabel: 'Current Status',
    seatsMeta: 'Seats',
    openDashboard: 'Open Dashboard',
    selectionHint: 'Pick room mode or seat mode first.',
    noAreas: 'No areas are available yet.',
    noRooms: 'No rooms are available in this area.',
    noSeats: 'No seats are available in this area.',
    occupied: 'Occupied',
    free: 'Free',
    reserved: 'Reserved',
    notReserved: 'Not Reserved',
    combinedStatus: (occupancy, reservation) => `${occupancy} / ${reservation}`,
    roomSeats: (n) => `${n} seats`,
    selectedSeatMessage: (seat, area) => `Selected seat ${seat} in ${area}.`,
    selectedRoomMessage: (room, area) => `Selected room ${room} in ${area}.`,
    seatCardHint: 'Choose this seat',
    loginRequired: 'Please sign in again to continue.'
  },
  zh: {
    eyebrow: '智能自习空间',
    title: '选择区域、自习室和座位',
    subtitle: '先选择区域，再选择一种目标：自习室或座位。',
    dashboard: '仪表盘',
    admin: '后台管理',
    logout: '退出登录',
    authSignedIn: (name) => `当前登录用户：${name}。`,
    areasLabel: '区域',
    areaTitle: '第 1 步：选择区域',
    modeLabel: '预约目标',
    modeTitle: '第 2 步：选择自习室或座位',
    modeNone: '未选择目标',
    modeRoom: '自习室模式',
    modeSeat: '座位模式',
    modeRoomButton: '自习室',
    modeSeatButton: '座位',
    roomsLabel: '自习室',
    roomTitle: '第 3 步：选择自习室',
    seatLabel: '座位数',
    seatSectionTitle: '第 3 步：选择座位',
    noAreaSelected: '未选择区域',
    noRoomSelected: '未选择自习室',
    selectedAreaLabel: '已选区域',
    selectedRoomLabel: '已选自习室',
    selectedSeatLabel: '已选座位',
    selectedSeatStatusLabel: '当前状态',
    seatsMeta: '座位数',
    openDashboard: '进入仪表盘',
    selectionHint: '请先选择自习室模式或座位模式。',
    noAreas: '暂无可用区域。',
    noRooms: '该区域暂无可用自习室。',
    noSeats: '该区域暂无可用座位。',
    occupied: '有人',
    free: '空闲',
    reserved: '已预约',
    notReserved: '未预约',
    combinedStatus: (occupancy, reservation) => `${occupancy} / ${reservation}`,
    roomSeats: (n) => `${n} 个座位`,
    selectedSeatMessage: (seat, area) => `已在 ${area} 选择座位 ${seat}。`,
    selectedRoomMessage: (room, area) => `已在 ${area} 选择自习室 ${room}。`,
    seatCardHint: '选择这个座位',
    loginRequired: '请先重新登录后再继续。'
  }
};

let lang = localStorage.getItem(STORAGE_LANGUAGE) || 'en';
let user = null;
let areas = [];
let selectedArea = localStorage.getItem(STORAGE_AREA) || '';
let selectedRoom = localStorage.getItem(STORAGE_ROOM) || '';
let selectedSeat = localStorage.getItem(STORAGE_SEAT) || '';
let selectedTarget = localStorage.getItem(STORAGE_TARGET) || '';

const t = (key) => i18n[lang][key];

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN) || '';
}

function setSession(token) {
  if (token) localStorage.setItem(STORAGE_TOKEN, token);
  else localStorage.removeItem(STORAGE_TOKEN);
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

function currentArea() {
  return areas.find((area) => area.areaCode === selectedArea) || null;
}

function currentRoom() {
  const area = currentArea();
  return area ? area.rooms.find((room) => room.roomCode === selectedRoom) || null : null;
}

function currentSeat() {
  const area = currentArea();
  return area ? (area.seats || []).find((seat) => seat.seatId === selectedSeat) || null : null;
}

function persistSelection() {
  if (selectedArea) localStorage.setItem(STORAGE_AREA, selectedArea);
  else localStorage.removeItem(STORAGE_AREA);
  if (selectedRoom) localStorage.setItem(STORAGE_ROOM, selectedRoom);
  else localStorage.removeItem(STORAGE_ROOM);
  if (selectedSeat) localStorage.setItem(STORAGE_SEAT, selectedSeat);
  else localStorage.removeItem(STORAGE_SEAT);
  if (selectedTarget) localStorage.setItem(STORAGE_TARGET, selectedTarget);
  else localStorage.removeItem(STORAGE_TARGET);
}

function buildDashboardUrl() {
  const params = new URLSearchParams();
  if (selectedTarget) params.set('targetType', selectedTarget);
  if (selectedArea) params.set('areaCode', selectedArea);
  if (selectedTarget === 'room' && selectedRoom) params.set('roomCode', selectedRoom);
  if (selectedTarget === 'seat' && selectedSeat) params.set('seatId', selectedSeat);
  return `./index.html?${params.toString()}`;
}

function updateAdminLinkVisibility() {
  const isAdmin = Boolean(user && user.role === 'admin');
  els.adminLink.hidden = !isAdmin;
  els.adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
  if (isAdmin) els.adminLink.setAttribute('href', './admin.html');
  else els.adminLink.removeAttribute('href');
}

function applyText() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('title');
  els.eyebrow.textContent = t('eyebrow');
  els.title.textContent = t('title');
  els.subtitle.textContent = t('subtitle');
  els.adminLink.textContent = t('admin');
  els.dashboardLink.textContent = t('dashboard');
  els.logoutButton.textContent = t('logout');
  els.metaLabel.textContent = t('seatsMeta');
  els.areaLabel.textContent = t('areasLabel');
  els.areaTitle.textContent = t('areaTitle');
  els.modeLabel.textContent = t('modeLabel');
  els.modeTitle.textContent = t('modeTitle');
  els.modeRoomButton.textContent = t('modeRoomButton');
  els.modeSeatButton.textContent = t('modeSeatButton');
  els.roomLabel.textContent = t('roomsLabel');
  els.roomTitle.textContent = t('roomTitle');
  els.seatLabel.textContent = t('seatLabel');
  els.seatTitle.textContent = t('seatSectionTitle');
  els.selectedAreaLabel.textContent = t('selectedAreaLabel');
  els.selectedRoomLabel.textContent = t('selectedRoomLabel');
  els.selectedSeatLabel.textContent = t('selectedSeatLabel');
  els.selectedSeatStatusLabel.textContent = t('selectedSeatStatusLabel');
  els.confirmButton.textContent = t('openDashboard');
  els.langZhButton.classList.toggle('active', lang === 'zh');
  els.langEnButton.classList.toggle('active', lang === 'en');
}

function applyTargetPanels() {
  const roomMode = selectedTarget === 'room';
  const seatMode = selectedTarget === 'seat';
  els.roomPanel.classList.toggle('collapsed-panel', !roomMode);
  els.seatPanel.classList.toggle('collapsed-panel', !seatMode);
  els.modeRoomButton.classList.toggle('active', roomMode);
  els.modeSeatButton.classList.toggle('active', seatMode);
}

function renderHeader() {
  applyTargetPanels();
  const area = currentArea();
  const room = currentRoom();
  const seat = currentSeat();

  els.authStatus.textContent = user ? t('authSignedIn')(user.displayName || user.username) : t('loginRequired');
  updateAdminLinkVisibility();
  els.dashboardLink.href = buildDashboardUrl();
  els.currentAreaChip.textContent = area ? area.areaName : t('noAreaSelected');
  els.currentRoomChip.textContent = room ? room.roomName : t('noRoomSelected');
  els.currentModeChip.textContent = selectedTarget === 'room'
    ? t('modeRoom')
    : (selectedTarget === 'seat' ? t('modeSeat') : t('modeNone'));
  const seatTotal = area && area.seats ? area.seats.length : 0;
  els.seatCount.textContent = t('roomSeats')(seatTotal);
  els.selectedArea.textContent = area ? area.areaName : '-';
  els.selectedRoom.textContent = selectedTarget === 'room' && room ? room.roomName : '-';
  els.selectedSeat.textContent = selectedTarget === 'seat' && seat ? `${seat.seatName} (${seat.seatId})` : '-';
  els.selectedSeatStatus.textContent = selectedTarget === 'seat' && seat
    ? t('combinedStatus')(
      seat.occupancyStatus === 'Occupied' ? t('occupied') : t('free'),
      seat.reservationStatus === 'Reserved' ? t('reserved') : t('notReserved')
    )
    : '-';

  if (selectedTarget === 'room' && room && area) {
    els.message.textContent = t('selectedRoomMessage')(room.roomName, area.areaName);
  } else if (selectedTarget === 'seat' && seat && area) {
    els.message.textContent = t('selectedSeatMessage')(seat.seatName, area.areaName);
  } else {
    els.message.textContent = t('selectionHint');
  }

  if (selectedTarget === 'room') {
    els.confirmButton.disabled = !selectedRoom;
  } else if (selectedTarget === 'seat') {
    els.confirmButton.disabled = !selectedSeat;
  } else {
    els.confirmButton.disabled = true;
  }
}

function renderAreas() {
  els.areaTabs.innerHTML = '';
  if (!areas.length) {
    els.areaTabs.innerHTML = `<div class="selection-summary">${t('noAreas')}</div>`;
    return;
  }

  areas.forEach((area) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `room-tab${area.areaCode === selectedArea ? ' active' : ''}`;
    button.textContent = area.areaName;
    button.onclick = () => {
      selectedArea = area.areaCode;
      selectedRoom = '';
      selectedSeat = '';
      persistSelection();
      renderAreas();
      renderRooms();
      renderSeats();
      renderHeader();
    };
    els.areaTabs.appendChild(button);
  });
}

function renderRooms() {
  els.roomTabs.innerHTML = '';
  const area = currentArea();
  if (!area || !area.rooms.length) {
    els.roomTabs.innerHTML = `<div class="selection-summary">${t('noRooms')}</div>`;
    return;
  }

  area.rooms.forEach((room) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `room-tab${room.roomCode === selectedRoom ? ' active' : ''}`;
    button.textContent = room.roomName;
    button.onclick = () => {
      selectedRoom = room.roomCode;
      selectedSeat = '';
      persistSelection();
      renderRooms();
      renderHeader();
    };
    els.roomTabs.appendChild(button);
  });
}

function renderSeats() {
  els.seatGrid.innerHTML = '';
  const area = currentArea();
  const seats = area && area.seats ? area.seats : [];
  if (!seats.length) {
    els.seatGrid.innerHTML = `<div class="selection-summary">${t('noSeats')}</div>`;
    return;
  }

  seats.forEach((seat) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `seat-card${seat.seatId === selectedSeat ? ' selected' : ''}`;
    button.innerHTML = `
      <span class="seat-card-title">${seat.seatName}</span>
      <span class="seat-card-code">${seat.seatId}</span>
      <span class="seat-card-meta">${seat.occupancyStatus === 'Occupied' ? t('occupied') : t('free')}</span>
      <span class="seat-card-meta">${seat.reservationStatus === 'Reserved' ? t('reserved') : t('notReserved')}</span>
      <span class="seat-card-caption">${t('seatCardHint')}</span>
    `;
    button.onclick = () => {
      selectedSeat = seat.seatId;
      selectedRoom = '';
      persistSelection();
      renderSeats();
      renderHeader();
    };
    els.seatGrid.appendChild(button);
  });
}

function activateMode(nextMode) {
  if (!['room', 'seat'].includes(nextMode)) return;
  selectedTarget = nextMode;
  if (nextMode === 'room') {
    selectedSeat = '';
  } else {
    selectedRoom = '';
  }
  persistSelection();
  renderRooms();
  renderSeats();
  renderHeader();
}

async function loadCurrentUser() {
  if (!getToken()) {
    window.location.href = './login.html';
    return;
  }
  const result = await apiFetch('/api/auth/me');
  user = result.user;
}

async function loadAreas() {
  const result = await apiFetch('/api/rooms');
  areas = result.areas || [];
  if (!selectedArea && areas.length) selectedArea = areas[0].areaCode;
  if (!['room', 'seat'].includes(selectedTarget)) selectedTarget = '';

  const area = currentArea();
  if (selectedTarget === 'room') {
    if (!area || !area.rooms.some((room) => room.roomCode === selectedRoom)) selectedRoom = '';
    selectedSeat = '';
  } else if (selectedTarget === 'seat') {
    if (!area || !(area.seats || []).some((seat) => seat.seatId === selectedSeat)) selectedSeat = '';
    selectedRoom = '';
  } else {
    selectedRoom = '';
    selectedSeat = '';
  }

  persistSelection();
}

els.modeRoomButton.onclick = () => activateMode('room');
els.modeSeatButton.onclick = () => activateMode('seat');

els.langZhButton.onclick = () => {
  lang = 'zh';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyText();
  renderAreas();
  renderRooms();
  renderSeats();
  renderHeader();
};

els.langEnButton.onclick = () => {
  lang = 'en';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyText();
  renderAreas();
  renderRooms();
  renderSeats();
  renderHeader();
};

els.logoutButton.onclick = () => {
  setSession('');
  localStorage.removeItem(STORAGE_AREA);
  localStorage.removeItem(STORAGE_ROOM);
  localStorage.removeItem(STORAGE_SEAT);
  localStorage.removeItem(STORAGE_TARGET);
  window.location.href = './login.html';
};

els.confirmButton.onclick = () => {
  if (els.confirmButton.disabled) return;
  persistSelection();
  window.location.href = buildDashboardUrl();
};

(async function init() {
  applyText();
  try {
    await loadCurrentUser();
    await loadAreas();
    renderAreas();
    renderRooms();
    renderSeats();
    renderHeader();
  } catch (error) {
    els.message.textContent = error.message;
  }
})();
