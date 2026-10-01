import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const model = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.method === 'POST' && req.url === '/api/plan') {
    try {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 24_000) throw new Error('Request is too large.');
      }
      const { goals = [], focus = '', energy = 'steady' } = JSON.parse(raw || '{}');
      const safeGoals = goals.slice(0, 40).map(g => `- ${String(g.title).slice(0, 100)} (${String(g.category).slice(0, 30)}; ${g.doneToday ? 'done today' : 'still to do'}; streak ${Number(g.streak) || 0} days)`).join('\n') || '- No goals added yet';
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, stream: false, messages: [
          { role: 'system', content: 'You are Winter Arc, a warm, concise daily planning coach. Create a realistic plan with 3-5 time-block suggestions, a short break, and one kind closing sentence. Never shame the user. Do not invent fixed appointments or deadlines. Keep the response under 180 words. Plain text only.' },
          { role: 'user', content: `Energy today: ${String(energy).slice(0, 20)}. Focus: ${String(focus).slice(0, 1200) || 'Help me make steady progress.'}\nMy daily goals:\n${safeGoals}\nBuild a doable plan for today. Respect goals already done.` }
        ], options: { temperature: 0.7 } })
      });
      if (!response.ok) throw new Error(`Ollama returned ${response.status}. Is it running and is ${model} installed?`);
      const result = await response.json();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ plan: result.message?.content || 'I could not create a plan. Please try again.' }));
    } catch (error) {
      const message = error.cause?.code === 'ECONNREFUSED'
        ? 'Ollama is not running. Start Ollama, then try again.'
        : error.message || 'Could not create a plan.';
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: message }));
    }
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405); res.end('Method not allowed'); return;
  }
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found');
  }
});

server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Winter Arc is ready at http://localhost:${port}`));
