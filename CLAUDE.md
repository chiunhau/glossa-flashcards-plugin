# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Glossa Flashcards** is an Obsidian plugin that uses Google Gemini to generate flashcard notes from selected text. It includes a practice mode, sidebar view, and a Pro tier backed by a hosted API.

The companion website/backend and Chrome extension live in a separate private repo.

## Structure

```
src/
  main.ts              — Plugin entry point: commands, ribbon icons, context menus, URI handler
  types.ts             — PluginSettings, FlashcardData, ProStats interfaces
  settings.ts          — Settings tab UI and DEFAULT_SETTINGS
  api/generate.ts      — Flashcard generation (direct Gemini or Pro proxy)
  ui/modals.ts         — FlashcardInputModal
  ui/sidebar.ts        — FlashcardsSidebarView
  ui/practice.ts       — PracticeSetupModal, PracticeModal
  utils/file.ts        — Vault helpers: loadFlashcardNotes, sanitizeFilename, ensureFolderExists
```

## Commands

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Release (patch|minor|major) — bumps version, commits, tags
npm run release patch
```

Build output is a single `main.js` at the repo root. To test, symlink or copy `main.js`, `manifest.json`, and `styles.css` into an Obsidian vault's `.obsidian/plugins/glossa-flashcards/` directory.

Releases are published automatically via GitHub Actions on tag push (`.github/workflows/release.yml`).

## Architecture

### Generation (`src/api/generate.ts`)

Two paths based on whether a `licenseKey` is set:
- **Free**: calls Google Gemini directly using the user's own API key (`callDirectGemini`)
- **Pro**: POSTs to the backend proxy at `https://glossaflashcards.vercel.app/api/generate` (`callProProxy`)

Output fields are configurable — a Zod schema is built dynamically from `settings.outputFields` to validate structured AI output. After generation, `createNote` writes the flashcard note with frontmatter derived from `settings.frontmatterConfig`.

### Settings (`src/settings.ts`)

All generation behavior is user-configurable: prompt, output fields, note body template, frontmatter properties, practice card templates, and filter fields. Default model is `gemini-2.5-flash-lite`; default language is Finnish.

Pro section shows a license key input and fetches live usage stats from `/api/stats` when a key is present.

### Practice (`src/ui/practice.ts`)

`PracticeSetupModal` lets users filter cards by any frontmatter property before starting. `PracticeModal` is a card-flip UI that iterates through the filtered set.

## Key Conventions

- Flashcards are stored as Obsidian Markdown notes in a configurable folder (default: `Flashcards/`)
- The note filename comes from the AI output field specified by `settings.titleField` (default: `dictionary_form`)
- After creation, selected text in the editor is replaced with `[[noteTitle|originalText]]`
- Frontmatter values support `{{fieldKey}}` and `{{source_text}}` substitution; JSON arrays are parsed if the value starts with `[`
- File deduplication: if a note already exists at the target path, it is opened rather than overwritten
- esbuild marks `obsidian`, `electron`, and all `@codemirror/*` packages as external
