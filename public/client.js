const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const nameInput = document.getElementById('name');
const joinBtn = document.getElementById('join');
const onlineCount = document.getElementById('online-count');

let me = null;

function addMessage(item, opts = {}){
  const li = document.createElement('li');
  li.className = 'msg' + (item.user === me ? ' me' : '');

  const meta = document.createElement('div');
  meta.className = 'meta';
  const time = new Date(item.time).toLocaleTimeString();
  meta.textContent = `${item.user} • ${time}`;

  const text = document.createElement('div');
  text.textContent = item.text;

  li.appendChild(meta);
  li.appendChild(text);
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('history', (items) => {
  messages.innerHTML = '';
  items.forEach(addMessage);
});

socket.on('chat message', (item) => {
  addMessage(item);
});

socket.on('system', (txt) => {
  const li = document.createElement('li');
  li.className = 'msg';
  li.style.opacity = '0.8';
  li.textContent = txt;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

joinBtn.addEventListener('click', (e) => {
  const name = nameInput.value.trim() || 'Guest';
  me = name;
  socket.emit('join', name);
  nameInput.disabled = true;
  joinBtn.disabled = true;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!input.value) return;
  socket.emit('chat message', input.value);
  input.value = '';
});
