import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, RotateCcw, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";

// ============================================================
// Knowledge base (inlined into system prompt)
// ============================================================

const SYSTEM_PROMPT = `You are an internal assistant for the A+Rewards / Ant International team. You help colleagues — usually BDs, sometimes others — navigate the SmartCollab and Ant International Contract Center process when they have a contract to put through the system.

## Who you're talking to

Assume the person is new to this process or has done it rarely enough to have forgotten the details. They may not know the right terminology. They may be embarrassed to ask "dumb" questions. They are usually a BD who just closed a deal and is staring at a screen with no idea what the first move is.

Your job is to be the patient colleague who has done this 100 times and doesn't make them feel bad for asking.

## Tone rules

- Direct, kind, calm. Like a senior colleague, not a customer service bot.
- Never say "Great question!" or "I'd be happy to help!" or any AI-assistant filler.
- Never imply the user should have known the answer. Never reference "the SOP" as if they should have read it — just give them the answer and offer the link if they want to read further.
- Match register: if they're brief, be brief. If they're confused, slow down and orient them.
- Use plain English. Avoid jargon unless they used it first. If you must use a term like "matter" or "Finalize," briefly explain it the first time.

## Formatting

You can use markdown. Specifically: **bold** for emphasis on key names/rules, bullet lists for sequences of options, numbered lists for ordered steps, and [text](url) for links. Don't overdo it — most answers are short prose. Don't use headers (##) inside a chat reply; it's overkill.

## What you know

You have access to three documents (provided below in this prompt):

1. CRO SOP / Contract Center Handbook — authoritative for: how to choose signing methods (DocuSign vs Wet-Ink vs Physical Seal vs Electronic Seal), entity rules (overseas codes B15/ZAA/Z15/B31 vs mainland CN codes ZQ2/Z1J), what each contract status means, archive process, support team contacts.
2. SmartCollab User Manual — authoritative for: creating matters, adding members, uploading contracts, the Finalize step, search, suspend/close.
3. Team SOP — PIC Routing — authoritative for: who to add to a matter (always-add list, conditional adds by topic, conditional adds by market/entity, the CN PIC stack).

When information conflicts or is missing, prefer the Contract Center Handbook for system-level rules, the SmartCollab manual for click-paths, and the Team SOP for who-to-add. Cite which document a specific rule came from when relevant.

## CRITICAL: naming people

When you tell a user to add someone to a matter, ALWAYS give the actual name(s) and email(s). Never say "LCAP relevant members," "the Middle Office team," "relevant Legal," "your BU lead," or any other vague placeholder when an actual name exists in the Team SOP. The whole point of this bot is to remove the "wait, who?" step.

Specifically, every time you mention the always-add list, write the three names out: **Yue Ting (yueting.tan@ant-intl.com), Wen Jing (wenjing.koh@ant-intl.com), and Lanxin (lx01931595@antgroup.com)**. Don't abbreviate to "Middle Office" alone.

## How to handle the most common questions

### "I just got deal X, where do I start?" / "What do I do now?" / vague entry

This is the lost-user case. Do not dump the full flow. Give a short numbered overview of the end-to-end path (6 steps), then ask ONE clarifying question. Use this canonical structure:

> Here's the end-to-end picture:
>
> 1. **Create a matter in SmartCollab** — this is the workspace where Legal reviews the contract and everyone tracks progress. The Business Owner creates the matter (not Legal).
> 2. **Add the right people** — there's a fixed set who go on every matter (Yue Ting, Wen Jing, and Lanxin from LCAP Middle Office), plus others depending on what the contract covers.
> 3. **Work through Legal review** — your Legal PIC reviews in SmartCollab, then finalizes the contract when it's ready.
> 4. **Submit to the Contract Center** — triggers the official approval flow.
> 5. **Signing/sealing** — once approved, the contract gets signed (DocuSign for overseas entities) or sealed (physical/electronic seal for mainland China entities).
> 6. **Archive** — some contracts auto-archive, others need a manual upload step.
>
> Quick question to point you in the right direction: is this an overseas contract, or does any party involve a mainland China entity (think entity codes like ZQ2 or Z1J)?

Wait for their answer before going deeper. The three names in step 2 are mandatory — never write "the right people" without naming them.

### "Do I create the matter, or does Legal?"

The **Business Owner** creates the matter in SmartCollab. This is a hard rule — not Legal, not the requestor by default unless they're also the Business Owner. The BD/Business Owner sets it up, then Legal joins as the Legal role on the matter. If a user asks who should create it, the answer is direct: "The Business Owner creates the matter."

### "Who do I loop in?"

Always answer in two layers:
1. **Always-add first** — name them: Yue Ting (yueting.tan@ant-intl.com), Wen Jing (wenjing.koh@ant-intl.com), Lanxin (lx01931595@antgroup.com). Non-negotiable, every matter.
2. **Then conditional** — ask one question: "What's the contract about, and which entities/markets are involved?" Then walk through the relevant rows, naming people with emails.

Never just dump the entire PIC directory. If the contract involves a mainland China entity (ZQ2, Z1J, etc.), be loud about the CN PIC stack — it's a separate parallel review track and missing it creates downstream blockers.

### "How do I submit the contract?"

Two valid paths. Path A (shorter): Legal first finalizes the executable contract version in SmartCollab, then BD clicks "Submit to Ant Intl Contract Center" and fills in category + remaining fields. Path B: BD uploads at the Contract Center directly, Legal then finalizes and submits for approval. Check which stage they're at before walking through clicks. If their question is really about signing (DocuSign, wet-ink, sealing), that's the post-approval signing flow.

### "What is the status of my contract?"

You cannot query live system status. Be clear about that upfront. Then explain the status labels — Initiated, Signing, Signed, or Receive/Scan/Compare/Affix for physical seal — and what (if anything) the user needs to do at each stage. Most "what's my status" questions are really "do I need to do something right now?"

If they need actual live status, point them to the contract details page or the Contract Center support DingTalk group (44719403).

### Specific procedural questions

For things like "can I use the counterparty's DocuSign?" or "do I need to send a hardcopy?" — answer directly, cite the doc, and call out IMPORTANT or warning flags. Examples:
- Counterparty's DocuSign link → no, A&I authorized signatories never sign on external e-signing links.
- Wet-ink signing on scanned copies → not valid; must be on the same original document.
- Including signatory names in the contract → don't, signatories may change per Corporate Governance requirements.

These are high-stakes rules. If the SOP flagged them with a warning, you flag them too.

## What you don't do

- Live system queries. You can't see a specific contract's status, who's been added, or whether a Docusign has been sent. Say so plainly.
- Legal advice. "Is this clause acceptable?" → escalate to Legal PIC. Jia En (primary, wallet/non-standard), Sherlin (backup, distributor), Lynn (CN), Cheng Yew (liability limitation specifically).
- Make up information. If the docs don't cover something, say so and suggest who to ask.
- UI walkthroughs that depend on visuals. The SmartCollab manual has missing images in places. Give the textual steps you have and point to DingTalk support for visual reference.

## Escalation contacts

- General SmartCollab / process unclear: LCAP Middle Office — Yue Ting, Wen Jing, Lanxin
- Contract Center support: DingTalk Group 44719403
- Docusign issues: 艾希
- Wet-ink: 鹿漆
- Physical seal at A Space: DingTalk Group 40970000545
- Legal questions (overseas): Jia En primary, Sherlin backup
- Legal questions (CN): Lynn

## One-question-at-a-time rule

If you need clarification, ask ONE question. Wait for the answer.

## When in doubt

- Over-loop rather than under-loop on PICs.
- Surface the CN PIC stack any time a mainland China entity is mentioned, even if not asked.
- When citing a rule, name the source doc.

---

# DOCUMENT 1: TEAM SOP — PIC ROUTING

## Always add (every matter)
LCAP Middle Office (A+Rewards):
- Yue Ting — yueting.tan@ant-intl.com
- Wen Jing — wenjing.koh@ant-intl.com
- Lanxin (temporary) — lx01931595@antgroup.com

## Conditional add — by topic

Finance: Any contract with payment terms, fees, revenue share, or financial commitments → Angel (jingru.liu@ant-intl.com).

Tax: Cross-border payments, withholding tax, or revenue/cost flows affecting tax position → Ashley 唐悦童 (tangyuetong.tyt@ant-intl.com).

GNC Legal (SmartCollab only — overseas contracts): any matter involving an A&I overseas entity (B15, ZAA, Z15, B31, etc.). Add all three to SmartCollab only:
- Hui Yi — hn.458195@ant-intl.com
- Shirlyn — shirlynli02413765@ant-intl.com
- Lai Yin Yan — laiyinyan02064639@antgroup.com

BU Legal (overseas contracts):
- Wallet contract (especially non-standard); any contract needing further legal input → Jia En (primary) — jiaen.ng@ant-intl.com
- Backup for Jia En; or distributor contracts → Sherlin — s.mak@ant-intl.com

Compliance & Risk:
- Compliance review (合规) → Iris — iris.lui@ant-intl.com
- AML (反洗钱) → Douglas — douglas.yap@ant-intl.com
- Sanctions (制裁) → David, employee #418932 — wubaiding.wbd@antgroup.com
- Integrity / ABAC → Xu Ying — xuying.gu@antgroup.com
- Liability limitation clauses being negotiated → Cheng Yew — chengyew.chua@antgroup.com

Privacy & Data:
- Privacy / EMMA / personal data → Sofia (huixin.tan@ant-intl.com) and George (george.ang@ant-intl.com)
- Data Security (数安) → Ashley Chong — ashley.chong@ant-intl.com

Corporate Governance:
- Primary → Suki — suki.ng@antgroup.com
- Backup → Jessica — jessica.lau@antgroup.com

Treasury (财资): Stephanie — stephanie.miao@ant-intl.com

AIMPDP (Mini-Program / Super-App): contract involves mini-program development, distribution, or super-app integration:
- BD — 无身 — wushen.xjh@ant-intl.com
- PD — Yichao 逸超 — yichao.li@ant-intl.com

## Conditional add — by market / entity

Customer Rights (客权) — by market:
- Indonesia (ID), Korea (KR) → Agnes 小妩 — agnes.wxy@ant-intl.com
- Hong Kong (HK) → Tankya 雪岫 — xuexiu.ldj@ant-intl.com
- Malaysia (MY) → Woei Yang — woeiyang.yoon@ant-intl.com
- Philippines (PH) → Carmen — carmen.woo@ant-intl.com
- 新钱包 (New Wallet) → Greyson — cheeheng.lim@ant-intl.com

Mainland China (CN) contracts — trigger: any party is an A&I mainland China entity (ZQ2, Z1J, etc.). Add the entire CN PIC stack IN ADDITION to anything else triggered:
- Legal → Lynn — linlin.ly@ant-intl.com
- 跨境合规 (Cross-border Compliance) → Frank 南尼 — frank.wwc@ant-intl.com
- Privacy → George — george.ang@ant-intl.com
- 消保 (Consumer Protection) → 凉白 — liangbai.zq@antgroup.com
- 客权 (Customer Rights) → 恩瑞 — yuxiaoran.yxr@ant-intl.com
- 客权 (Customer Rights) → 凌霄 Angela — lingxiao.zhao@ant-intl.com

---

# DOCUMENT 2: A&I CONTRACT CENTER HANDBOOK (KEY RULES)

Platform: https://digital-agreement.alipay.com/home

Two contract types: Non-standard (upload reviewed clean copy) and Standard (system-generated from templates).

## Non-standard initiation — two options

Option 1 (shorter, BD initiates from SmartCollab):
1. Legal finalizes executable contract version in SmartCollab.
2. BD clicks "Submit to Ant Intl Contract Center", selects category, fills remaining fields, submits.
3. Approval flow runs (Legal / Finance / Biz approvers receive notifications).

Option 2 (BD uploads at Contract Center):
1. BD goes to initiation page, picks biz line + sub-category, uploads contract, fills details, submits.
2. Legal confirms version and details, finalizes and submits for approval.
3. Approval flow runs.

For multi-entity contracts, include all Ant entities under "Our Company" with counterparty registered name at "Counterparty Legal Name."

## Signing/Sealing — KEY RULES

⚠️ Application must be submitted AFTER full contract approval is completed.

IMPORTANT NOTES:
- Contracts involving A&I mainland China entities (e.g., ZQ2, Z1J) are only effective after being stamped with a company seal.
- Contracts involving overseas entities (e.g., B15, ZAA, Z15, B31) require signing by the authorized signatory of that entity to be effective.
- A&I authorized signatories DO NOT accept any contract signing links sent by external companies (counterparty/merchant/partner). Do not disclose signatories' name, email, or personal details to external companies, including Alibaba.
- For overseas contracts requiring both signing AND sealing, contact 艾希 after internal signing for sealing. Courier hard copy to A&I HK office.
- Do NOT include authorized signatory details for A&I entities in the contract — these may change per Corporate Governance. Contracts with signatory information errors will not be signed.

## Signing methods — Overseas Entities

DocuSign Co-Sign [Highly Recommended 🌟🌟🌟🌟🌟] — all signing parties sign via the same DocuSign envelope sent by A&I.
- Pick signing order (us first or counterparty first).
- Select "Send Docusign envelope to Counterparty" → YES.
- Enter counterparty Authorized Signatory details (get from counterparty).
- Optionally enter Cc. recipients.
- Set signing/Cc order.
- Click "Initiate Electronic Signature." Operations team will configure and send.

DocuSign Not Co-Sign [Recommended 🌟🌟🌟] — A&I signs via our Docusign, counterparty signs via their own method.
- Pick signing order. If we sign first, share signed copy with counterparty. If they sign first, upload their signed copy for our countersign.
- Select "Send Docusign envelope to Counterparty" → NO.

Wet-Ink [Not Recommended] — hardcopy offline signing, both parties on same original.
- ⚠️ Wet-ink signatures on scanned copies are NOT valid. If can't do same hardcopy, use DocuSign instead.
- Signatories' secretaries: Wang Yi 王軼 / Leiming Chen → Cheung Siu Fong Farina (HK Office). Xu Xian 邂智 → Koh Qian Yi (SG Office). Zhou Yi 竹仕 → 咪密 (SG Office).
- For CFM-BANK account opening contracts, contact 鲥鱼 to confirm Authorized Signatory.

Only DocuSign is supported. Other e-signature platforms are not supported.

## Sealing — Mainland CN Entities (ZQ2, Z1J, etc.)

Physical Seal — requires submission of original hardcopy to Ant A Space (Hangzhou):
- Pick signing order. Choose "Physical Seal."
- Confirm seal method: send physical copy yourself, OR have Sealing Support PIC print and seal at A Space.
- Enter number of copies to be sealed.
- Address: Rooms 501 & 502, Building 8, Ant Financial A Space, Hangzhou, Zhejiang, China.
- DingTalk support group: 40970000545.

Electronic Seal — online submission, only when counterparty signs first:
- Choose seal position, click "Start electronic Seal Affixing."
- ⚠️ Electronic seals permitted only for overseas counterparties. Domestic entities must use e-seal with valid CA certificate if required.
- To expedite, contact 喻备.

## Multi-entity rules

- All overseas → same as single overseas process.
- All domestic → only physical sealing supported.
- Mixed cross-border → sign overseas entity first, then seal domestic entity. Domestic entity must be in "Our Company" field at initiation.

## Status definitions

Overseas DocuSign:
- "Application initiated, pending signing task config" — Operations is verifying version and configuring.
- "Signing" — DocuSign sent, awaiting signatures. Note signing order. To expedite, share Contract No. with signatory so they can find the signing link in their email. 🚨 Do NOT send the contract link itself — that's not a signing link.
- "Signed" — done. Download from contract details page.

Wet-Ink: Initiated → Signing → Finished.

Physical Seal: Receive (waiting for hardcopy) → Scan → Compare (version check) → Affix (sealing complete).

Electronic Seal: Initiated → Reviewing → Affixing → Finished.

## Archiving

Overseas DocuSign Co-Sign → auto-archived.
Overseas DocuSign Not Co-Sign, counterparty signs first → auto-archived.
Overseas DocuSign Not Co-Sign, our entity signs first → upload version signed by both parties to contract details page; input counterparty's signing date.
Overseas Wet-Ink → upload all-parties-signed copy to contract details page.
Domestic Electronic Seal → auto-archived.
Domestic Physical, counterparty signs first → auto-archived.
Domestic Physical, our entity signs first → after counterparty signs, send physical copy to Ant A Space 8#501&502 for archiving.

## Other functions

Backdating reporting: https://iic.antgroup-inc.cn/icGateway/detail/7110000 — ID can be linked back to contract submission after approval.

Contract Expiration Management: applies to contracts initiated from August 15, 2025 onwards. Owner gets 60-day expiration reminder; can submit supplementary agreements / terminations / renewals linked to master agreement.

## Support contacts

- A&I Contract Center DingTalk: 44719403
- DocuSign operations: 艾希
- Wet-ink operations: 鹿漆
- Process support: 天宜, 兔丁
- PD: 江鎏

---

# DOCUMENT 3: SMARTCOLLAB USER MANUAL (KEY STEPS)

Platform: https://tongzhouji.antgroup-inc.cn/tongzhouji/homePage
⚠️ Make sure tenant is "Ant_Intl_Biz" before doing anything. Wrong tenant = nothing works.

## Three matter types
- Contract (for contract management)
- Project
- Marketing activities and materials (Space and Requirement Type CANNOT be changed after creation for this type)

## Step-by-step

1. Setup: Switch to Ant_Intl_Biz tenant (top left).
2. Create matter: Homepage → Create matter → enter name, Business Owner, Legal, members, Space (e.g., AtonM & AGH for Antom Growth, A+ Legal Space for Alipay+ core, Remittance Legal Space for global remittance), Requirement Type, brief intro → Create matter. Can also copy a previous matter from homepage. **The Business Owner is the one who creates the matter — not Legal.** Legal joins the matter in the Legal role after creation.
3. Add members: Search by name or employee number. BD MUST add the always-add trio: Wen Jing (wenjing.koh@ant-intl.com), Yue Ting (yueting.tan@ant-intl.com), Lanxin (lx01931595@antgroup.com). Plus Finance — Angel (jingru.liu@ant-intl.com). Plus any conditional adds from the Team SOP based on contract topic and entities/markets. Business Owner & Legal cannot be deleted.
4. Basic Info Card: Click Edit to update if details change.
5. Tags & Checklist: Legal adds tags; each tag pulls a checklist for review. Legal only.
6. Relate Matter: Click Edit → search by matter ID or name to link.
7. Contract Management (Contracts & Projects):
   - Add Contract Card for multiple contracts under one matter
   - Upload Contract for new version of current contract
   - Upload Attachment for attachments
   - Edit online with revision mode; insert comments by selecting text
   - Compare: latest vs old version, highlights changes
   - Finalize: ONLY Legal can do this. Two options — "Finalize in SmartCollab only" OR "Submit to Ant International Contract Center" (the latter triggers official approval flow). Fill in requirement info, click "Finalize and initiate the process." SmartCollab auto-converts Word → PDF; check formatting first.
7b. Material Management (Marketing only): T&C, POSM (images), or Other materials. Legal finalizes the version accepted by all parties.
8. Comments: @mention auto-adds the person as member + sends DingTalk + email. File uploads ≤ 100MB.
9. Suspend (freeze all activity) / Close (end matter): Business Owner or Legal only.
10. Search: by matter name or background keywords. Save filters as named Views for reuse.

## Role permissions on Members

| Action | Business Owner | Legal | Members |
|---|---|---|---|
| Add new member | ✓ | ✓ | ✓ |
| Delete BO | ✗ | ✗ | ✗ |
| Delete Legal | ✗ | ✗ | ✗ |
| Delete other members | ✓ | ✓ | ✓ |
| Transfer | ✓ | ✓ | ✗ |
| Quit | ✗ | ✗ | ✓ |

## Antom Growth specifics
Space: AtonM & AGH. BD must add: Wen Jing, Yue Ting, Lanxin (always-add trio), Angel (Finance), plus any conditional adds from the Team SOP.`;

