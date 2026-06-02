# sparrow — Live Chat App

Real-time web chat allowing members to join, see message history, and reply instantly with a polished UI.

This project is a simple demo using Node.js, Express and Socket.IO.

Quick start:

1. Install dependencies

```bash
cd sparrow
npm install
```

2. Run

```bash
npm start
# or for development with auto-reload
npm run dev
```

3. Open http://localhost:3000 in your browser

Features:

- Real-time messaging with Socket.IO
- In-memory message history (last 200 messages)
- Simple name join flow and system join/leave notices
- Responsive, polished UI

Next steps: add persistence (database), authentication, typing indicators, or deploy to a hosting provider.
Supabase migration

1. Create a Supabase project at https://app.supabase.com and open the SQL editor.
2. Run the SQL in `supabase/create_messages_table.sql` to create the `messages` table.
3. In your project settings -> API, copy the `URL` and the `anon public` key.
4. Create a file `public/_env.js` (or configure your deploy to generate it) with:

```js
window.SUPABASE_URL = 'https://your-project-ref.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-public-key';
```

5. The frontend now uses Supabase Realtime to receive new messages and inserts messages directly into the `messages` table.

Optional deploy via Supabase Hosting:

- Install the Supabase CLI: https://supabase.com/docs/guides/cli
- Run `supabase login` and `supabase link --project-ref YOUR_PROJECT_REF`.
- From the repo root, deploy the `public` folder as a site. See Supabase Hosting docs for exact commands — you can also use the Supabase Dashboard to connect a GitHub repo for automatic deploys.

