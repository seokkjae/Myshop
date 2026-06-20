# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Obsidian vault (`ttt`) used as a workspace for hand-built static HTML landing pages. It is **not** a code project — there is no build system, package manager, tests, or git repository. Each `DayNN/` folder holds one self-contained page.

- `Day01/index.html` — a single-file Korean landing page for a fictional Mapo-gu (망원동) neighborhood cafe, "모닝브루" (Morning Brew). All CSS lives in an inline `<style>` block; there is no JS, no external assets beyond Google Fonts.
- `.obsidian/` — Obsidian editor config (including the `obsidian-html-plugin` for previewing HTML inside the vault). Treat as editor metadata, not project source.

## Conventions for the pages

These reflect how `Day01/index.html` is built; follow them when creating or editing pages:

- **Single file, self-contained.** Markup + inline `<style>` in one `index.html`. No separate CSS/JS files, no bundler.
- **Korean-first content** (`<html lang="ko">`), with marketing copy and section comments written in Korean.
- **Design tokens** are CSS custom properties on `:root` (`--bg`, `--ink`, `--accent`, etc.). Reuse these variables rather than hardcoding colors.
- **Mobile-first**, single-column layout; desktop refinements go in a `@media (min-width: 600px)` block at the end of the stylesheet.
- Fonts loaded from Google Fonts (`Gowun Batang` for headings, `Noto Sans KR` for body).

## Previewing

Open the `index.html` directly in a browser, or use Obsidian's HTML plugin preview. No server or build step is required.
