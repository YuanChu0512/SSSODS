const els = {
  eyebrow: document.getElementById('admin-eyebrow'),
  title: document.getElementById('admin-title'),
  subtitle: document.getElementById('admin-subtitle'),
  dashboardLink: document.getElementById('admin-dashboard-link'),
  langZhButton: document.getElementById('admin-lang-zh'),
  langEnButton: document.getElementById('admin-lang-en'),
  logoutButton: document.getElementById('admin-logout-button'),
  authStatus: document.getElementById('admin-auth-status'),
  areaHeading: document.getElementById('admin-area-heading'),
  areaNameLabel: document.getElementById('admin-area-name-label'),
  areaNameInput: document.getElementById('admin-area-name'),
  areaCreateButton: document.getElementById('admin-area-create-button'),
  roomHeading: document.getElementById('admin-room-heading'),
  roomAreaLabel: document.getElementById('admin-room-area-label'),
  roomAreaSelect: document.getElementById('admin-room-area'),
  roomNameLabel: document.getElementById('admin-room-name-label'),
  roomNameInput: document.getElementById('admin-room-name'),
  roomCreateButton: document.getElementById('admin-room-create-button'),
  seatHeading: document.getElementById('admin-seat-heading'),
  seatAreaLabel: document.getElementById('admin-seat-area-label'),
  seatAreaSelect: document.getElementById('admin-seat-area'),
  seatNameLabel: document.getElementById('admin-seat-name-label'),
  seatNameInput: document.getElementById('admin-seat-name'),
  seatCreateButton: document.getElementById('admin-seat-create-button'),
  message: document.getElementById('admin-message'),
  layoutHeading: document.getElementById('admin-layout-heading'),
  roomList: document.getElementById('admin-room-list')
};

const STORAGE_LANGUAGE = 'seatMonitorLanguage';
const STORAGE_TOKEN = 'seatMonitorToken';
const STORAGE_SEAT = 'seatMonitorSelectedSeat';
const STORAGE_ROOM = 'seatMonitorSelectedRoom';
const STORAGE_AREA = 'seatMonitorSelectedArea';

const i18n = {
  en: {
    eyebrow: 'School Admin Console',
    title: 'Area, Room and Seat Management',
    subtitle: 'Maintain area-scoped rooms and seats for students and devices.',
    back: 'Back to Seat Picker',
    logout: 'Logout',
    checking: 'Checking admin access...',
    areaHeading: 'Add Area',
    areaNameLabel: 'Area Name',
    areaNamePlaceholder: 'Enter area name',
    areaCreate: 'Create Area',
    roomHeading: 'Add Study Room',
    roomAreaLabel: 'Assign to Area',
    roomNameLabel: 'Room Name',
    roomNamePlaceholder: 'Enter room name',
    roomCreate: 'Create Room',
    seatHeading: 'Add Seat',
    seatAreaLabel: 'Assign to Area',
    seatNameLabel: 'Seat Name',
    seatNamePlaceholder: 'Enter seat name',
    seatCreate: 'Create Seat',
    layoutHeading: 'Current Layout',
    defaultMessage: 'Administrative messages will appear here.',
    authSignedIn: (name) => `Admin signed in as ${name}.`,
    noAreas: 'No areas yet.',
    noRooms: 'No rooms',
    noSeats: 'No seats',
    roomCount: (n) => `${n} rooms`,
    seatCount: (n) => `${n} seats`,
    roomsInArea: 'Rooms in this area',
    seatsInArea: 'Seats in this area',
    renameArea: 'Rename Area',
    deleteArea: 'Delete Area',
    renameRoom: 'Rename Room',
    deleteRoom: 'Delete Room',
    moveRoom: 'Move Room',
    moveSeat: 'Move Seat',
    renameSeat: 'Rename Seat',
    deleteSeat: 'Delete Seat',
    areaCreated: 'Area created successfully.',
    areaUpdated: 'Area updated successfully.',
    areaDeleted: 'Area deleted successfully.',
    roomCreated: 'Room created successfully.',
    roomUpdated: 'Room updated successfully.',
    roomDeleted: 'Room deleted successfully.',
    seatCreated: 'Seat created successfully.',
    seatUpdated: 'Seat updated successfully.',
    seatDeleted: 'Seat deleted successfully.',
    areaNamePrompt: 'Enter a new area name:',
    roomNamePrompt: 'Enter a new room name:',
    seatNamePrompt: 'Enter a new seat name:',
    moveRoomPrompt: 'Choose destination area code:',
    moveSeatPrompt: 'Choose destination area code:',
    selectAreaFirst: 'Create an area first.'
  },
  zh: {
    eyebrow: '学校管理员后台',
    title: '区域、自习室与座位管理',
    subtitle: '维护区域下独立的自习室与座位布局。',
    back: '返回选座页',
    logout: '退出登录',
    checking: '正在校验管理员权限...',
    areaHeading: '新增区域',
    areaNameLabel: '区域名称',
    areaNamePlaceholder: '输入区域名称',
    areaCreate: '创建区域',
    roomHeading: '新增自习室',
    roomAreaLabel: '所属区域',
    roomNameLabel: '自习室名称',
    roomNamePlaceholder: '输入自习室名称',
    roomCreate: '创建自习室',
    seatHeading: '新增座位',
    seatAreaLabel: '所属区域',
    seatNameLabel: '座位名称',
    seatNamePlaceholder: '输入座位名称',
    seatCreate: '创建座位',
    layoutHeading: '当前布局',
    defaultMessage: '后台操作提示会显示在这里。',
    authSignedIn: (name) => `当前管理员：${name}。`,
    noAreas: '暂无区域。',
    noRooms: '暂无自习室',
    noSeats: '暂无座位',
    roomCount: (n) => `${n} 个自习室`,
    seatCount: (n) => `${n} 个座位`,
    roomsInArea: '该区域下自习室',
    seatsInArea: '该区域下座位',
    renameArea: '重命名区域',
    deleteArea: '删除区域',
    renameRoom: '重命名自习室',
    deleteRoom: '删除自习室',
    moveRoom: '移动自习室',
    moveSeat: '移动座位',
    renameSeat: '重命名座位',
    deleteSeat: '删除座位',
    areaCreated: '区域创建成功。',
    areaUpdated: '区域修改成功。',
    areaDeleted: '区域删除成功。',
    roomCreated: '自习室创建成功。',
    roomUpdated: '自习室修改成功。',
    roomDeleted: '自习室删除成功。',
    seatCreated: '座位创建成功。',
    seatUpdated: '座位修改成功。',
    seatDeleted: '座位删除成功。',
    areaNamePrompt: '输入新的区域名称：',
    roomNamePrompt: '输入新的自习室名称：',
    seatNamePrompt: '输入新的座位名称：',
    moveRoomPrompt: '输入目标区域代码：',
    moveSeatPrompt: '输入目标区域代码：',
    selectAreaFirst: '请先创建区域。'
  }
};

