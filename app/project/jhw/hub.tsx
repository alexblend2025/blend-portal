"use client"

import { useState } from "react"
import Link from "next/link"

const STAGES = [
    { id: "proposal", label: "Proposal", icon: "01" },
    { id: "team", label: "Team", icon: "02" },
    { id: "lookbook", label: "Lookbook", icon: "03" },
    { id: "design-planning", label: "Design & Planning", icon: "04" },
    { id: "pre-construction", label: "Pre-Construction", icon: "05" },
    { id: "construction", label: "Construction", icon: "06" },
    { id: "warranty", label: "Warranty", icon: "07" },
]

const C = {
    gold: "#B8986A",
    goldLight: "#F5EFE3",
    ink: "#1C1C1A",
    inkMid: "#4A4A46",
    inkMuted: "#888880",
    rule: "#E5E5E5",
    surface: "#F8F8F8",
    white: "#FFFFFF",
    disabled: "#C8C8C8",
}

function LineItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0F0F0", fontSize: 14, color: C.ink }}>
            <span>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
    )
}

function SubtotalRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `2px solid ${C.ink}`, fontSize: 14, fontWeight: 600 }}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    )
}

function SectionLabel({ children }: { children: string }) {
    return (
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.rule}` }}>
            {children}
        </div>
    )
}

function ProposalContent({ project }: { project: any }) {
    return (
        <div style={{ padding: "32px 0 8px" }}>
            {/* Hero */}
            <div style={{ borderBottom: `1px solid ${C.rule}`, paddingBottom: 32, marginBottom: 40 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 12 }}>
                    Project Proposal · {project.proposalDate}
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.03em", color: C.ink, marginBottom: 8, lineHeight: 1.1 }}>
                    {project.modelName}
                </h2>
                <div style={{ fontSize: 14, color: C.inkMuted, marginBottom: 20 }}>
                    {project.clientName} · {project.location}
                </div>
                <div style={{ display: "inline-block", background: C.ink, color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, padding: "5px 12px", borderRadius: 2 }}>
                    {project.squareFootage} sq ft · {project.roofStyle}
                </div>
            </div>

            {/* Investment */}
            <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 20 }}>
                    Investment Summary
                </div>
                <SectionLabel>Kit Costs</SectionLabel>
                <LineItem label="Design and Planning" value={project.designPlanningFee} />
                <LineItem label="Blend Kit" value={project.kitPrice} />
                <SubtotalRow label="Kit Sub-total" value={project.kitSubtotal} />

                <div style={{ marginTop: 28 }}>
                    <SectionLabel>Estimated Variable Costs</SectionLabel>
                </div>
                <LineItem label="Construction" value={project.construction} />
                <LineItem label="Site Work and Foundation" value={project.siteWork} />
                <LineItem label="Consulting and Soft Costs" value={project.consulting} />
                <SubtotalRow label="Variable Sub-total" value={project.variableSubtotal} />

                <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", fontSize: 18, fontWeight: 600, borderBottom: `2px solid ${C.ink}` }}>
                    <span>Total Estimated Cost</span>
                    <span>{project.totalCost}</span>
                </div>

                <div style={{ marginTop: 16, fontSize: 12, color: C.inkMuted, lineHeight: 1.6 }}>
                    Variable costs are estimates and subject to change based on site conditions, local trade pricing, and final design. Kit pricing will be finalized once design is approved and engineering is complete. Site work and foundation assumes a level, readily accessible building site with standard soil conditions. Rock excavation, significant grade change, or extended servicing runs are not included.
                </div>
            </div>

            {/* Process */}
            <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 20 }}>
                    How We Work
                </div>
                {[
                    {
                        phase: "01",
                        title: "Initial Design & Planning",
                        agreement: "Design & Planning Agreement",
                        timing: "6 to 8 weeks",
                        fee: project.phase1Fee,
                        gate: "Design Approval — floor plans, elevations, and preliminary estimate.",
                        includes: [
                            "Concept design and bylaw review",
                            "Plans and drawings — site plan, foundation, floor plans, roof plan, elevations",
                            "Building massing and 3D visuals",
                            "Window and door schedule",
                            "Preliminary Class D estimate and consultant proposals",
                        ],
                    },
                    {
                        phase: "02",
                        title: "Pre-Construction & Detailed Design",
                        agreement: "Pre-Construction Agreement",
                        timing: "8 to 12 weeks",
                        fee: `${project.phase2Fee} + ${project.evergreen1} Evergreen #1 (third-party costs)`,
                        gate: "Detailed Scope & Cost Approval — fully developed design, specifications, and detailed estimate.",
                        includes: [
                            "Interior design and millwork drawings",
                            "Finish and material schedules",
                            "Electrical and lighting drawings",
                            "Consultant coordination — engineering, geotechnical, energy, survey",
                            "Permit-ready drawing package and detailed project estimate",
                        ],
                    },
                    {
                        phase: "03",
                        title: "Permitting & Construction Authorization",
                        agreement: "Construction Agreement / Kit Agreement",
                        timing: "Month 4 to 6 onwards",
                        fee: `${project.evergreen2} Evergreen #2 — materials, manufacturing, and mobilization`,
                        gate: null,
                        includes: [
                            "Permit package submission",
                            "Schedule and logistics finalized",
                            "Manufacturing and long-lead orders released",
                            "Construction begins once permits are approved",
                        ],
                    },
                ].map((p) => (
                    <div key={p.phase} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${C.rule}` }}>
                        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, fontFamily: "monospace", flexShrink: 0, marginTop: 2 }}>
                                {p.phase}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                                <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 10, display: "flex", gap: 20, flexWrap: "wrap" as const }}>
                                    <span><b style={{ color: C.ink, fontWeight: 500 }}>Agreement:</b> {p.agreement}</span>
                                    <span><b style={{ color: C.ink, fontWeight: 500 }}>Timing:</b> {p.timing}</span>
                                </div>
                                <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 10 }}>
                                    <b style={{ color: C.ink, fontWeight: 500 }}>Fee:</b> {p.fee}
                                </div>
                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px 0" }}>
                                    {p.includes.map((item) => (
                                        <li key={item} style={{ fontSize: 13, color: C.inkMid, padding: "3px 0 3px 16px", position: "relative", lineHeight: 1.5 }}>
                                            <span style={{ position: "absolute", left: 0, color: C.gold }}>→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                {p.gate && (
                                    <div style={{ background: C.surface, border: `1px solid ${C.rule}`, borderRadius: 4, padding: "10px 14px", fontSize: 12, color: C.inkMid }}>
                                        <b style={{ color: C.ink }}>Decision Gate:</b> {p.gate}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            {project.contractLink && (
                <div style={{ background: C.ink, borderRadius: 8, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 20 }}>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 400, color: "#fff", marginBottom: 4 }}>Ready to move forward?</div>
                        <div style={{ fontSize: 13, color: C.inkMuted }}>Review and sign the proposal agreement.</div>
                    </div>
                    <a href={project.contractLink} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: C.gold, color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>
                        Review & Sign →
                    </a>
                </div>
            )}
        </div>
    )
}

function DesignPlanningContent() {
    return (
        <div style={{ padding: "32px 0 8px", textAlign: "center" as const, color: C.inkMuted }}>
            <div style={{ fontSize: 14 }}>Your Design & Planning journey will appear here once this phase is activated.</div>
        </div>
    )
}

function LookbookContent() {
    return (
        <div style={{ padding: "32px 0 8px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 16 }}>Lookbook</div>
            <h3 style={{ fontSize: 24, fontWeight: 300, marginBottom: 8 }}>Tell us about your vision</h3>
            <p style={{ fontSize: 14, color: C.inkMuted, lineHeight: 1.6, marginBottom: 28 }}>
                The Lookbook is where you share your style, preferences, and inspiration with the Blend team. It takes about 15 minutes and helps us design a home that feels like yours.
            </p>
            <a href="https://forms.google.com" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: C.ink, color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>
                Open Lookbook →
            </a>
        </div>
    )
}

function LockedContent({ label }: { label: string }) {
    return (
        <div style={{ padding: "32px 0 8px", textAlign: "center" as const }}>
            <div style={{ fontSize: 13, color: C.disabled }}>This section will be unlocked by your Blend team when it's time.</div>
        </div>
    )
}

function TeamContent() {
    return (
        <div style={{ padding: "32px 0 8px", fontSize: 14, color: C.inkMuted }}>
            Your Blend team will appear here.
        </div>
    )
}

function WarrantyContent() {
    return (
        <div style={{ padding: "32px 0 8px", fontSize: 14, color: C.inkMuted }}>
            Warranty information will appear here.
        </div>
    )
}

interface JHWHubProps {
    project: any
    userEmail: string
    activeStages: string[]
    projectCode: string
    modelName: string
}

export default function JHWHub({ project, userEmail, activeStages, projectCode, modelName }: JHWHubProps) {
    const [openStages, setOpenStages] = useState<string[]>(() => {
        // Auto-open the first active stage on load
        if (activeStages.length > 0) return [activeStages[0]]
        return []
    })

    const toggleStage = (id: string) => {
        setOpenStages((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        )
    }

    const renderContent = (id: string) => {
        switch (id) {
            case "proposal": return <ProposalContent project={project} />
            case "design-planning": return <DesignPlanningContent />
            case "lookbook": return <LookbookContent />
            case "team": return <TeamContent />
            case "warranty": return <WarrantyContent />
            default: return <LockedContent label={id} />
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: C.white, fontFamily: "system-ui, -apple-system, sans-serif", color: C.ink }}>
            {/* Top nav */}
            <div style={{ background: C.ink, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
                <Link href="/">
                    <img src="/logo-white.png" alt="Blend Projects" style={{ height: 32, width: "auto", display: "block", cursor: "pointer" }} />
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" as const }}>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.gold }}>{projectCode}</div>
                        <div style={{ fontSize: 11, color: C.inkMuted }}>{modelName}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px 96px" }}>

                {/* Page header */}
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.rule}` }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8 }}>Client Portal</div>
                    <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", margin: 0 }}>
                        {project.clientName} · {project.location}
                    </h1>
                </div>

                {/* Accordion stages */}
                <div style={{ display: "grid", gap: 8 }}>
                    {STAGES.map((stage, idx) => {
                        const isActive = activeStages.includes(stage.id)
                        const isOpen = openStages.includes(stage.id)

                        return (
                            <div key={stage.id} style={{
                                border: `1px solid ${isOpen ? C.ink : C.rule}`,
                                borderRadius: 8,
                                overflow: "hidden",
                                opacity: isActive ? 1 : 0.4,
                                transition: "border-color 0.2s, opacity 0.2s",
                            }}>
                                {/* Stage header */}
                                <div
                                    onClick={() => isActive && toggleStage(stage.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "16px 20px",
                                        cursor: isActive ? "pointer" : "default",
                                        background: isOpen ? C.goldLight : C.white,
                                        borderLeft: isOpen ? `3px solid ${C.gold}` : "3px solid transparent",
                                        transition: "background 0.15s",
                                        userSelect: "none" as const,
                                    }}
                                >
                                    <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        background: isOpen ? C.ink : isActive ? C.ink : C.disabled,
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        fontFamily: "monospace",
                                        flexShrink: 0,
                                    }}>
                                        {stage.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: isOpen ? 600 : 400, color: isActive ? C.ink : C.disabled }}>
                                            {stage.label}
                                        </div>
                                        {!isActive && (
                                            <div style={{ fontSize: 11, color: C.disabled, marginTop: 2 }}>
                                                Locked — available when activated by your Blend team
                                            </div>
                                        )}
                                    </div>
                                    {isActive && (
                                        <span style={{ fontSize: 18, color: C.inkMuted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block", lineHeight: 1 }}>
                                            ⌄
                                        </span>
                                    )}
                                </div>

                                {/* Stage content */}
                                {isOpen && isActive && (
                                    <div style={{ padding: "0 24px 32px", borderTop: `1px solid ${C.rule}` }}>
                                        {renderContent(stage.id)}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div style={{ marginTop: 64, paddingTop: 20, borderTop: `1px solid ${C.rule}`, fontSize: 11, color: C.inkMuted, display: "flex", justifyContent: "space-between" }}>
                    <span>Blend Projects Inc.</span>
                    <span>{projectCode} · {modelName}</span>
                </div>
            </div>
        </div>
    )
}
