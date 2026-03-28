#!/usr/bin/env python3
"""Generate the SOSA™ Whitepaper PDF."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether, Frame, PageTemplate
)
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib import colors

OUTPUT = "/Users/michalshatz/Documents/Claude/opsAgent/sosa-whitepaper.pdf"

# ── Styles ──────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "PaperTitle", parent=styles["Title"],
    fontName="Times-Bold", fontSize=22, leading=28,
    alignment=TA_CENTER, spaceAfter=6, textColor=HexColor("#1E1B4B"),
)
subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles["Normal"],
    fontName="Times-Roman", fontSize=13, leading=18,
    alignment=TA_CENTER, spaceAfter=4, textColor=HexColor("#4F46E5"),
)
author_style = ParagraphStyle(
    "Author", parent=styles["Normal"],
    fontName="Times-Roman", fontSize=11, leading=15,
    alignment=TA_CENTER, spaceAfter=2, textColor=HexColor("#374151"),
)
date_style = ParagraphStyle(
    "Date", parent=styles["Normal"],
    fontName="Times-Italic", fontSize=10, leading=14,
    alignment=TA_CENTER, spaceAfter=20, textColor=HexColor("#6B7280"),
)
abstract_heading = ParagraphStyle(
    "AbsHead", parent=styles["Normal"],
    fontName="Times-Bold", fontSize=11, leading=14,
    alignment=TA_LEFT, spaceAfter=6,
)
abstract_body = ParagraphStyle(
    "AbsBody", parent=styles["Normal"],
    fontName="Times-Italic", fontSize=10, leading=15,
    alignment=TA_JUSTIFY, spaceAfter=6, leftIndent=36, rightIndent=36,
)
keywords_style = ParagraphStyle(
    "Keywords", parent=styles["Normal"],
    fontName="Times-Roman", fontSize=9, leading=13,
    alignment=TA_LEFT, spaceAfter=18, leftIndent=36, rightIndent=36,
)
h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Times-Bold", fontSize=16, leading=20,
    spaceBefore=22, spaceAfter=10, textColor=HexColor("#1E1B4B"),
)
h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Times-Bold", fontSize=13, leading=17,
    spaceBefore=16, spaceAfter=8, textColor=HexColor("#312E81"),
)
body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Times-Roman", fontSize=10.5, leading=15,
    alignment=TA_JUSTIFY, spaceAfter=8,
)
body_indent = ParagraphStyle(
    "BodyIndent", parent=body,
    leftIndent=24, rightIndent=24,
    fontName="Times-Italic", fontSize=10, leading=14,
    spaceAfter=10,
)
formal_style = ParagraphStyle(
    "Formal", parent=body,
    fontName="Times-Italic", fontSize=10, leading=14,
    leftIndent=36, rightIndent=36, spaceAfter=10,
    backColor=HexColor("#F5F3FF"), borderPadding=6,
)
ref_style = ParagraphStyle(
    "Ref", parent=styles["Normal"],
    fontName="Times-Roman", fontSize=9, leading=13,
    alignment=TA_LEFT, spaceAfter=4, leftIndent=24, firstLineIndent=-24,
)

# ── Header / Footer ────────────────────────────────────────────────────
def header_footer(canvas, doc):
    canvas.saveState()
    # Header
    canvas.setFont("Times-Italic", 8)
    canvas.setFillColor(HexColor("#6B7280"))
    canvas.drawString(72, letter[1] - 40, "SOSA\u2122: Supervised Orchestrated Secured Agents")
    canvas.drawRightString(letter[0] - 72, letter[1] - 40, "MSApps Research, 2026")
    canvas.setStrokeColor(HexColor("#D1D5DB"))
    canvas.line(72, letter[1] - 44, letter[0] - 72, letter[1] - 44)
    # Footer
    canvas.line(72, 52, letter[0] - 72, 52)
    canvas.drawString(72, 40, "\u00A9 2026 MSApps Research. All rights reserved.")
    canvas.drawRightString(letter[0] - 72, 40, f"Page {doc.page}")
    canvas.restoreState()


# ── Build Document ─────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT, pagesize=letter,
    topMargin=60, bottomMargin=65, leftMargin=72, rightMargin=72,
)

story = []

# ── Title Block ─────────────────────────────────────────────────────────
story.append(Spacer(1, 40))
story.append(Paragraph("SOSA\u2122", title_style))
story.append(Paragraph("Supervised Orchestrated Secured Agents", subtitle_style))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "A Methodology for Production-Grade Autonomous AI Operations",
    ParagraphStyle("SubSub", parent=subtitle_style, fontSize=11, textColor=HexColor("#6B7280")),
))
story.append(Spacer(1, 20))
story.append(Paragraph("Michal Shatz", author_style))
story.append(Paragraph("MSApps Research", ParagraphStyle("Org", parent=author_style, fontSize=10, textColor=HexColor("#6B7280"))))
story.append(Paragraph("michal@msapps.mobi", ParagraphStyle("Email", parent=author_style, fontSize=9, textColor=HexColor("#4F46E5"))))
story.append(Spacer(1, 6))
story.append(Paragraph("March 2026", date_style))
story.append(Spacer(1, 12))

# ── Horizontal Rule ─────────────────────────────────────────────────────
story.append(Table(
    [[""]],
    colWidths=[doc.width],
    style=TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 1.5, HexColor("#6C3AED")),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ])
))

# ── Abstract ────────────────────────────────────────────────────────────
story.append(Paragraph("Abstract", abstract_heading))
story.append(Paragraph(
    "The rapid proliferation of large language model (LLM)-based agents in enterprise workflows has exposed "
    "a critical gap: the absence of a unifying framework that governs how autonomous agents should be "
    "supervised, coordinated, and constrained in production environments. Existing approaches treat autonomy "
    "and control as opposing forces, resulting in systems that are either too brittle to scale or too opaque "
    "to trust. We propose <b>SOSA\u2122 \u2014 Supervised Orchestrated Secured Agents</b> \u2014 a four-pillar "
    "methodology that reconciles agent autonomy with organizational accountability. SOSA provides a formal "
    "structure for deploying multi-agent systems that operate continuously, adapt to heterogeneous toolchains, "
    "and maintain verifiable compliance with security and governance policies. We present OpsAgent as a "
    "reference implementation of the SOSA framework deployed in production across multiple business verticals, "
    "demonstrating that principled agent governance does not require sacrificing operational velocity.",
    abstract_body
))
story.append(Paragraph(
    "<b>Keywords:</b> AI agents, multi-agent systems, enterprise automation, agent governance, "
    "orchestration, human-in-the-loop, zero-trust security, production AI, LLM operations",
    keywords_style
))

# ── 1. Introduction ─────────────────────────────────────────────────────
story.append(Paragraph("1. Introduction", h1))
story.append(Paragraph(
    "The transition of AI agents from research demonstrations to production deployments represents one of the "
    "most consequential shifts in enterprise technology since the advent of cloud computing. Large language models "
    "(LLMs), equipped with tool-use capabilities and persistent context, now possess the theoretical capacity to "
    "automate complex operational workflows that previously required dedicated human staff: lead qualification, "
    "financial reconciliation, recruitment screening, content production, and cross-platform coordination.",
    body
))
story.append(Paragraph(
    "Yet the vast majority of enterprise agent deployments fail. Industry estimates suggest that fewer than 15% "
    "of AI agent pilot programs survive to sustained production use. The failure modes are predictable and "
    "systematic. The first is <i>under-autonomy</i>: agents configured as elaborate chatbots, requiring human input "
    "at every decision point, producing marginal efficiency gains at high interaction costs. The human operator "
    "becomes a bottleneck, and the promised automation benefits evaporate. The second is <i>over-autonomy</i>: "
    "agents deployed with insufficient guardrails that produce cascading errors, hallucinate business-critical "
    "actions, or silently drift from their intended objectives. A single unguarded financial agent can generate "
    "erroneous invoices for weeks before detection.",
    body
))
story.append(Paragraph(
    "Both failure modes stem from the same root cause: the absence of a structured methodology for calibrating "
    "the supervision-autonomy spectrum. Organizations lack a principled framework for determining which tasks an "
    "agent should handle independently, which require human oversight, and how multiple agents should coordinate "
    "without creating brittle dependencies or security vulnerabilities.",
    body
))
story.append(Paragraph(
    "This paper introduces <b>SOSA\u2122 \u2014 Supervised Orchestrated Secured Agents</b> \u2014 a four-pillar "
    "methodology designed to bridge this gap. SOSA provides formal governance primitives at the framework level, "
    "ensuring that agent autonomy is proportional to demonstrated reliability, action reversibility, and domain "
    "risk tolerance. We further present OpsAgent, a commercial platform that implements the SOSA framework in "
    "production, currently operating across 18+ department types for real businesses.",
    body
))

# ── 2. Related Work ────────────────────────────────────────────────────
story.append(Paragraph("2. Related Work", h1))
story.append(Paragraph("2.1 Multi-Agent Frameworks", h2))
story.append(Paragraph(
    "The emergence of multi-agent architectures has produced several notable frameworks. Microsoft\u2019s AutoGen [1] "
    "introduces conversable agents that coordinate through structured dialogue patterns. CrewAI [2] emphasizes "
    "role-based agent design with sequential and hierarchical task delegation. LangGraph [3] provides a stateful, "
    "graph-based orchestration layer built atop LangChain. Each framework addresses coordination mechanics but "
    "treats supervision, security, and governance as application-level concerns rather than framework-level "
    "primitives. SOSA integrates these dimensions into the core architecture.",
    body
))
story.append(Paragraph("2.2 Reasoning and Execution Patterns", h2))
story.append(Paragraph(
    "The ReAct paradigm [4] demonstrated that interleaving reasoning traces with tool-use actions significantly "
    "improves agent reliability. Plan-and-Execute architectures [5] separate high-level planning from step-wise "
    "execution, enabling more robust error recovery. Reflexion [6] introduced self-reflective agents that learn "
    "from execution failures. SOSA\u2019s Plan-Act-Verify loop extends these patterns by adding an explicit "
    "verification phase with organizational feedback loops and a formal trust gradient.",
    body
))
story.append(Paragraph("2.3 Enterprise AI Governance", h2))
story.append(Paragraph(
    "The NIST AI Risk Management Framework [7] provides comprehensive guidelines for AI system governance but "
    "does not address the specific challenges of autonomous agent deployments. The EU AI Act [8] establishes "
    "risk-based classification for AI systems, with high-risk categories requiring human oversight and "
    "transparency\u2014principles that SOSA operationalizes through its Supervised and Secured pillars. ISO/IEC "
    "42001 [9] defines requirements for AI management systems but remains abstract regarding multi-agent "
    "coordination. SOSA translates these regulatory intentions into concrete architectural patterns.",
    body
))
story.append(Paragraph("2.4 Trust and Safety Frameworks", h2))
story.append(Paragraph(
    "Capability-based security [10] provides a theoretical foundation for fine-grained access control that SOSA "
    "adopts for agent permission management. The principle of least privilege, when applied to AI agents, demands "
    "that each agent possesses only the credentials and tool access necessary for its defined role\u2014a "
    "requirement that most existing frameworks honor in documentation but not in enforcement. Zero-trust "
    "architecture principles [11] inform SOSA\u2019s inter-agent communication model, where every message "
    "requires mutual attestation regardless of network topology.",
    body
))

# ── 3. The SOSA Framework ─────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("3. The SOSA\u2122 Framework", h1))
story.append(Paragraph(
    "SOSA defines four interdependent pillars that collectively govern agent behavior in production environments. "
    "No single pillar is sufficient in isolation; it is their integration that produces systems capable of "
    "sustained autonomous operation under enterprise constraints.",
    body
))

# 3.1
story.append(Paragraph("3.1 Supervised", h2))
story.append(Paragraph(
    "Every agent in a SOSA-compliant system operates under a defined supervision policy. Human-in-the-loop "
    "checkpoints are not optional add-ons\u2014they are first-class architectural primitives. Supervision is "
    "graduated: routine, low-impact tasks execute autonomously, while high-stakes actions require explicit "
    "human approval or are bounded by pre-authorized decision envelopes.",
    body
))
story.append(Paragraph(
    "The supervision model is governed by an impact scoring function. Each agent action <i>a</i> is assigned an "
    "impact score <i>I(a)</i> computed from factors including financial magnitude, external visibility, "
    "reversibility, and regulatory sensitivity. The organization defines a risk threshold <i>\u03b8</i>. Actions "
    "where <i>I(a) \u2264 \u03b8</i> execute autonomously. Actions where <i>I(a) > \u03b8</i> are gated on "
    "supervisor approval <i>S(a) = 1</i>.",
    body
))
story.append(Paragraph(
    "<i>Formally: for any agent action a with impact score I(a) > \u03b8, execution is gated on supervisor "
    "approval S(a) = 1, where \u03b8 is a configurable organizational risk threshold.</i>",
    formal_style
))
story.append(Paragraph(
    "Critically, the threshold \u03b8 is not static. SOSA implements a trust gradient that adjusts based on "
    "observed agent performance. Agents that consistently produce correct outcomes for actions near the threshold "
    "boundary earn expanded autonomy. Agents that exhibit failure patterns are automatically escalated to tighter "
    "supervision. This creates an adaptive system where trust is earned through verifiable behavior, not assumed "
    "through configuration.",
    body
))

# 3.2
story.append(Paragraph("3.2 Orchestrated", h2))
story.append(Paragraph(
    "Isolated agents produce isolated outcomes. In any non-trivial operational environment, agents must coordinate "
    "across temporal, informational, and toolchain dimensions. SOSA mandates an orchestration layer that manages "
    "this coordination explicitly rather than relying on ad-hoc inter-agent messaging.",
    body
))
story.append(Paragraph(
    "The orchestrator maintains a directed acyclic graph (DAG) <i>G = (V, E)</i> where vertices represent agent "
    "tasks and edges encode data dependencies and temporal constraints. This structure ensures conflict-free "
    "concurrent execution: agents that share no data dependencies execute in parallel, while dependent tasks "
    "respect ordering constraints. The DAG is constructed from business-logic specifications, not inferred from "
    "runtime behavior, ensuring deterministic scheduling under normal operating conditions.",
    body
))
story.append(Paragraph(
    "<i>The orchestrator maintains a directed acyclic graph G = (V, E) where vertices represent agent tasks and "
    "edges encode data dependencies and temporal constraints, ensuring conflict-free concurrent execution.</i>",
    formal_style
))
story.append(Paragraph(
    "Context sharing between agents is mediated through structured registries rather than direct message passing. "
    "When a lead-qualification agent determines that a prospect is high-priority, it writes a structured context "
    "record to the shared registry. The outreach agent reads this record on its next execution cycle. This "
    "decoupled architecture prevents cascading failures: if the outreach agent fails, the qualification context "
    "remains intact and available for retry.",
    body
))

# 3.3
story.append(Paragraph("3.3 Secured", h2))
story.append(Paragraph(
    "Security in SOSA is not a perimeter\u2014it is a property of every layer. Each agent runs in an isolated "
    "execution environment with scoped credentials, zero-trust network boundaries, and cryptographically "
    "verifiable audit trails. No agent can access resources beyond its declared permission set, and all "
    "inter-agent communication passes through authenticated channels.",
    body
))
story.append(Paragraph(
    "Each agent <i>A<sub>i</sub></i> is assigned a capability set <i>C<sub>i</sub> \u2286 C</i> enforced at "
    "runtime by the security layer. Capabilities are not inherited from the orchestrator or from peer agents; "
    "they are explicitly declared in the agent\u2019s manifest and verified before every tool invocation. "
    "Cross-agent communication requires mutual attestation: a message <i>msg(A<sub>i</sub>, A<sub>j</sub>)</i> "
    "is valid if and only if <i>auth(A<sub>i</sub>) \u2227 auth(A<sub>j</sub>) = true</i>.",
    body
))
story.append(Paragraph(
    "<i>Each agent A<sub>i</sub> is assigned a capability set C<sub>i</sub> \u2286 C enforced at runtime. "
    "Cross-agent communication requires mutual attestation: msg(A<sub>i</sub>, A<sub>j</sub>) is valid iff "
    "auth(A<sub>i</sub>) \u2227 auth(A<sub>j</sub>) = true.</i>",
    formal_style
))
story.append(Paragraph(
    "Every action taken by every agent is logged to an immutable audit store. The audit trail includes the "
    "action type, timestamp, input parameters, output results, the agent\u2019s identity, and the authorization "
    "chain that permitted the action. This provides complete forensic traceability\u2014a requirement for "
    "regulatory compliance in financial services, healthcare, and government sectors.",
    body
))

# 3.4
story.append(Paragraph("3.4 Agents", h2))
story.append(Paragraph(
    "SOSA agents are not scripts with LLM wrappers. They are goal-directed autonomous entities with persistent "
    "context, tool-use capabilities, and adaptive planning. Each agent possesses a defined role ontology, "
    "success metrics, and failure recovery strategies\u2014enabling them to operate as reliable participants "
    "in a larger organizational system.",
    body
))
story.append(Paragraph(
    "An agent in SOSA is formally defined as a tuple <i>A = (R, T, M, P)</i> where <i>R</i> is the role "
    "specification (defining the agent\u2019s domain, objectives, and constraints), <i>T</i> is the tool manifest "
    "(the set of external APIs, databases, and communication channels the agent is authorized to invoke), "
    "<i>M</i> is the memory and context store (providing persistence across execution cycles), and <i>P</i> is "
    "the planning policy (governing how the agent selects actions given its current state and objectives).",
    body
))
story.append(Paragraph(
    "<i>An agent is a tuple A = (R, T, M, P) where R is the role specification, T is the tool manifest, "
    "M is the memory/context store, and P is the planning policy governing action selection.</i>",
    formal_style
))
story.append(Paragraph(
    "The role specification R is particularly consequential. Unlike generic agents that rely on prompt engineering "
    "to constrain behavior, SOSA agents have their domain boundaries, success criteria, and escalation triggers "
    "encoded in structured specifications that are enforced by the runtime, not merely suggested to the LLM. "
    "A financial reconciliation agent cannot be prompt-injected into sending emails\u2014its tool manifest "
    "does not include email capabilities, and the security layer enforces this constraint at the API level.",
    body
))

# ── 4. The SOSA Execution Model ────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("4. The SOSA Execution Model", h1))
story.append(Paragraph(
    "In a SOSA-compliant system, agent execution follows a three-phase loop: <b>Plan</b>, <b>Act</b>, and "
    "<b>Verify</b>. This loop operates at two timescales: the individual task level (seconds to minutes) and the "
    "organizational learning level (days to weeks).",
    body
))
story.append(Paragraph("4.1 Plan", h2))
story.append(Paragraph(
    "During the planning phase, the agent decomposes its current objective into a sequence of tool calls and "
    "information retrievals, subject to the constraints in its capability set C<sub>i</sub>. The planning policy "
    "P evaluates available actions against the agent\u2019s role specification R, filtering out any actions that "
    "would violate domain boundaries or exceed the agent\u2019s authorization scope. The resulting plan is a "
    "partially ordered set of operations with explicit preconditions and expected postconditions.",
    body
))
story.append(Paragraph("4.2 Act", h2))
story.append(Paragraph(
    "During the action phase, each planned step is executed against real external systems\u2014APIs, databases, "
    "communication platforms, file systems\u2014with every interaction logged to the immutable audit store. "
    "Actions that exceed the impact threshold \u03b8 are paused and escalated to the appropriate supervisor. "
    "The orchestration layer monitors action execution for timeouts, errors, and unexpected state changes, "
    "triggering the agent\u2019s failure recovery strategy when anomalies are detected.",
    body
))
story.append(Paragraph("4.3 Verify", h2))
story.append(Paragraph(
    "During the verification phase, the orchestrator evaluates the outcome against declared success criteria "
    "defined in the agent\u2019s role specification. Verification is not merely a boolean pass/fail check; it "
    "produces a structured evaluation record that feeds into the trust gradient. Agents that consistently meet "
    "their success criteria earn expanded autonomy boundaries. Agents that exhibit failure patterns are "
    "automatically escalated to tighter supervision policies.",
    body
))
story.append(Paragraph(
    "This creates a continuous improvement mechanism: the system\u2019s governance posture adapts to observed "
    "agent reliability rather than relying on static, manually configured trust levels. Over time, well-performing "
    "agents require less human intervention, while unreliable agents receive proportionally more oversight\u2014"
    "precisely the adaptive trust model that static rule-based systems cannot achieve.",
    body
))

# ── 5. Reference Implementation ────────────────────────────────────────
story.append(Paragraph("5. Reference Implementation: OpsAgent", h1))
story.append(Paragraph(
    "OpsAgent is the first commercial implementation of the SOSA framework. Every architectural decision\u2014"
    "from isolated virtual machine environments to the orchestration scheduler to the human-approval gates\u2014"
    "maps directly to a SOSA pillar. OpsAgent has been operating in production since early 2025, initially "
    "deployed to run the entire operations of MSApps, a technology company, before being offered as a service "
    "to external clients.",
    body
))
story.append(Paragraph("5.1 Architecture", h2))
story.append(Paragraph(
    "<b>Supervised:</b> OpsAgent implements configurable approval workflows per agent type. A daily briefing "
    "system surfaces all actions taken by all agents to the human operator. High-impact operations\u2014financial "
    "transactions above a configurable threshold, external communications to new contacts, contract modifications"
    "\u2014require explicit human sign-off before execution. The impact threshold is adjustable per client and "
    "per department.",
    body
))
story.append(Paragraph(
    "<b>Orchestrated:</b> A centralized scheduler coordinates 18+ agent types across temporal and data "
    "dependencies. Agents share context through structured registries, not ad-hoc message passing. The scheduler "
    "supports both time-triggered execution (daily financial reconciliation, weekly content calendars) and "
    "event-triggered execution (new lead received, invoice submitted for matching).",
    body
))
story.append(Paragraph(
    "<b>Secured:</b> Each client environment runs on an isolated virtual machine with scoped OAuth credentials. "
    "Zero business data is stored on OpsAgent servers\u2014agents process data in transit and write results "
    "directly to the client\u2019s existing systems. Every action is logged to an immutable audit trail accessible "
    "to the client through the OpsAgent dashboard.",
    body
))
story.append(Paragraph(
    "<b>Agents:</b> OpsAgent agents are goal-directed entities with persistent memory, real tool access "
    "(calendars, CRMs, accounting systems, communication platforms), and adaptive planning. Each agent is "
    "defined by a structured role specification, not a prompt template. This ensures behavioral consistency "
    "across LLM model updates and prevents prompt injection from altering agent behavior.",
    body
))
story.append(Paragraph("5.2 Production Metrics", h2))
story.append(Paragraph(
    "OpsAgent\u2019s production deployment demonstrates the viability of the SOSA methodology under real "
    "operational conditions. The system automates 18 department types including lead management, sales outreach, "
    "recruiting, financial reconciliation, content production, and customer support. The platform operates 24/7 "
    "with a gross margin of 96%, reflecting the cost efficiency of AI-driven operations compared to traditional "
    "staffing models. New client deployments are completed in days rather than months, enabled by the modular "
    "architecture of SOSA-compliant agents.",
    body
))

# ── 6. Implications ────────────────────────────────────────────────────
story.append(Paragraph("6. Implications for Enterprise Adoption", h1))
story.append(Paragraph(
    "The SOSA methodology directly addresses the three primary barriers to enterprise AI agent adoption.",
    body
))
story.append(Paragraph(
    "<b>Accountability.</b> By requiring full audit trails and graduated supervision, SOSA satisfies regulatory "
    "and internal governance requirements. Every agent action is traceable to a specific authorization chain. "
    "When an agent makes an error, the audit trail identifies exactly what happened, when, and why\u2014enabling "
    "rapid remediation rather than opaque debugging. This accountability structure aligns with the requirements "
    "of NIST AI RMF, EU AI Act high-risk provisions, and SOC 2 compliance frameworks.",
    body
))
story.append(Paragraph(
    "<b>Reliability.</b> By mandating orchestration and structured inter-agent context sharing, SOSA eliminates "
    "the coordination failures that plague multi-agent deployments. The DAG-based scheduling ensures that agents "
    "respect data dependencies. The structured registry model prevents cascading failures. The Plan-Act-Verify "
    "loop with its trust gradient ensures that unreliable agents are automatically constrained before they can "
    "cause organizational damage.",
    body
))
story.append(Paragraph(
    "<b>Compliance.</b> By treating security as a first-class design constraint rather than an afterthought, "
    "SOSA enables deployment in environments where data sensitivity precludes the use of conventional SaaS-based "
    "AI solutions. The zero-trust architecture, scoped credentials, and data-in-transit processing model mean "
    "that client data never resides on third-party servers\u2014a requirement for financial services, healthcare, "
    "legal, and government clients.",
    body
))
story.append(Paragraph(
    "These properties collectively justify premium positioning. Organizations adopting SOSA-compliant platforms "
    "are not purchasing a chatbot or an automation script; they are deploying a governed, auditable, enterprise-"
    "grade AI operations layer. The methodology\u2019s rigor is precisely what enables the trust required for "
    "mission-critical deployments.",
    body
))

# ── 7. Conclusion ──────────────────────────────────────────────────────
story.append(Paragraph("7. Conclusion", h1))
story.append(Paragraph(
    "SOSA represents a necessary evolution from ad-hoc AI agent deployment to principled, production-grade "
    "AI operations. By integrating supervision, orchestration, security, and agent design into a unified "
    "methodology, SOSA provides organizations with a framework that scales from initial pilot to full "
    "operational deployment without sacrificing governance or accountability.",
    body
))
story.append(Paragraph(
    "The OpsAgent reference implementation demonstrates that SOSA is not merely theoretical: it operates in "
    "production today, automating real business operations with measurable outcomes. Organizations adopting "
    "SOSA can expect to deploy AI agents that are not merely impressive in demos, but durable in production\u2014"
    "systems that earn trust through verifiable behavior rather than demanding it through marketing claims.",
    body
))
story.append(Paragraph(
    "Future work includes formal verification of agent supervision policies using model-checking techniques, "
    "development of cross-organizational SOSA compliance certification standards, and extension of the trust "
    "gradient model to incorporate multi-stakeholder approval chains for regulated industries.",
    body
))

# ── References ─────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("References", h1))
refs = [
    "[1] Wu, Q., et al. \"AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation.\" arXiv:2308.08155, 2023.",
    "[2] Moura, J. \"CrewAI: Framework for Orchestrating Role-Playing Autonomous AI Agents.\" Open-source framework, GitHub, 2024.",
    "[3] LangChain. \"LangGraph: Build Stateful, Multi-Agent Applications with LLMs.\" Open-source framework documentation, 2024.",
    "[4] Yao, S., et al. \"ReAct: Synergizing Reasoning and Acting in Language Models.\" ICLR, 2023.",
    "[5] Wang, L., et al. \"Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning.\" ACL, 2023.",
    "[6] Shinn, N., et al. \"Reflexion: Language Agents with Verbal Reinforcement Learning.\" NeurIPS, 2023.",
    "[7] National Institute of Standards and Technology. \"AI Risk Management Framework (AI RMF 1.0).\" NIST, January 2023.",
    "[8] European Parliament. \"Regulation (EU) 2024/1689 Laying Down Harmonised Rules on Artificial Intelligence (AI Act).\" Official Journal of the European Union, 2024.",
    "[9] ISO/IEC 42001:2023. \"Information Technology \u2014 Artificial Intelligence \u2014 Management System.\" International Organization for Standardization, 2023.",
    "[10] Dennis, J.B. and Van Horn, E.C. \"Programming Semantics for Multiprogrammed Computations.\" Communications of the ACM, 9(3), 1966.",
    "[11] Rose, S., et al. \"Zero Trust Architecture.\" NIST Special Publication 800-207, August 2020.",
    "[12] Wei, J., et al. \"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.\" NeurIPS, 2022.",
    "[13] Schick, T., et al. \"Toolformer: Language Models Can Teach Themselves to Use Tools.\" NeurIPS, 2023.",
    "[14] Park, J.S., et al. \"Generative Agents: Interactive Simulacra of Human Behavior.\" UIST, 2023.",
    "[15] Bai, Y., et al. \"Constitutional AI: Harmlessness from AI Feedback.\" arXiv:2212.08073, 2022.",
]
for r in refs:
    story.append(Paragraph(r, ref_style))

# ── Build ──────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(f"PDF created: {OUTPUT}")
