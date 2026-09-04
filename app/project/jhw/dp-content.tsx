"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const C = {
    gold: "#B8986A",
    goldLight: "#F5EFE3",
    goldPale: "#E8D9BD",
    ink: "#1C1C1A",
    inkMid: "#4A4A46",
    inkMuted: "#888880",
    rule: "#E5E5E5",
    surface: "#F8F8F8",
    white: "#FFFFFF",
    phase1: "#2D4A3E",
    phase2: "#1E3A5F",
    gate: "#5C3D1E",
    green: "#3DBE7A",
    red: "#E74C3C",
}

const CALLS = [
    {
        id: "c1", num: "01", phase: 1, week: "Intro Call",
        title: "Getting to know each other",
        purpose: "This is the first conversation of your Blend journey. It's about getting to know each other — your vision, your lifestyle, and what this home needs to do for you. No design work happens before this call.",
        discuss: [
            "Introductions — meet your Project Manager, Designer, and the full Blend team",
            "A walkthrough of the Blend process and what to expect at each stage",
            "Any floor plans or homes you've seen that you love — and what doesn't work for you",
            "How you'll actually live in this home — daily rhythms, hosting, working from home, family",
            "How each room should feel when you walk into it — light, space, connection to the outdoors",
            "How you want to connect with the outside — covered areas, views, privacy, gardens",
            "What matters most to you: storage, accessibility, sustainability, technology",
            "Homes and styles that inspire you — materials, aesthetics, images you've collected",
            "Your budget — confirming the number and understanding where flexibility exists",
            "How you like to communicate and make decisions as a team",
            "Walkthrough of how Blend finds/vets potential builders",
            "Site visit plans, meeting potential builders on site",
            "Request or review any client provided documents",
            "Book Intro to Jobtread Call",
        ],
        after: [
            "Blend sends the Lookbook link and a summary of key notes from the call",
            "Your Project Manager books the property survey",
            "A site visit is scheduled to take place before Call 3",
            "Initial Bylaw and development review",
            "Execute floor plan options, drawn from your vision and priorities",
            "A Blend site visit will be scheduled ASAP",
            "Engage survey and request an estimate for the scope of work",
            "Send clients the estimate for the survey costs and approve within JobTread",
        ],
    },
    {
        id: "c2", num: "02", phase: 1, week: "Call 1",
        title: "Exploring your floor plan",
        purpose: "This is where the design starts to take shape. Blend presents initial floor plan options based on what you shared in Call 1.",
        discuss: [
            "Your first look at floor plan options, drawn from your vision and priorities",
            "How the building sits on your land — orientation, form, and relationship to the site",
            "Where windows and doors go — capturing views, daylight, airflow, and privacy",
            "Ceiling heights, roof form, overhangs, and how the structure feels inside",
            "How the home connects to the outdoors — decks, patios, covered entries",
            "Garage, carport, or any accessory structures you need",
            "Your honest feedback — what's working, what needs to change",
            "Client invoicing and payment process",
            "Current cost to date review",
        ],
        after: [
            "Bylaw and development review and insights learned",
            "Establish development process based on requirements",
            "Edit and update preliminary plans based upon client feedback",
            "Obtain and review survey documents",
            "Build Design and Planning Schedule within JobTread",
        ],
    },
    {
        id: "c3", num: "03", phase: 1, week: "Call 2 — After Site Visit & Survey",
        title: "Understanding your land",
        purpose: "This call is grounded in what the team learned from visiting and surveying your property.",
        discuss: [
            "A review of your survey, title, and zoning documents",
            "What the site visit revealed — sun, wind, views, access points, and slope",
            "Setbacks, lot coverage, height limits, and any covenants or restrictions that apply",
            "Neighbouring properties, privacy considerations, and any noise factors",
            "Where utilities connect — water, sewer, power, gas",
            "Any site conditions to plan around — drainage, slope stability, fill areas",
            "How the site findings shape or refine the floor plan direction",
            "What specialist consultants will be needed and why",
        ],
        after: [
            "Complete Site plan",
            "Complete preliminary plans to the level of foundation design complete and window and door schedule",
            "Confirm development process",
            "Update plans from any client feedback",
            "Schedule a site meeting with any trades or consultants",
            "Current cost to date review",
        ],
    },
    {
        id: "c4", num: "04", phase: 1, week: "Call 3",
        title: "Reviewing the refined design",
        purpose: "The design has been refined to reflect your feedback and what we've learned about the site.",
        discuss: [
            "The refined floor plans, incorporating your feedback from Calls 2 and 3",
            "Exterior elevations — all four sides of your home",
            "The site plan showing exactly where the building sits on your land",
            "Foundation and mechanical approach — crawl space, slab, HVAC direction",
            "Your priorities and any items that have cost implications",
            "Window and door placement and schedule",
            "3D massing visuals where available",
            "A shared decision: are we ready to move to the estimate?",
            "Current cost to date review",
        ],
        after: [
            "Build out the feasibility estimate",
            "Build complete development schedule",
            "Any final design and plan edits to the preliminary plans",
            "Send out construction document to obtain consultant proposals",
        ],
    },
    {
        id: "c5", num: "05", phase: 1, week: "Call 4",
        title: "The feasibility estimate & the decision to proceed",
        purpose: "This is the first major milestone in your journey. Blend presents the feasibility estimate alongside the consultant proposals.",
        discuss: [
            "A final review and sign-off on the design — floor plans, elevations, site plan",
            "Walking through the Class D feasibility estimate together, line by line",
            "What's included in the estimate, what assumptions have been made, and what isn't priced yet",
            "Consultant proposals for your review",
            "An honest conversation about budget direction before committing to Phase 2",
            "A shared decision: does this feel right to move forward?",
        ],
        after: [
            "Prep and sign pre-construction agreement",
            "Approved consultant proposals through JobTread",
        ],
    },
    {
        id: "c6", num: "06", phase: 2, week: "Call 5",
        title: "Choosing your finishes",
        purpose: "Phase 2 is where your home comes to life in detail. This call focuses on the surfaces — the materials and finishes that will define how your home looks and feels day to day.",
        discuss: [
            "A review of your Lookbook responses together before diving in",
            "Flooring throughout — hardwood, tile, concrete, LVP",
            "Interior wall finishes — paint colours, texture, accent surfaces",
            "Ceiling conditions — flat, exposed structure, bulkhead locations and heights",
            "Washroom tile — floors, walls, shower niches, and layout",
            "Exterior cladding — material, profile, finish",
            "Any special conditions — fireplace surrounds, feature walls, or unique finishes",
            "Obtain signed pre-construction agreement",
        ],
        after: [
            "Execute Authorization to submit development and building permits",
            "Begin interior design elevation and spec sheets",
            "Prep development permitting documents",
        ],
    },
    {
        id: "c7", num: "07", phase: 2, week: "Call 6",
        title: "Fixtures, fittings & appliances",
        purpose: "This call is about the details that make a home feel considered — the fixtures, hardware, millwork, and appliances you'll interact with every single day.",
        discuss: [
            "Millwork and cabinetry — style, finish, hardware, and door profiles",
            "Countertops — material, edge profile, and thickness",
            "Plumbing fixtures — faucets, sinks, showers, bathtubs, and toilets",
            "Washroom accessories — towel bars, hooks, paper holders, and mirrors",
            "Door and millwork hardware — knobs, levers, and hinges",
            "Appliances — make, model, and configuration for kitchen and laundry",
            "Lighting fixtures — type, finish, and placement confirmed against the electrical plan",
        ],
        after: [
            "Continuation of the interior design elevation and spec sheets",
            "Begin receiving and reviewing consultant reports and documentation",
            "Prep documentation for development permit submission",
        ],
    },
    {
        id: "c8", num: "08", phase: 2, week: "Call 7",
        title: "The permit path & site preparation",
        purpose: "This call walks you through what happens between the design being complete and construction beginning.",
        discuss: [
            "A review of the permit-ready drawing package",
            "How the permit process works — expected timeline, inspections, and local requirements",
            "Site preparation scope — excavation, foundation, underground services, and grading",
            "Where your consultants are in their work",
            "The permit submission timeline",
            "Submit Development Permit application",
        ],
        after: ["Continuation of the interior design elevation and spec sheets"],
    },
    {
        id: "c9", num: "09", phase: 2, week: "Call 8",
        title: "Interior design sign-off",
        purpose: "This call is about reviewing and approving the full interior design package before the drawings are locked for permit submission.",
        discuss: [
            "A walkthrough of the interior design and millwork drawings",
            "The electrical plan — outlet locations, panel, and any special circuits",
            "Lighting layout — fixture placement, switching zones, and dimming",
            "Any outstanding finish or fixture selections to confirm",
            "A shared sign-off: the interior design package is complete and approved",
        ],
        after: ["Building Permit documentation prep"],
    },
    {
        id: "c10", num: "10", phase: 2, week: "Call 9",
        title: "Walking through the agreement",
        purpose: "Before you're asked to sign anything, Blend walks you through the key terms of the Construction Agreement together.",
        discuss: [
            "The key terms of the agreement — scope of work, payment schedule, change order process, timeline, and holdback",
            "Any questions you have before the agreement is issued for signature",
            "What authorizes Blend to proceed and what triggers each payment milestone",
            "A reminder that independent legal advice is available to you if you'd like it",
        ],
        after: ["Final consultant document review, follow up on RFIs"],
    },
    {
        id: "c11", num: "11", phase: 2, week: "Call 10",
        title: "Permit submitted — where things stand",
        purpose: "The permit has been submitted. This call keeps you informed on where the process stands.",
        discuss: [
            "Confirmation that the permit package has been submitted to the municipality",
            "What to expect from the permit review process and timeline",
            "Where the budget stands relative to the feasibility estimate",
            "Consultant document status",
            "What Blend is doing right now — tender packages are being prepared",
        ],
        after: ["Continued prep of the Building Permit Package"],
    },
    {
        id: "c12", num: "12", phase: 2, week: "Call 11",
        title: "A conversation with Simon",
        purpose: "Before the final estimate is presented, Simon connects directly with you.",
        discuss: [
            "How has the process felt so far — what's worked well, and is there anything you'd like to share",
            "How you're feeling about the design and the Blend team",
            "What would make you feel completely confident heading into construction",
            "Anything on your mind that hasn't come up yet",
        ],
        after: [
            "Develop comprehensive tender packages and detailed scopes of work for all trade partners",
            "Identify, engage, and prequalify subcontractors",
        ],
    },
    {
        id: "c13", num: "13", phase: 2, week: "Call 12",
        title: "The detailed estimate & the decision to build",
        purpose: "This is the final milestone of Phase 2. Blend presents the detailed construction estimate, and together you decide whether to proceed to construction.",
        discuss: [
            "Walking through the full estimate together — every trade scope, material, and contingency",
            "How the pricing was developed",
            "Value engineering options, if any adjustments are needed",
            "Confirming the permit drawing set is submitted or ready to go",
            "A shared decision: if you're ready to proceed, the Construction Agreement is issued",
            "Submit Building Permits",
        ],
        after: [
            "Issue tender packages to selected subcontractors",
            "Review, evaluate, and compare quotations",
            "Prepare the detailed construction estimate",
            "Prepare and execute the construction agreement",
            "Obtain final client approval of the plans, specifications, and selections",
        ],
    },
]