let lang = localStorage.getItem(STORAGE_LANGUAGE) || 'en';
let user = null;
let areas = [];
let message = '';

const t = (key) => i18n[lang][key];

function getToken() {
  return localStorage.getItem(STORAGE_TOKEN) || '';
}

function clearSession() {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_AREA);
  localStorage.removeItem(STORAGE_ROOM);
  localStorage.removeItem(STORAGE_SEAT);
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
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

function setMessage(value) {
  message = value || '';
  els.message.textContent = message || t('defaultMessage');
}

function listRoomsFlat() {
  return areas.flatMap((area) => (area.rooms || []).map((room) => ({
    ...room,
    areaCode: area.areaCode
  })));
}

function listSeatsFlat() {
  return areas.flatMap((area) => (area.seats || []).map((seat) => ({
    ...seat,
    areaCode: area.areaCode
  })));
}

function fillAreaSelect(selectEl) {
  selectEl.innerHTML = '';
  if (!areas.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = t('selectAreaFirst');
    selectEl.appendChild(option);
    return;
  }
  areas.forEach((area) => {
    const option = document.createElement('option');
    option.value = area.areaCode;
    option.textContent = `${area.areaName} (${area.areaCode})`;
    selectEl.appendChild(option);
  });
}

function renderRoomItems(area) {
  const rooms = area.rooms || [];
  if (!rooms.length) {
    return `<div class="selection-summary">${t('noRooms')}</div>`;
  }

  return rooms.map((room) => `
    <div class="admin-seat-row">
      <div>
        <strong>${room.roomName}</strong>
        <div class="seat-card-code">${room.roomCode}</div>
      </div>
      <div class="admin-inline-actions">
        <button class="action-button subtle-button compact-button" type="button" data-action="rename-room" data-room="${room.roomCode}">${t('renameRoom')}</button>
        <button class="action-button subtle-button compact-button" type="button" data-action="move-room" data-room="${room.roomCode}">${t('moveRoom')}</button>
        <button class="action-button secondary-button compact-button" type="button" data-action="delete-room" data-room="${room.roomCode}">${t('deleteRoom')}</button>
      </div>
    </div>
  `).join('');
}

