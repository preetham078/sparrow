// Socket.IO-backed client
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const nameInput = document.getElementById('name');
const joinBtn = document.getElementById('join');
const onlineCount = document.getElementById('online-count');

let me = null;

// Connect to the Socket.IO server
const socket = io();

// --- Helpers ---

function addMessage(item) {
  const li = document.createElement('li');
  li.className = 'msg' + (item.user === me ? ' me' : '');

  const meta = document.createElement('div');
  meta.className = 'meta';
  const time = item.time ? new Date(item.time).toLocaleTimeString() : '';
  meta.textContent = `${item.user || 'Guest'} • ${time}`;

  const text = document.createElement('div');
  text.textContent = item.text || '';

  li.appendChild(meta);
  li.appendChild(text);
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(text) {
  const li = document.createElement('li');
  li.className = 'msg system';
  li.textContent = text;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

// --- Socket Events ---

// Receive chat history on connect
socket.on('history', (history) => {
  messages.innerHTML = '';
  history.forEach(addMessage);
});

// Receive new chat messages from other users (and self, via broadcast)
socket.on('chat message', (item) => {
  addMessage(item);
});

// System messages (user joined / left)
socket.on('system', (text) => {
  addSystemMessage(text);
});

// Online user count updates
socket.on('online count', (count) => {
  onlineCount.textContent = count;
});

// --- UI Events ---

joinBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) return;
  me = name;
  nameInput.disabled = true;
  joinBtn.disabled = true;

  // Tell the server our name
  socket.emit('join', name);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value || !me) return;

  // Send message via Socket.IO
  socket.emit('chat message', input.value);
  input.value = '';
});
