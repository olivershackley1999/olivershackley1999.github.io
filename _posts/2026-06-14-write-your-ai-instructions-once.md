---
title: Write your AI instructions once, use them everywhere
date: 2026-06-14 09:00:00 -0700
categories: [Workflow]
tags: [dotfiles, config, automation, git]
description: I kept hand-editing the same personal instructions across Claude, and every other AI tool I use. So I borrowed the dotfiles playbook, one source of truth, version-controlled and built out to each tool.
---

## The problem

I use quite a few AI tools, both personally and at work. Claude Code, Claude Desktop, M365 Copilot, GitHub Copilot, Microsoft Scout, and NanoClaw. Every one of them has a box where I tell it how I want to be treated, things like who I am, how I like things explained, and what I want it to stop doing.

The trouble is that each tool keeps its own copy. The same few paragraphs about how I learn live in Claude's settings, in a file on disk for the terminal tools, and in a separate version inside every other tool. When I maintain all of that by hand it drifts apart. I change my mind about something, update it in one or two places, and forget the rest. A month later three tools believe three slightly different things about me.

None of this is hard. It is just tedious and easy to get wrong, and it gets worse every time I add another tool.

## The idea is old

Developers solved a version of this years ago with dotfiles. Your shell config, your editor settings, all the small preferences that make a machine feel like yours. You do not retype them on every computer. You keep them in one version-controlled folder and let every machine build itself from that single source. Change it once and pull everywhere.

My instructions are the same type of problem, just one layer up. Instead of carrying config between machines I am carrying it between AI tools. So I used the same playbook.

## One source of truth

There is one folder I edit, called `core`. It holds plain Markdown files, one topic per file. Who I am lives in `identity.md`. How I like things explained lives in `learning.md`. What I am working toward lives in `goals.md`. Each file is hand-written and tool-agnostic, so nothing in it knows or cares which AI is going to read it.

That folder is the only thing I ever touch. It is my single source of truth, the same way a dotfiles folder is for a machine.

## The build

On its own, `core` is just a pile of notes. A build script turns it into something each tool can actually read.

The script is dull on purpose. It reads the chunks I picked, stitches them together in order, and writes one finished file per tool into a second folder called `targets`. The logic for who gets what lives in the script instead of in my head.

The core of it is barely more than a few `cat` commands. A tool that should know who I am, how I learn, and what I am working toward gets a line like this.

```bash
cat core/identity.md core/learning.md core/goals.md > targets/claude-desktop.md
```

A lighter tool that only needs my identity and learning style gets a shorter line.

```bash
cat core/identity.md core/learning.md > targets/copilot.md
```

That is the whole trick. Each tool is one line that names the chunks it gets and the file those chunks get written to. Add a tool and I add a line. Change my mind about what a tool should know and I change which files sit on that line.

The flow only ever runs one way. I edit `core`, run the build, and `targets` updates. If I deleted the entire `targets` folder it would not matter, because the next build just makes it again.

## Two kinds of target

The tools fall into two groups, and the group a tool is in decides how far the automation can reach.

**File-backed tools** read a config file straight from disk. Claude Code reads a `CLAUDE.md` file, and an editor like Cursor reads its own rules file. For these the script writes the file right to where the tool looks for it, so the build finishes and the tool is already updated with nothing left for me to do.

**UI-backed tools** have no file to write. Their config lives in a settings box on a website, like the custom instructions field in Claude Desktop. The script still assembles the exact text, but it cannot reach into a web form and paste for me, so that last step stays manual where I copy the finished block and paste it in.

## Across machines

I work from more than one machine, so the source of truth has to travel with me. A private git repository is the hub and each machine holds its own clone. The `targets` folder is also git-ignored, so the generated output never gets committed.

## What I learned

I had treated the instructions I hand an AI like throwaway text, retyped for each tool and left to drift. The moment I started treating them like infrastructure with version-control, built from one source, and deployed everywhere, the drift stopped.