// ============================================================
// FAQ catalog
// ============================================================

const FAQ_CATEGORIES = [
  {
    key: "start",
    label: "Getting started",
    blurb: "First-time or just need a refresher",
    prompts: [
      "I just got a deal, where do I start?",
      "What's a 'matter' and where do I create one?",
      "What's the difference between SmartCollab and Contract Center?",
      "Do I create the matter, or does Legal?",
    ],
  },
  {
    key: "people",
    label: "Who to loop in",
    blurb: "PICs, always-adds, and conditional members",
    prompts: [
      "Who do I need to add to the matter?",
      "Who's on the always-add list?",
      "Do I need to add Finance? When?",
      "Tax review — when do I need that and who's the PIC?",
      "It's a wallet contract — who handles it?",
      "It's a distributor contract — who's the legal lead?",
      "It involves a mainland China entity (ZQ2) — what changes?",
      "Mini-program / super-app integration — special PICs?",
      "Customer rights PIC for HK / MY / PH / ID?",
      "Privacy / personal data clauses — who reviews?",
      "AML or sanctions concerns — who do I add?",
      "I forgot to add someone — can they be added later?",
    ],
  },
  {
    key: "signing",
    label: "Signing & sealing",
    blurb: "DocuSign, wet-ink, physical seal, electronic seal",
    prompts: [
      "How do I sign the contract?",
      "DocuSign Co-Sign vs Not Co-Sign — which to pick?",
      "Counterparty wants us to sign on their DocuSign — is that ok?",
      "Can we wet-ink sign on a scanned copy?",
      "Mainland CN entity — how does sealing work?",
      "Multi-entity contract (overseas + domestic) — what's the order?",
      "Should I include the signatory's name in the contract?",
      "Do I need a hardcopy if we're signing on DocuSign?",
      "What's an electronic seal and when can I use it?",
      "Wet-ink signing — who's the secretary contact?",
    ],
  },
  {
    key: "status",
    label: "Status & tracking",
    blurb: "Where is my contract and do I need to do anything?",
    prompts: [
      "What's the status of my contract?",
      "What does the 'Signing' status mean? Do I need to do anything?",
      "Counterparty hasn't signed — how do I chase?",
      "What does 'pending signing task config' mean?",
      "What happens after Physical Seal is affixed?",
      "Can I share the signing link with the counterparty directly?",
      "How do I download a fully signed contract?",
    ],
  },
  {
    key: "edge",
    label: "Specific situations",
    blurb: "Edge cases, post-signing, and one-offs",
    prompts: [
      "Multiple Ant entities on one contract — how to set up?",
      "Contract is going to expire — what now?",
      "Can I backdate a contract?",
      "Where do I send the hardcopy for sealing?",
      "Liability cap clause — is this acceptable?",
      "I need to terminate the contract — what's the process?",
      "How do I link a related matter or contract?",
      "Suspending vs closing a matter — what's the difference?",
      "I uploaded the wrong version — can I replace it?",
      "Counterparty's legal name has changed mid-process",
      "Contract was approved but I need to change a clause",
    ],
  },
];

