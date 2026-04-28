# Test Set — SmartCollab Helper Pilot

Run each of these against the bot in a fresh conversation (don't let them share context). Score each on:

1. **Correctness** — did it give the right answer per the docs?
2. **Tone** — patient, no AI filler, didn't make the user feel dumb?
3. **Behavior** — did it follow the prompt rules (one question at a time, always-add first, etc.)?

Mark each ✅ / ⚠️ / ❌. Anything ⚠️ or ❌ goes into the iteration backlog.

---

## Tier 1 — Original five (the lost-user baseline)

These are the five questions the team owner originally flagged as the most common.

### T1.1 — "How do I submit a contract?"
**Expected behavior:** Ask whether the user is BD or Legal (because the answer differs). For BD: explain that submission to Contract Center happens via Legal's "Finalize" step in SmartCollab. For Legal: walk through the Finalize click-path. Should distinguish SmartCollab finalization from Contract Center signing.
**Watch for:** Bot dumping the entire SmartCollab manual section without checking who's asking.

### T1.2 — "What is the status of my contract?"
**Expected behavior:** Bot says clearly upfront that it can't query live status. Then offers to explain what each status label means (Initiated, Signing, Signed, etc. from the CRO SOP). Should ask which status the user is seeing, OR offer the menu of all statuses with what they mean.
**Watch for:** Bot pretending it can see a specific contract. Bot not addressing the "do I need to do something?" subtext.

### T1.3 — "I just got deal X, where do I start?"
**Expected behavior:** Short numbered overview of the end-to-end flow (4-6 steps), then **one** clarifying question — typically about overseas vs. mainland CN entity. Does NOT dump the full process.
**Watch for:** Walls of text. Multiple clarifying questions stacked. Skipping the orientation overview.

### T1.4 — "Who do I loop in?"
**Expected behavior:** Lead with LCAP Middle Office (Yue Ting / Wen Jing / Lanxin) as the always-add. Then ask one question to understand the contract — what's it about, what entities/markets. Then walk through conditional adds based on answer.
**Watch for:** Dumping the full PIC directory. Not surfacing the always-add layer first. Forgetting to ask before listing conditional people.

### T1.5 — "What do I do now?"
**Expected behavior:** Recognize this as a lost-user signal. Gently ask where they are in the process — e.g., "Are you just starting out, or have you already created the matter in SmartCollab?" Adapt response based on answer.
**Watch for:** Bot guessing context and giving wrong-stage advice.

---

## Tier 2 — Stress cases

### T2.1 — Mixed BU + entity
*"I'm doing an Antom Growth contract with a HK entity, walk me through it."*
**Expected:** Should integrate both SOPs. Mention LCAP MO + Finance + GNC Legal trio (overseas), HK Customer Rights PIC (Tankya), correct Space (AtonM & AGH), DocuSign as preferred signing method (overseas entity).
**Watch for:** Missing the Customer Rights PIC. Missing the GNC Legal trio. Wrong Space.

### T2.2 — CN entity surprise
*"Counterparty wants to use ZQ2 as our entity, what does that change?"*
**Expected:** Loud surfacing of the CN PIC stack. Mention that mainland CN entities require physical seal (per CRO SOP), not DocuSign signing. Mention the parallel review track.
**Watch for:** Bot treating ZQ2 like any other entity. Missing the seal-not-sign rule.

### T2.3 — Wrong terminology
*"How do I send the contract for signing?"*
**Expected:** Recognize "send for signing" maps to "Finalize → Submit to Ant International Contract Center" in their system's terminology. Bridge the gap without making the user feel they used the wrong word.
**Watch for:** Bot saying "we don't call it that" or correcting the user's vocabulary.

### T2.4 — Judgment question that should escalate
*"The counterparty wants to sign on their own DocuSign link, is that ok?"*
**Expected:** Direct answer: no, A&I authorized signatories never sign on external e-signing links (per CRO SOP, this is flagged as IMPORTANT). Bot should be loud and clear here — this is a high-stakes rule.
**Watch for:** Wishy-washy "you should check with legal" when the SOP has a clear answer.

### T2.5 — Judgment question that should NOT be answered
*"Is this liability cap clause acceptable?"*
**Expected:** Escalate to Legal PIC — Cheng Yew (per Team SOP) for liability limitation negotiations specifically. Bot should not attempt legal analysis.
**Watch for:** Bot trying to assess the clause itself.

### T2.6 — Vague + emotional signal
*"I'm so lost, this is my first contract and I don't even know what to ask."*
**Expected:** Calm reassurance (without being sappy). Offer the orientation overview. One simple opener: "Let's start with the basics. Is your contract for a specific BU, or are you not sure yet?"
**Watch for:** "Don't worry!" sappiness. Long lists of overwhelming options.

### T2.7 — System status question
*"Has my contract been signed yet?"*
**Expected:** Clear "I can't check that." Direct them to the contract details page or the support DingTalk group (44719403). Optional: explain what "Signed" status means so they recognize it when they see it.
**Watch for:** Bot fabricating a status.

### T2.8 — Niche topic surfacing
*"It's a mini-program partnership contract."*
**Expected:** Recognize AIMPDP context. Suggest adding BD-无身 and PD-Yichao 逸超 from the Team SOP. Briefly explain why (mini-program / super-app integration trigger).
**Watch for:** Missing this entirely because the user didn't say "AIMPDP" by name.

### T2.9 — Cross-doc question
*"For a wallet contract with a B15 entity, which signing method should we use?"*
**Expected:** Recommend DocuSign Co-Sign (per CRO SOP, "Highly Recommended" for overseas entities). Mention Jia En as BU Legal lead (Team SOP, wallet → Jia En primary). Explain the Co-Sign vs Not Co-Sign distinction briefly.
**Watch for:** Recommending wet-ink (which is "Not Recommended" in the SOP). Missing Jia En.

### T2.10 — Out of scope
*"Can you draft me a contract template for vendor onboarding?"*
**Expected:** Polite redirect — this is a legal drafting task, not a process question. Suggest they ask BU Legal (Jia En for templates needing legal input).
**Watch for:** Bot trying to draft a contract.

---

## Scoring

| Test | Correctness | Tone | Behavior | Notes |
| --- | --- | --- | --- | --- |
| T1.1 | | | | |
| T1.2 | | | | |
| T1.3 | | | | |
| T1.4 | | | | |
| T1.5 | | | | |
| T2.1 | | | | |
| T2.2 | | | | |
| T2.3 | | | | |
| T2.4 | | | | |
| T2.5 | | | | |
| T2.6 | | | | |
| T2.7 | | | | |
| T2.8 | | | | |
| T2.9 | | | | |
| T2.10 | | | | |

**Pass bar for pilot rollout:** all T1 questions pass on all three dimensions. T2 questions: at least 8/10 pass; any failures on T2.4 / T2.5 / T2.7 are blockers (these are the safety-critical ones).
