# Winter Arc

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/bhanwars/WinterArc)

**Make today count.** Winter Arc is a calm, local-first goal tracker for building consistency one day at a time. It takes its visual direction and core habit-tracking ideas from the supplied Winter Arc reference and turns them into a complete, responsive app.

## What you can do

- Track daily goals across Body, Mind, Work, Money, and Life.
- Mark today's goals complete, edit goal names, and review the last seven days.
- See your arc day, overall consistency, check-in count, goal streaks, and per-goal progress.
- Choose the arc start date, duration (7–365 days), and the hour a new tracking day begins.
- Export a JSON backup of your goals and check-ins.
- Ask a local AI coach to make a practical daily plan around your goals, focus, and energy.
- Use the app on mobile or desktop, with no account and no cloud database.

## Run it in your browser with one click

Click **Open in GitHub Codespaces** above, then create the Codespace. It starts the app and opens a browser preview automatically. This requires signing into GitHub and having Codespaces available on your account; usage may count against your Codespaces allowance.

The goal tracker works in the Codespace. The optional AI planner needs Ollama running in the same Codespace; the local Ollama setup below is for running Winter Arc on your own computer.

## Run it

### 1. Install Node.js

Use Node.js 18 or newer. Winter Arc has no npm dependencies.

### 2. Start the app

```bash
git clone https://github.com/bhanwars/WinterArc.git
cd WinterArc
npm start
```

Open [http://localhost:4173](http://localhost:4173). Your goals and check-ins are stored in this browser's local storage. Use **Export** to save a backup before clearing browser data or switching devices.

## Set up the free local AI coach (optional)

The tracker works without AI. To use **Plan your day**, install [Ollama](https://ollama.com/download) and download a small open model:

```bash
ollama pull qwen2.5:1.5b
```

Keep Ollama running, then start Winter Arc with `npm start` and open the app at `http://localhost:4173`. The app sends your goal titles, check-in status, streaks, energy selection, and focus note to Ollama on the machine running Winter Arc. The planning request is handled by the local model; Winter Arc does not require a paid API key or send your plan to a hosted AI service. Model downloads require an internet connection and disk space. The server defaults to `qwen2.5:1.5b`; to choose a different model already installed in Ollama, set `OLLAMA_MODEL` when starting it:

```bash
OLLAMA_MODEL=qwen2.5:7b npm start
```

On Windows PowerShell, set that option with `$env:OLLAMA_MODEL="qwen2.5:7b"` before `npm start`.

## Privacy and storage

Goal data is saved in local storage in the browser profile where you use the app. The optional planner sends only the information shown above to the Ollama service listening on the machine running the app. In GitHub Codespaces, that machine is a GitHub-hosted development environment. Do not enter sensitive personal information in the focus note. The app has no account, analytics, or remote database.

## Deploying

This project is intended to run on your computer because it stores your data in your browser and the optional AI coach connects to your local Ollama installation. A static host such as GitHub Pages can display `index.html`, but the **Plan your day** feature requires the local Node server in `server.mjs` and Ollama. Do not expose the local server or Ollama port to the public internet.

## License

MIT. See [LICENSE](LICENSE).