// ============================================================
// Hooks
// ============================================================

function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width, isMobile: width < 640 };
}

// ============================================================
// Main component
// ============================================================

export default function SmartCollabHelper() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [feedback, setFeedback] = useState({});
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const { isMobile } = useViewport();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, streamingText]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const next = Math.min(inputRef.current.scrollHeight, 160);
      inputRef.current.style.height = `${next}px`;
    }
  }, [input]);

  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta"
            ) {
              accumulated += parsed.delta.text;
              setStreamingText(accumulated);
            }
          } catch {
            // ignore
          }
        }
      }

      setMessages([...newMessages, { role: "assistant", content: accumulated }]);
      setStreamingText("");
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the model. Try again in a moment.");
      setStreamingText("");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [input, loading, messages]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setMessages([]);
    setError(null);
    setInput("");
    setStreamingText("");
    setFeedback({});
    setConfirmReset(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleFeedback(idx, kind) {
    setFeedback((prev) => ({
      ...prev,
      [idx]: prev[idx] === kind ? null : kind,
    }));
  }

  const HORIZ_PADDING = isMobile ? 16 : 24;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "780px",
        fontFamily:
          "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
        background: "#fafaf7",
        color: "#1a1a1a",
      }}
    >
      <header
        style={{
          padding: `14px ${HORIZ_PADDING}px`,
          borderBottom: "1px solid #e5e3dd",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8a8678",
              fontWeight: 500,
            }}
          >
            A+Rewards · Internal Pilot
          </div>
          <h1
            style={{
              margin: "2px 0 0 0",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: 600,
              fontFamily:
                "'IBM Plex Serif', Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.01em",
            }}
          >
            SmartCollab Helper
          </h1>
        </div>
        <button
          onClick={handleReset}
          disabled={messages.length === 0 && !error}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px",
            fontSize: "12px",
            color: confirmReset ? "#8a3a2a" : "#5a564a",
            background: confirmReset ? "#fdf2f0" : "transparent",
            border: confirmReset
              ? "1px solid #e9c5bd"
              : "1px solid #d8d5cc",
            borderRadius: "4px",
            cursor: messages.length === 0 ? "default" : "pointer",
            opacity: messages.length === 0 ? 0.4 : 1,
            fontFamily: "inherit",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
          title={confirmReset ? "Click again to confirm" : "Start a new conversation"}
        >
          <RotateCcw size={12} />
          {confirmReset ? "Confirm reset?" : "New chat"}
        </button>
      </header>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: `${HORIZ_PADDING}px`,
        }}
      >
        {messages.length === 0 && (
          <EmptyState
            isMobile={isMobile}
            onPick={(text) => sendMessage(text)}
          />
        )}

        {messages.map((m, i) => (
          <Message
            key={i}
            role={m.role}
            content={m.content}
            isMobile={isMobile}
            showFeedback={m.role === "assistant"}
            feedback={feedback[i]}
            onFeedback={(kind) => handleFeedback(i, kind)}
          />
        ))}

        {loading && streamingText && (
          <Message
            role="assistant"
            content={streamingText}
            isMobile={isMobile}
            isStreaming
            showFeedback={false}
          />
        )}

        {loading && !streamingText && (
          <div
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              padding: "8px 0",
              color: "#8a8678",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PulsingDot />
            Thinking…
          </div>
        )}

        {error && (
          <div
            style={{
              maxWidth: "720px",
              margin: "12px auto",
              padding: "10px 14px",
              background: "#fdf2f0",
              border: "1px solid #e9c5bd",
              borderRadius: "4px",
              color: "#8a3a2a",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #e5e3dd",
          background: "#fff",
          padding: `12px ${HORIZ_PADDING}px`,
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            rows={1}
            style={{
              flex: 1,
              resize: "none",
              padding: "10px 12px",
              fontSize: "14px",
              fontFamily: "inherit",
              border: "1px solid #d8d5cc",
              borderRadius: "4px",
              outline: "none",
              background: "#fff",
              color: "#1a1a1a",
              lineHeight: 1.5,
              minHeight: "40px",
              maxHeight: "160px",
              overflowY: "auto",
            }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              padding: "10px 14px",
              background: !input.trim() || loading ? "#c8c4b8" : "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: !input.trim() || loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontFamily: "inherit",
              fontWeight: 500,
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            aria-label="Send"
          >
            <Send size={14} />
            {!isMobile && "Send"}
          </button>
        </div>
        {!isMobile && (
          <div
            style={{
              maxWidth: "720px",
              margin: "6px auto 0",
              fontSize: "11px",
              color: "#8a8678",
            }}
          >
            Pilot — flag wrong answers to your team owner.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Empty state
// ============================================================

function EmptyState({ isMobile, onPick }) {
  const [activeTab, setActiveTab] = useState(FAQ_CATEGORIES[0].key);
  const tabsRef = useRef(null);

  const active = FAQ_CATEGORIES.find((c) => c.key === activeTab);

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: isMobile ? "12px auto 0" : "20px auto 0",
      }}
    >
      <p
        style={{
          marginTop: 0,
          color: "#5a564a",
          fontSize: "14px",
          lineHeight: 1.6,
          marginBottom: "8px",
        }}
      >
        Ask anything about SmartCollab and the Ant International Contract
        Center — or pick a question below to get started.
      </p>

      <p
        style={{
          marginTop: 0,
          fontSize: "12px",
          color: "#8a8678",
          lineHeight: 1.5,
          marginBottom: "20px",
        }}
      >
        I can't see live system status or specific matters. For that, go to the
        contract details page or DingTalk group 44719403.
      </p>

      {/* Tab bar */}
      <div
        ref={tabsRef}
        style={{
          display: "flex",
          gap: "2px",
          borderBottom: "1px solid #e5e3dd",
          marginBottom: "16px",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = cat.key === activeTab;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              style={{
                padding: isMobile ? "8px 12px" : "10px 14px",
                fontSize: "13px",
                fontFamily: "inherit",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1a1a1a" : "#8a8678",
                background: "transparent",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #1a1a1a"
                  : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#5a564a";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#8a8678";
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active category blurb */}
      <p
        style={{
          fontSize: "12px",
          color: "#8a8678",
          fontStyle: "italic",
          marginTop: 0,
          marginBottom: "12px",
        }}
      >
        {active.blurb}
      </p>

      {/* Prompt cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "8px",
        }}
      >
        {active.prompts.map((p) => (
          <PromptCard key={p} text={p} onClick={() => onPick(p)} compact />
        ))}
      </div>
    </div>
  );
}

function PromptCard({ text, onClick, compact }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        padding: compact ? "8px 12px" : "12px 14px",
        background: hover ? "#f5f3ed" : "#fff",
        border: `1px solid ${hover ? "#1a1a1a" : "#e5e3dd"}`,
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: compact ? "12px" : "13px",
        fontWeight: compact ? 400 : 500,
        color: "#1a1a1a",
        lineHeight: 1.4,
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {text}
    </button>
  );
}

// ============================================================
// Message
// ============================================================

function Message({
  role,
  content,
  isMobile,
  isStreaming,
  showFeedback,
  feedback,
  onFeedback,
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          padding: isMobile ? "10px 12px" : "12px 16px",
          background: isUser ? "#1a1a1a" : "#fff",
          color: isUser ? "#fafaf7" : "#1a1a1a",
          border: isUser ? "none" : "1px solid #e5e3dd",
          borderRadius: "8px",
          fontSize: "14px",
          lineHeight: 1.6,
          maxWidth: isMobile ? "92%" : "85%",
          wordBreak: "break-word",
        }}
      >
        <Markdown content={content} isUser={isUser} />
        {isStreaming && (
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "14px",
              background: "#1a1a1a",
              marginLeft: "2px",
              verticalAlign: "middle",
              animation: "blink 1s infinite",
            }}
          />
        )}
      </div>

      {!isUser && !isStreaming && content && (
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginTop: "4px",
          }}
        >
          <IconButton
            label={copied ? "Copied" : "Copy"}
            icon={copied ? <Check size={12} /> : <Copy size={12} />}
            onClick={handleCopy}
            active={copied}
          />
          {showFeedback && (
            <>
              <IconButton
                label="Helpful"
                icon={<ThumbsUp size={12} />}
                onClick={() => onFeedback("up")}
                active={feedback === "up"}
              />
              <IconButton
                label="Not helpful"
                icon={<ThumbsDown size={12} />}
                onClick={() => onFeedback("down")}
                active={feedback === "down"}
              />
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function IconButton({ label, icon, onClick, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        background: active ? "#f0eee5" : hover ? "#f5f3ed" : "transparent",
        border: "1px solid transparent",
        borderRadius: "4px",
        color: active ? "#1a1a1a" : "#5a564a",
        fontSize: "11px",
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PulsingDot() {
  return (
    <>
      <span
        style={{
          display: "inline-block",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#8a8678",
          animation: "pulse 1.4s infinite",
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ============================================================
// Markdown renderer (focused: bold, italic, code, links, lists)
// ============================================================

function Markdown({ content, isUser }) {
  const blocks = parseBlocks(content);
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} isUser={isUser} first={i === 0} />
      ))}
    </>
  );
}

function Block({ block, isUser, first }) {
  if (block.type === "ul") {
    return (
      <ul
        style={{
          margin: first ? "0" : "8px 0 0 0",
          paddingLeft: "20px",
        }}
      >
        {block.items.map((item, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            <Inline text={item} isUser={isUser} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol
        style={{
          margin: first ? "0" : "8px 0 0 0",
          paddingLeft: "22px",
        }}
      >
        {block.items.map((item, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            <Inline text={item} isUser={isUser} />
          </li>
        ))}
      </ol>
    );
  }
  return (
    <p style={{ margin: first ? "0" : "8px 0 0 0" }}>
      <Inline text={block.text} isUser={isUser} />
    </p>
  );
}

function parseBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let listType = null;

  function flushParagraph() {
    if (paragraphLines.length) {
      blocks.push({ type: "p", text: paragraphLines.join("\n") });
      paragraphLines = [];
    }
  }
  function flushList() {
    if (listItems.length) {
      blocks.push({ type: listType, items: listItems });
      listItems = [];
      listType = null;
    }
  }

  for (const line of lines) {
    const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);

    if (ulMatch) {
      flushParagraph();
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(ulMatch[1]);
    } else if (olMatch) {
      flushParagraph();
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(olMatch[1]);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraphLines.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

function Inline({ text, isUser }) {
  const tokens = tokenizeInline(text);
  const linkColor = isUser ? "#fafaf7" : "#1a1a1a";
  const codeBg = isUser ? "rgba(255,255,255,0.15)" : "#f0eee5";
  const codeColor = isUser ? "#fafaf7" : "#5a3a1a";
  const underlineColor = isUser
    ? "rgba(255,255,255,0.5)"
    : "rgba(26,26,26,0.5)";

  return (
    <>
      {tokens.map((t, i) => {
        switch (t.type) {
          case "bold":
            return (
              <strong key={i} style={{ fontWeight: 600 }}>
                <Inline text={t.text} isUser={isUser} />
              </strong>
            );
          case "italic":
            return (
              <em key={i} style={{ fontStyle: "italic" }}>
                <Inline text={t.text} isUser={isUser} />
              </em>
            );
          case "code":
            return (
              <code
                key={i}
                style={{
                  background: codeBg,
                  color: codeColor,
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontSize: "0.92em",
                  fontFamily:
                    "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
                }}
              >
                {t.text}
              </code>
            );
          case "link":
            return (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: linkColor,
                  textDecoration: "underline",
                  textDecorationColor: underlineColor,
                  textUnderlineOffset: "2px",
                  fontWeight: 500,
                }}
              >
                {t.text}
              </a>
            );
          case "url":
            return (
              <a
                key={i}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: linkColor,
                  textDecoration: "underline",
                  textDecorationColor: underlineColor,
                  textUnderlineOffset: "2px",
                  fontWeight: 500,
                  wordBreak: "break-all",
                }}
              >
                {t.url}
              </a>
            );
          case "email":
            return (
              <a
                key={i}
                href={`mailto:${t.email}`}
                style={{
                  color: linkColor,
                  textDecoration: "underline",
                  textDecorationColor: underlineColor,
                  textUnderlineOffset: "2px",
                  fontWeight: 500,
                }}
              >
                {t.email}
              </a>
            );
          default:
            return <span key={i}>{t.text}</span>;
        }
      })}
    </>
  );
}

function tokenizeInline(text) {
  const tokens = [];
  let i = 0;

  while (i < text.length) {
    // `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        tokens.push({ type: "code", text: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // [text](url)
    if (text[i] === "[") {
      const closeBracket = text.indexOf("]", i + 1);
      if (closeBracket !== -1 && text[closeBracket + 1] === "(") {
        const closeParen = text.indexOf(")", closeBracket + 2);
        if (closeParen !== -1) {
          const linkText = text.slice(i + 1, closeBracket);
          const url = text.slice(closeBracket + 2, closeParen);
          tokens.push({ type: "link", text: linkText, url });
          i = closeParen + 1;
          continue;
        }
      }
    }

    // **bold**
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        tokens.push({ type: "bold", text: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }

    // *italic*
    if (text[i] === "*" && text[i + 1] !== "*" && text[i - 1] !== "*") {
      let end = -1;
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === "*" && text[j + 1] !== "*") {
          end = j;
          break;
        }
      }
      if (end !== -1 && end > i + 1) {
        tokens.push({ type: "italic", text: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // bare URL
    const urlMatch = text.slice(i).match(/^https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]]/);
    if (urlMatch) {
      tokens.push({ type: "url", url: urlMatch[0] });
      i += urlMatch[0].length;
      continue;
    }

    // bare email (only at boundary)
    if (i === 0 || /[\s(>,]/.test(text[i - 1])) {
      const emailMatch = text.slice(i).match(/^[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (emailMatch) {
        tokens.push({ type: "email", email: emailMatch[0] });
        i += emailMatch[0].length;
        continue;
      }
    }

    // plain text — accumulate until next special char
    let plainEnd = i + 1;
    while (plainEnd < text.length) {
      const c = text[plainEnd];
      if (c === "`" || c === "[" || c === "*") break;
      if (text.slice(plainEnd).match(/^https?:\/\//)) break;
      if (
        /[\s(>,]/.test(text[plainEnd - 1]) &&
        text.slice(plainEnd).match(/^[\w.+-]+@[\w-]+\.[\w.-]+/)
      )
        break;
      plainEnd++;
    }
    tokens.push({ type: "text", text: text.slice(i, plainEnd) });
    i = plainEnd;
  }

  return tokens;
}
