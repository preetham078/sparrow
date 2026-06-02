// Supabase-backed client
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const nameInput = document.getElementById('name');
const joinBtn = document.getElementById('join');

let me = null;

// Ensure env variables exist
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
  console.error('Supabase env not found. Create _env.js with SUPABASE_URL and SUPABASE_ANON_KEY');
}

const supabase = window.supabase ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

function addMessage(item){
  const li = document.createElement('li');
  li.className = 'msg' + (item.user === me ? ' me' : '');

  const meta = document.createElement('div');
  meta.className = 'meta';
  const time = item.time ? new Date(item.time).toLocaleTimeString() : '';
  meta.textContent = `${item.user || 'Guest'} • ${time}`;

  const text = document.createElement('div');
  text.textContent = item.text || item.body || '';

  li.appendChild(meta);
  li.appendChild(text);
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

async function loadHistory(){
  if (!supabase) return;
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('time', { ascending: true })
    .limit(200);
  if (error) return console.error(error);
  messages.innerHTML = '';
  (data || []).forEach(addMessage);
}

async function subscribe(){
  if (!supabase) return;
  try{
    // Realtime subscription for new messages
    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        addMessage(payload.new);
      });
    await channel.subscribe();
  }catch(err){
    // Fallback for older client versions
    try{
      supabase.from('messages').on('INSERT', payload => addMessage(payload.new)).subscribe();
    }catch(e){
      console.error('Realtime subscription failed', e);
    }
  }
}

joinBtn.addEventListener('click', (e) => {
  const name = nameInput.value.trim() || 'Guest';
  me = name;
  nameInput.disabled = true;
  joinBtn.disabled = true;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!input.value) return;
  const payload = {
    user: me || 'Guest',
    text: input.value,
    time: new Date().toISOString(),
  };
  if (supabase) {
    const { error } = await supabase.from('messages').insert([payload]);
    if (error) console.error(error);
  } else {
    // fallback: append locally
    addMessage(payload);
  }
  input.value = '';
});

// Initialize
loadHistory();
subscribe();
