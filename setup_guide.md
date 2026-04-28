# Setup Guide — SmartCollab Helper Pilot

## What you're setting up

A Claude Project that your team can use to ask questions about the SmartCollab and Contract Center process. Pilot stage — the goal is to validate the prompt and find gaps before deploying to DingTalk.

## Step 1 — Create the Project

1. In Claude.ai, create a new Project. Name it something like **"SmartCollab Helper"** or **"A&I Contract Center Bot"**.
2. Set it to private to start (you and a small pilot group). Open up access once it's tested.

## Step 2 — Add the system prompt

Paste the contents of `system_prompt.md` into the Project's **Custom Instructions** field.

This tells Claude how to behave in every conversation in this Project.

## Step 3 — Upload the knowledge base

Upload these three files to the Project knowledge:

| Order | File | Why this name |
| --- | --- | --- |
| 1 | `01_team_sop_pic_routing.md` | Team SOP — who to loop in. Numbered first because it's the most-referenced. |
| 2 | `02_cro_sop_signing_sealing_archiving.docx` | CRO SOP — the official A&I Contract Center SOP. |
| 3 | `03_smartcollab_user_manual.docx` | SmartCollab user manual — system click-paths. |

Naming tip: Numbered prefixes help Claude (and you) reason about which doc is which. Don't rename the files mid-pilot — it'll mess with anyone who's already cited them in conversations.

## Step 4 — Resolve the open items in the Team SOP

Before going wider than your pilot group:

- Fill in **Owner** (name + email) at the top of `team_sop_pic_routing.md`.
- Fill in **Last updated** date.
- Re-upload the updated file to the Project.

These two fields matter for accountability — when someone notices the doc is wrong six months from now, they need to know who to tell.

## Step 5 — Run the test set

Open `test_set.md` and run each question against the bot in a fresh conversation. For each one, check:

- Did it give the right answer?
- Did it follow the tone rules (no AI filler, patient, didn't make the user feel dumb)?
- Did it ask one clarifying question instead of dumping everything?
- Did it cite the right source doc?
- Did it correctly escalate when it should have?

Note where it failed. Iterate on the system prompt until the test set passes.

## Step 6 — Pilot rollout

Once the test set passes:

1. Share the Project with 3-5 BDs you trust to give honest feedback.
2. Tell them the bot is in pilot — they should flag any wrong answers.
3. Run for ~2 weeks, collect their failed/awkward queries.
4. Use those to refine the prompt and the team SOP.

## Step 7 — Plan for DingTalk

Once the prompt is solid, the path to DingTalk is roughly:

- The system prompt and knowledge base transfer directly — they're not Claude-Project-specific.
- You'll need engineering to: build the DingTalk bot wrapper, call the Anthropic API with the prompt + retrieved doc context, handle conversation state.
- Decide whether to use Claude via the Anthropic API (simplest, requires API key + budget) or another integration.
- The system prompt may need light tweaking for DingTalk-specific formatting (e.g., DingTalk markdown rendering quirks).

Don't start the DingTalk build until the pilot is clean. Most internal-bot projects fail because they shipped before the prompt was right.

## Maintenance

- **Quarterly review** of the team SOP — people change roles, new BUs get added, PICs leave. Whoever owns the doc is responsible for re-uploading the updated version to the Project.
- **Failure log** — keep a running doc of questions the bot got wrong. These are your iteration backlog.
- **Renaming/rotating PICs** — when someone leaves or changes roles, update the team SOP and re-upload immediately. A bot confidently emailing a person who left is the worst failure mode.