const TIMELINE = [
    { type: "call", id: "c1", label: "01", phase: 1 },
    { type: "call", id: "c2", label: "02", phase: 1 },
    { type: "call", id: "c3", label: "03", phase: 1 },
    { type: "call", id: "c4", label: "04", phase: 1 },
    { type: "call", id: "c5", label: "05", phase: 1 },
    { type: "gate", id: "g1", label: "G1", phase: 1 },
    { type: "call", id: "c6", label: "06", phase: 2 },
    { type: "call", id: "c7", label: "07", phase: 2 },
    { type: "call", id: "c8", label: "08", phase: 2 },
    { type: "call", id: "c9", label: "09", phase: 2 },
    { type: "call", id: "c10", label: "10", phase: 2 },
    { type: "call", id: "c11", label: "11", phase: 2 },
    { type: "call", id: "c12", label: "12", phase: 2 },
    { type: "call", id: "c13", label: "13", phase: 2 },
    { type: "gate", id: "g2", label: "G2", phase: 2 },
]

function JourneyTimeline({ checked }: { checked: Record<string, boolean> }) {
    const isCallComplete = (callId: string) => {
        const call = CALLS.find((c) => c.id === callId)
        if (!call) return false
        const total = call.discuss.length + call.after.length
        if (total === 0) return false
        const done =
            call.discuss.filter((_, i) => checked[`${callId}-discuss-${i}`]).length +
            call.after.filter((_, i) => checked[`${callId}-after-${i}`]).length
        return done === total
    }
    const phase1Calls = ["c1", "c2", "c3", "c4", "c5"]
    const allCalls = CALLS.map((c) => c.id)
    const g1Complete = phase1Calls.every(isCallComplete)
    const g2Complete = allCalls.every(isCallComplete)
    const isComplete = (marker: typeof TIMELINE[0]) => {
        if (marker.type === "call") return isCallComplete(marker.id)
        if (marker.id === "g1") return g1Complete
        if (marker.id === "g2") return g2Complete
        return false
    }
    const currentIdx = TIMELINE.findIndex((m) => !isComplete(m))

    return (
        <div style={{ marginBottom: 24, padding: "18px 20px", background: C.white, border: `1px solid ${C.rule}`, borderRadius: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 14 }}>Your Journey</div>
            <div style={{ position: "relative" as const, paddingBottom: 24 }}>
                <div style={{ position: "absolute" as const, top: 10, left: 0, right: 0, height: 2, background: C.rule, borderRadius: 1 }} />
                <div style={{ position: "absolute" as const, top: 10, left: 0, height: 2, borderRadius: 1, background: C.gold, transition: "width 0.5s ease", width: currentIdx <= 0 ? "0%" : currentIdx >= TIMELINE.length ? "100%" : `${(currentIdx / (TIMELINE.length - 1)) * 100}%` }} />
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" as const }}>
                    {TIMELINE.map((marker, idx) => {
                        const complete = isComplete(marker)
                        const isCurrent = idx === currentIdx
                        const isGate = marker.type === "gate"
                        const tickColor = complete ? C.gold : isCurrent ? C.inkMid : C.rule
                        const labelColor = complete ? C.gold : isCurrent ? C.ink : C.inkMuted
                        return (
                            <div key={marker.id} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", position: "relative" as const }}>
                                <div style={{ width: isGate ? 2 : 1.5, height: isGate ? 18 : 12, background: tickColor, borderRadius: 1, transition: "background 0.3s", marginTop: isGate ? 1 : 4 }} />
                                <div style={{ fontSize: isGate ? 10 : 9, fontFamily: "monospace", fontWeight: isCurrent ? 700 : 400, color: labelColor, marginTop: 4, letterSpacing: isGate ? "0.04em" : 0 }}>
                                    {marker.label}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div style={{ display: "flex", marginTop: 6, fontSize: 9, color: C.inkMuted, letterSpacing: "0.08em", textTransform: "uppercase" as const, fontWeight: 500 }}>
                    <div style={{ flex: 6, paddingLeft: 2 }}>Phase 1</div>
                    <div style={{ flex: 9, textAlign: "right" as const, paddingRight: 2 }}>Phase 2</div>
                </div>
            </div>
        </div>
    )
}

function GateBox({ num, title, items }: { num: string; title: string; items: string[] }) {
    return (
        <div style={{ margin: "20px 0", padding: "16px 20px", background: C.white, border: `1.5px solid ${C.gate}`, borderRadius: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.gate, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, fontFamily: "monospace", flexShrink: 0 }}>
                {num}
            </div>
            <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.gate, letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 8 }}>{title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {items.map((item, i) => (
                        <li key={i} style={{ fontSize: 12, color: C.inkMid, padding: "2px 0 2px 16px", position: "relative" as const }}>
                            <span style={{ position: "absolute" as const, left: 0, color: C.gate }}>✓</span>{item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

function CallCard({ call, checked, note, open, onToggle, onCheck, onNote, progress, phaseColor }: any) {
    const complete = progress.done === progress.total && progress.total > 0
    const hasNote = note && note.trim().length > 0

    return (
        <div style={{ background: C.white, border: `1px solid ${C.rule}`, borderRadius: 8, overflow: "hidden", opacity: complete ? 0.6 : 1, transition: "opacity 0.3s", marginBottom: 8 }}>
            <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: open ? C.goldLight : "transparent" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: call.phase === 1 ? "#EEF4F1" : "#EBF0F6", color: phaseColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, fontFamily: "monospace", flexShrink: 0 }}>
                    {call.num}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 1 }}>{call.week}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>{call.title}</div>
                </div>
                {hasNote && !open && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, flexShrink: 0, marginRight: 4 }} />}
                <span style={{ fontSize: 10, fontFamily: "monospace", color: complete ? C.green : C.inkMuted, fontWeight: complete ? 700 : 400, marginRight: 4 }}>{progress.done}/{progress.total}</span>
                <span style={{ fontSize: 16, color: C.inkMuted, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block", lineHeight: 1 }}>›</span>
            </div>
            {open && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.rule}` }}>
                    {call.purpose && <div style={{ fontSize: 12, color: C.inkMuted, fontStyle: "italic", marginTop: 12, marginBottom: 8, lineHeight: 1.5 }}>{call.purpose}</div>}

                    <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>What we'll cover together</div>
                        {call.discuss.map((item: string, i: number) => {
                            const key = `${call.id}-discuss-${i}`
                            const done = !!checked[key]
                            return (
                                <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "5px 0", borderBottom: i < call.discuss.length - 1 ? "1px solid #F5F0EA" : "none" }}>
                                    <input type="checkbox" checked={done} onChange={() => onCheck(call.id, i, "discuss")} style={{ width: 14, height: 14, marginTop: 3, flexShrink: 0, accentColor: phaseColor, cursor: "pointer" }} />
                                    <span onClick={() => onCheck(call.id, i, "discuss")} style={{ fontSize: 12, color: done ? C.inkMuted : C.inkMid, lineHeight: 1.5, cursor: "pointer", flex: 1, textDecoration: done ? "line-through" : "none" }}>{item}</span>
                                </div>
                            )
                        })}
                    </div>

                    {call.after.length > 0 && (
                        <div style={{ marginTop: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>Next steps after this call</div>
                            {call.after.map((item: string, i: number) => {
                                const key = `${call.id}-after-${i}`
                                const done = !!checked[key]
                                return (
                                    <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "5px 0", borderBottom: i < call.after.length - 1 ? "1px solid #F5F0EA" : "none" }}>
                                        <input type="checkbox" checked={done} onChange={() => onCheck(call.id, i, "after")} style={{ width: 14, height: 14, marginTop: 3, flexShrink: 0, accentColor: phaseColor, cursor: "pointer" }} />
                                        <span onClick={() => onCheck(call.id, i, "after")} style={{ fontSize: 12, color: done ? C.inkMuted : C.inkMid, lineHeight: 1.5, cursor: "pointer", flex: 1, textDecoration: done ? "line-through" : "none" }}>{item}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.rule}` }}>Notes & decisions</div>
                        <textarea
                            value={note}
                            onChange={(e) => onNote(call.id, e.target.value)}
                            placeholder="Capture any decisions, preferences, or follow-up items from this call…"
                            rows={3}
                            style={{ width: "100%", fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.inkMid, background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4, padding: "10px 12px", resize: "vertical" as const, outline: "none", lineHeight: 1.6, boxSizing: "border-box" as const }}
                            onFocus={(e) => (e.target.style.borderColor = C.gold)}
                            onBlur={(e) => (e.target.style.borderColor = C.rule)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export function DesignPlanningContent({ webhookGet, webhookSave }: { webhookGet: string; webhookSave: string }) {
    const [checked, setChecked] = useState<Record<string, boolean>>({})
    const [notes, setNotes] = useState<Record<string, string>>({})
    const [generalNotes, setGeneralNotes] = useState("")
    const [openCalls, setOpenCalls] = useState<Record<string, boolean>>({})
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
    const [loading, setLoading] = useState(true)
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pendingChecked = useRef<Record<string, boolean>>({})
    const pendingNotes = useRef<Record<string, string>>({})
    const pendingGeneralNotes = useRef("")

    useEffect(() => {
        fetch(webhookGet)
            .then((r) => r.json())
            .then((data) => {
                try { const c = JSON.parse(data?.checkboxes ?? "{}"); setChecked(c); pendingChecked.current = c } catch { setChecked({}) }
                try { const n = JSON.parse(data?.notes ?? "{}"); setNotes(n); pendingNotes.current = n } catch { setNotes({}) }
                const gn = data?.generalNotes ?? ""
                setGeneralNotes(gn)
                pendingGeneralNotes.current = gn
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [webhookGet])

    const saveToN8n = useCallback((c: Record<string, boolean>, n: Record<string, string>, gn: string) => {
        setSaveStatus("saving")
        fetch(webhookSave, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkboxes: JSON.stringify(c), notes: JSON.stringify(n), generalNotes: gn }),
        })
            .then((r) => { if (r.ok) setSaveStatus("saved"); else setSaveStatus("error") })
            .catch(() => setSaveStatus("error"))
    }, [webhookSave])

    const scheduleSave = useCallback(() => {
        setSaveStatus("saving")
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => saveToN8n(pendingChecked.current, pendingNotes.current, pendingGeneralNotes.current), 1000)
    }, [saveToN8n])

    const handleCheck = useCallback((callId: string, idx: number, type: "discuss" | "after") => {
        const key = `${callId}-${type}-${idx}`
        setChecked((prev) => {
            const next = { ...prev }
            if (next[key]) delete next[key]; else next[key] = true
            pendingChecked.current = next
            scheduleSave()
            return next
        })
    }, [scheduleSave])

    const handleNote = useCallback((callId: string, value: string) => {
        setNotes((prev) => {
            const next = { ...prev, [callId]: value }
            pendingNotes.current = next
            scheduleSave()
            return next
        })
    }, [scheduleSave])

    const handleGeneralNotes = useCallback((value: string) => {
        setGeneralNotes(value)
        pendingGeneralNotes.current = value
        scheduleSave()
    }, [scheduleSave])

    const callProgress = (c: typeof CALLS[0]) => {
        const total = c.discuss.length + c.after.length
        const done = c.discuss.filter((_, i) => checked[`${c.id}-discuss-${i}`]).length + c.after.filter((_, i) => checked[`${c.id}-after-${i}`]).length
        return { done, total }
    }

    const totalItems = CALLS.reduce((s, c) => s + c.discuss.length + c.after.length, 0)
    const doneItems = Object.values(checked).filter(Boolean).length
    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

    if (loading) return <div style={{ padding: "32px 0", fontSize: 13, color: C.inkMuted }}>Loading your journey…</div>

    return (
        <div style={{ paddingTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: saveStatus === "saved" ? C.green : saveStatus === "saving" ? C.gold : saveStatus === "error" ? C.red : C.inkMuted }}>
                    {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "✓ Saved" : saveStatus === "error" ? "Save failed" : ""}
                </span>
            </div>

            <JourneyTimeline checked={checked} />

            <div style={{ marginBottom: 24, padding: "16px 20px", background: C.white, border: `1px solid ${C.rule}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 4 }}>General Notes</div>
                <div style={{ fontSize: 11, color: C.inkMuted, marginBottom: 10 }}>Key decisions, design changes, and important discussions. Saved automatically.</div>
                <textarea
                    value={generalNotes}
                    onChange={(e) => handleGeneralNotes(e.target.value)}
                    placeholder="Use this space to capture important project notes, design direction changes, client preferences, and anything the team should keep top of mind…"
                    rows={5}
                    style={{ width: "100%", fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.inkMid, background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4, padding: "10px 12px", resize: "vertical" as const, outline: "none", lineHeight: 1.6, boxSizing: "border-box" as const }}
                    onFocus={(e) => (e.target.style.borderColor = C.gold)}
                    onBlur={(e) => (e.target.style.borderColor = C.rule)}
                />
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8 }}>
                    <span>Journey progress</span>
                    <span>{doneItems} of {totalItems} items ({pct}%)</span>
                </div>
                <div style={{ height: 5, background: C.rule, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: C.gold, borderRadius: 3, transition: "width 0.4s ease" }} />
                </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${C.rule}`, margin: "24px 0" }} />

            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 4 }}>Phase 1</div>
            <h3 style={{ fontSize: 18, fontWeight: 400, color: C.ink, marginBottom: 6 }}>Design & Feasibility</h3>
            <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 16, display: "flex", gap: 20, flexWrap: "wrap" as const }}>
                <span><b style={{ color: C.ink, fontWeight: 500 }}>Timing:</b> Approx. 5–6 weeks</span>
                <span><b style={{ color: C.ink, fontWeight: 500 }}>Fee:</b> $35,000</span>
            </div>
            <div style={{ borderLeft: `3px solid ${C.phase1}`, paddingLeft: 16, marginBottom: 32 }}>
                {CALLS.filter((c) => c.phase === 1).map((call) => (
                    <CallCard key={call.id} call={call} checked={checked} note={notes[call.id] || ""} open={!!openCalls[call.id]} onToggle={() => setOpenCalls((p) => ({ ...p, [call.id]: !p[call.id] }))} onCheck={handleCheck} onNote={handleNote} progress={callProgress(call)} phaseColor={C.phase1} />
                ))}
            </div>

            <GateBox num="G1" title="Milestone — Design approved & Phase 2 begins" items={["The design feels right — floor plans, elevations, and site orientation are approved", "The feasibility estimate has been reviewed and accepted", "Consultant proposals have been reviewed and approved", "The Pre-Construction Agreement has been signed", "Phase 2 is underway — consultants are formally engaged"]} />

            <hr style={{ border: "none", borderTop: `1px solid ${C.rule}`, margin: "24px 0" }} />

            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 4 }}>Phase 2</div>
            <h3 style={{ fontSize: 18, fontWeight: 400, color: C.ink, marginBottom: 6 }}>Detailed Design & Permit</h3>
            <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 16, display: "flex", gap: 20, flexWrap: "wrap" as const }}>
                <span><b style={{ color: C.ink, fontWeight: 500 }}>Timing:</b> Approx. 8–9 weeks</span>
                <span><b style={{ color: C.ink, fontWeight: 500 }}>Fee:</b> $15,000 D&P Phase 2 + $40,000 Evergreen #1</span>
            </div>
            <div style={{ borderLeft: `3px solid ${C.phase2}`, paddingLeft: 16, marginBottom: 32 }}>
                {CALLS.filter((c) => c.phase === 2).map((call) => (
                    <CallCard key={call.id} call={call} checked={checked} note={notes[call.id] || ""} open={!!openCalls[call.id]} onToggle={() => setOpenCalls((p) => ({ ...p, [call.id]: !p[call.id] }))} onCheck={handleCheck} onNote={handleNote} progress={callProgress(call)} phaseColor={C.phase2} />
                ))}
            </div>

            <GateBox num="G2" title="Milestone — Ready to build" items={["The complete design and specifications have been reviewed and approved", "The detailed construction estimate has been accepted", "The permit package has been submitted or is ready for submission", "The Construction Agreement has been signed", "Construction is ready to begin"]} />
        </div>
    )
}