function renderSeatItems(area) {
  const seats = area.seats || [];
  if (!seats.length) {
    return `<div class="selection-summary">${t('noSeats')}</div>`;
  }

  return seats.map((seat) => `
    <div class="admin-seat-row">
      <div>
        <strong>${seat.seatName}</strong>
        <div class="seat-card-code">${seat.seatCode}</div>
      </div>
      <div class="admin-inline-actions">
        <button class="action-button subtle-button compact-button" type="button" data-action="rename-seat" data-seat="${seat.seatCode}">${t('renameSeat')}</button>
        <button class="action-button subtle-button compact-button" type="button" data-action="move-seat" data-seat="${seat.seatCode}">${t('moveSeat')}</button>
        <button class="action-button secondary-button compact-button" type="button" data-action="delete-seat" data-seat="${seat.seatCode}">${t('deleteSeat')}</button>
      </div>
    </div>
  `).join('');
}

function renderLayout() {
  els.roomList.innerHTML = '';

  if (!areas.length) {
    els.roomList.innerHTML = `<div class="selection-summary">${t('noAreas')}</div>`;
    return;
  }

  areas.forEach((area) => {
    const card = document.createElement('section');
    card.className = 'feature-panel admin-room-card';
    card.innerHTML = `
      <div class="panel-head">
        <div>
          <h2>${area.areaName}</h2>
          <p class="status-text compact-text">${area.areaCode}</p>
        </div>
        <div class="admin-inline-actions">
          <button class="action-button subtle-button compact-button" type="button" data-action="rename-area" data-area="${area.areaCode}">${t('renameArea')}</button>
          <button class="action-button secondary-button compact-button" type="button" data-action="delete-area" data-area="${area.areaCode}">${t('deleteArea')}</button>
        </div>
      </div>
      <div class="selection-summary-grid">
        <article class="insight-card">
          <p class="insight-label">${t('roomsInArea')}</p>
          <p class="insight-value">${t('roomCount')((area.rooms || []).length)}</p>
          <div class="admin-seat-stack">${renderRoomItems(area)}</div>
        </article>
        <article class="insight-card">
          <p class="insight-label">${t('seatsInArea')}</p>
          <p class="insight-value">${t('seatCount')((area.seats || []).length)}</p>
          <div class="admin-seat-stack">${renderSeatItems(area)}</div>
        </article>
      </div>
    `;
    els.roomList.appendChild(card);
  });
}

function applyText() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.title = t('title');
  els.eyebrow.textContent = t('eyebrow');
  els.title.textContent = t('title');
  els.subtitle.textContent = t('subtitle');
  els.dashboardLink.textContent = t('back');
  els.logoutButton.textContent = t('logout');
  els.areaHeading.textContent = t('areaHeading');
  els.areaNameLabel.textContent = t('areaNameLabel');
  els.areaNameInput.placeholder = t('areaNamePlaceholder');
  els.areaCreateButton.textContent = t('areaCreate');
  els.roomHeading.textContent = t('roomHeading');
  els.roomAreaLabel.textContent = t('roomAreaLabel');
  els.roomNameLabel.textContent = t('roomNameLabel');
  els.roomNameInput.placeholder = t('roomNamePlaceholder');
  els.roomCreateButton.textContent = t('roomCreate');
  els.seatHeading.textContent = t('seatHeading');
  els.seatAreaLabel.textContent = t('seatAreaLabel');
  els.seatNameLabel.textContent = t('seatNameLabel');
  els.seatNameInput.placeholder = t('seatNamePlaceholder');
  els.seatCreateButton.textContent = t('seatCreate');
  els.layoutHeading.textContent = t('layoutHeading');
  els.langZhButton.classList.toggle('active', lang === 'zh');
  els.langEnButton.classList.toggle('active', lang === 'en');
  els.authStatus.textContent = user ? t('authSignedIn')(user.displayName || user.username) : t('checking');
  setMessage(message);
}

async function loadCurrentUser() {
  if (!getToken()) {
    window.location.href = './login.html';
    return false;
  }

  try {
    const result = await apiFetch('/api/auth/me');
    user = result.user;
  } catch (error) {
    clearSession();
    window.location.href = './login.html';
    return false;
  }

  if (user.role !== 'admin') {
    window.location.href = './choose-seat.html';
    return false;
  }

  return true;
}

async function loadLayout() {
  const result = await apiFetch('/api/admin/layout');
  areas = result.areas || [];
  fillAreaSelect(els.roomAreaSelect);
  fillAreaSelect(els.seatAreaSelect);
  renderLayout();
}

async function createArea() {
  const areaName = els.areaNameInput.value.trim();
  const result = await apiFetch('/api/admin/areas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ areaName })
  });
  els.areaNameInput.value = '';
  setMessage(result.message || t('areaCreated'));
  await loadLayout();
}

async function createRoom() {
  const roomName = els.roomNameInput.value.trim();
  const areaCode = els.roomAreaSelect.value;
  const result = await apiFetch('/api/admin/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomName, areaCode })
  });
  els.roomNameInput.value = '';
  setMessage(result.message || t('roomCreated'));
  await loadLayout();
}

