---
title: Sixty days with Microsoft Scout
date: 2026-06-05 09:00:00 -0700
categories: [Agents 365]
tags: [scout, agents, microsoft-365]
description: An autonomous agent that lives inside Microsoft 365. Here is what it actually did for me, and where it still falls down.
---

## The problem

For the last couple of years, every AI tool has been limited by our need to be at the keyboard. I ask, it answers, I ask again. The intelligence was real, but nothing happened unless I was there to make it happen.

Last year's wave of autonomous agents broke that pattern. You hand one a goal and let it run. Yet in spite of the excitement, I stayed away. Letting a general-purpose agent loose on my files and accounts was a risk I would not take on personally.

Microsoft Scout is the first one I trusted enough to use, and a lot of that comes down to who builds it. I work at Microsoft, so I got early access two months ago, before Scout was announced at Build on June 2nd. It is a first-party Microsoft product and is governed like one, which was enough to change the math for me.

## What it is

Scout is a desktop application for Windows and macOS that does work on your behalf without you driving each step. Microsoft calls this new category an Autopilot, and Scout is the first of its kind. It operates with the same primitives I do, like reading and writing files, running shell commands, driving a browser, and querying my Microsoft 365 data. With a chatbot, I get an answer. With an Autopilot like Scout, I get actual work done.

That last connection is where it earns its place, and where it probably will for you. At Microsoft we eat our own dogfood, so my entire working context already lives in Teams, Outlook, OneDrive, and SharePoint. Scout is grounded in that graph from day one, which means it starts most tasks with real context instead of a blank prompt. And the best part is the context compounds. Every interaction is another signal about how I work and what I care about. That feedback loop is where the gains come from. For me, it is what makes Scout the most contextual and useful agent I have used.

It is autonomous, but not unsupervised. Before it does anything with real weight, like sending an email or running a command, it pauses for my approval. The autonomy clears the busywork, and the approval gate keeps me in control of anything that matters. I will admit I let it run unattended when the prompts get disruptive, but that is my call to make, and the fact that it is my call is the point.

## The building blocks

A few primitives do most of the work, and the whole system is really just these composed together.

**Skills** are how you teach it a specific task, and a skill is a `SKILL.md` file containing instructions for how to do said task in markdown format. Scout loads one on demand, pulling it into context only when the task calls for it, so you can keep dozens on hand without bloating every prompt.

**A Heartbeat** runs a prompt on a fixed interval in the background, with no message from me to start it. Each fire is a fresh, stateless run of the same instruction. Set it once and it keeps going.

**An Automation** is a defined task that fires on a schedule or a condition. A daily digest of your inbox is one. A recurring scrape that pulls from several sources and collates them is another. Some of mine even collect input from me first and then act on it. You can make them as simple or as involved as you need.

**MCP connectors** are how it reaches past Microsoft 365. MCP is an open protocol for plugging an agent into outside systems, and Scout speaks it. I have mine wired to Microsoft Learn, GitHub, and Azure DevOps, so Scout can pull documentation, read and write against my repos, and query work items without me leaving the chat. Every connector you add is another place Scout can reach, which is what turns it from an assistant into something closer to a coworker.

## What it changed for me

**Notification triage that respects Do Not Disturb.** I keep DND on in Teams almost always. A heartbeat fires every 30 minutes, scans Teams and email, and surfaces something only if it is genuinely urgent, like a note from my manager or a customer issue that needs a fast reply. This gives me the quiet of being offline without the risk of missing what mattered.

**A study partner tuned to how I learn.** I wrote a few skills tuned *specifically* to how I want Scout to teach me. So when I am studying or ramping on something for a customer, it quizzes me and explains the material in a way that sticks for me, right from the start. The constant back-and-forth I used to need to get a good explanation has dropped off sharply.

**A weekly product dashboard that finds me.** An automation fires every Friday, pulls from a handful of internal sources and specific senders in my inbox, and renders the result as a Web Artifact I can open and share. The product news comes to me now, instead of me needing to dig for it and synthesize it myself.

**One document out of scattered context.** The information I need for a task almost never lives in one app. It is smeared across chats, documents, and records in half a dozen systems. I hand Scout one instruction, it fans out, resolves the retrievals, and hands back a single synthesized output in whatever format I ask for. The manual hunting that used to eat my prep time mostly disappears.

## What surprised me

The part I did not expect was how far it reaches once you connect real systems. A colleague showed me you can hook Scout into your Azure subscription, hand it something as open-ended as "build me a website and stand up the infrastructure to host it," and watch it provision the resources and deploy, on the fly. The first time I saw it stand up infrastructure from a single sentence, the approval gate stopped feeling like friction and started feeling like the only sane way to run this. That is the real trade with an Autopilot wired into live systems. The more you let it reach, the more it can do, and the more it matters that you are the one signing off.

## Where it falls short

Two months in, this thing has mostly been solid for me. The rough edges are minor, and most of them are really about learning to drive it well. Your mileage will vary.

**The browser can take over your screen.** Scout drives a real browser, and by default it runs it visibly under your own Entra sign-in, so when a task needs the web it pops a window open and grabs focus mid-task. You can run it headless to stop that, and you should. Worth doing on day one.

**It rewards tuning.** Output quality tracks almost directly with how well you have set it up (memory, skills, preferences, etc.). My accuracy bar is high, so I have it validate against named sources and I still approve and spot-check its actions. Untuned, it is an agent that does things. Tuned, it is an agent that does things exactly the way I want. The work is in the scaffolding, and that work pays off.

**It is a generalist.** Scout is a Swiss Army knife. It does almost everything, but that doesn't mean it does almost everything *well*. For example, Scout can build me a PowerPoint and get me 60 percent of the way, but I find Copilot inside PowerPoint (or whichever Office app I am in) gets me closer to 90 on the first run. Spend some time finding where Scout shines for you, and you will know which tool to reach for and when.

## What I learned

The intelligence was never the hard part. The models are good now, they were good a year ago, and they will be good a year from now. The step change comes from the scaffolding that teaches a general-purpose model how I work.

You can build that scaffolding for your personal life, and it helps. But your work context is far richer, because work is where most of us spend our hours and generate most of our data. Scout sits on both, carrying my personal preferences while my Microsoft 365 work data is baked in, and that combination is hard to match. It is the reason Scout has been so sticky for me, and a big part of why I am excited to help enterprises deploy it once it is generally available.