export function TeamContent({ webhookTeamGet }: { webhookTeamGet: string }) {
    const [team, setTeam] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(webhookTeamGet)
            .then((r) => r.json())
            .then((data) => { if (data?.team) setTeam(data.team); setLoading(false) })
            .catch(() => setLoading(false))
    }, [webhookTeamGet])

    if (loading) return <div style={{ padding: "32px 0", fontSize: 13, color: C.inkMuted }}>Loading your team…</div>

    if (team.length === 0) return (
        <div style={{ padding: "32px 0", fontSize: 13, color: C.inkMuted }}>Your team details will appear here once your project is set up.</div>
    )

    return (
        <div style={{ paddingTop: 16 }}>
            <div style={{ display: "grid", gap: 16 }}>
                {team.map((member, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: C.surface, borderRadius: 8, border: `1px solid ${C.rule}` }}>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: C.rule, border: `2px solid ${C.goldPale}` }}>
                            {member.photo
                                ? <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" as const }} />
                                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 300, color: C.inkMuted }}>{member.name?.charAt(0)}</div>
                            }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 2 }}>{member.name}</div>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 6 }}>{member.role}</div>
                            {member.bio && <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.5, marginBottom: 8 }}>{member.bio}</div>}
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
                                {member.email && <a href={`mailto:${member.email}`} style={{ fontSize: 12, color: C.inkMid, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.gold }}>✉</span>{member.email}</a>}
                                {member.phone && <a href={`tel:${member.phone}`} style={{ fontSize: 12, color: C.inkMid, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><span style={{ color: C.gold }}>✆</span>{member.phone}</a>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