async function createSeat() {
  const areaCode = els.seatAreaSelect.value;
  const seatName = els.seatNameInput.value.trim();
  const result = await apiFetch('/api/admin/seats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ areaCode, seatName })
  });
  els.seatNameInput.value = '';
  setMessage(result.message || t('seatCreated'));
  await loadLayout();
}

async function handleLayoutClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const areaCode = button.dataset.area;
  const roomCode = button.dataset.room;
  const seatCode = button.dataset.seat;

  try {
    if (action === 'rename-area') {
      const nextName = window.prompt(t('areaNamePrompt'));
      if (!nextName) return;
      const result = await apiFetch(`/api/admin/areas/${encodeURIComponent(areaCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areaName: nextName })
      });
      setMessage(result.message || t('areaUpdated'));
      await loadLayout();
    } else if (action === 'delete-area') {
      const result = await apiFetch(`/api/admin/areas/${encodeURIComponent(areaCode)}`, {
        method: 'DELETE'
      });
      setMessage(result.message || t('areaDeleted'));
      await loadLayout();
    } else if (action === 'rename-room') {
      const nextName = window.prompt(t('roomNamePrompt'));
      if (!nextName) return;
      const result = await apiFetch(`/api/admin/rooms/${encodeURIComponent(roomCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: nextName })
      });
      setMessage(result.message || t('roomUpdated'));
      await loadLayout();
    } else if (action === 'move-room') {
      const nextAreaCode = window.prompt(t('moveRoomPrompt'));
      if (!nextAreaCode) return;
      const room = listRoomsFlat().find((item) => item.roomCode === roomCode);
      if (!room) return;
      const result = await apiFetch(`/api/admin/rooms/${encodeURIComponent(roomCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: room.roomName, areaCode: nextAreaCode })
      });
      setMessage(result.message || t('roomUpdated'));
      await loadLayout();
    } else if (action === 'delete-room') {
      const result = await apiFetch(`/api/admin/rooms/${encodeURIComponent(roomCode)}`, {
        method: 'DELETE'
      });
      setMessage(result.message || t('roomDeleted'));
      await loadLayout();
    } else if (action === 'rename-seat') {
      const nextName = window.prompt(t('seatNamePrompt'));
      if (!nextName) return;
      const seat = listSeatsFlat().find((item) => item.seatCode === seatCode);
      if (!seat) return;
      const result = await apiFetch(`/api/admin/seats/${encodeURIComponent(seatCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatName: nextName, areaCode: seat.areaCode })
      });
      setMessage(result.message || t('seatUpdated'));
      await loadLayout();
    } else if (action === 'move-seat') {
      const nextAreaCode = window.prompt(t('moveSeatPrompt'));
      if (!nextAreaCode) return;
      const seat = listSeatsFlat().find((item) => item.seatCode === seatCode);
      if (!seat) return;
      const result = await apiFetch(`/api/admin/seats/${encodeURIComponent(seatCode)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatName: seat.seatName, areaCode: nextAreaCode })
      });
      setMessage(result.message || t('seatUpdated'));
      await loadLayout();
    } else if (action === 'delete-seat') {
      const result = await apiFetch(`/api/admin/seats/${encodeURIComponent(seatCode)}`, {
        method: 'DELETE'
      });
      setMessage(result.message || t('seatDeleted'));
      await loadLayout();
    }
  } catch (error) {
    setMessage(error.message);
  }
}

els.langZhButton.onclick = () => {
  lang = 'zh';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyText();
  fillAreaSelect(els.roomAreaSelect);
  fillAreaSelect(els.seatAreaSelect);
  renderLayout();
};

els.langEnButton.onclick = () => {
  lang = 'en';
  localStorage.setItem(STORAGE_LANGUAGE, lang);
  applyText();
  fillAreaSelect(els.roomAreaSelect);
  fillAreaSelect(els.seatAreaSelect);
  renderLayout();
};

els.logoutButton.onclick = () => {
  clearSession();
  window.location.href = './login.html';
};

els.areaCreateButton.onclick = async () => {
  try {
    await createArea();
  } catch (error) {
    setMessage(error.message);
  }
};

els.roomCreateButton.onclick = async () => {
  try {
    await createRoom();
  } catch (error) {
    setMessage(error.message);
  }
};

els.seatCreateButton.onclick = async () => {
  try {
    await createSeat();
  } catch (error) {
    setMessage(error.message);
  }
};

els.roomList.addEventListener('click', handleLayoutClick);

(async function init() {
  applyText();
  try {
    const hasAccess = await loadCurrentUser();
    if (!hasAccess) return;
    applyText();
    await loadLayout();
  } catch (error) {
    setMessage(error.message);
  }
})();
