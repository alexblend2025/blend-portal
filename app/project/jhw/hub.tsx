"use client"

import { useEffect, useState } from "react"

const STAGES = [
    { id: "proposal", label: "Proposal", icon: "01" },
    { id: "design-planning", label: "Design & Planning", icon: "02" },
    { id: "lookbook", label: "Lookbook", icon: "03" },
    { id: "pre-construction", label: "Pre-Construction", icon: "04" },
    { id: "construction", label: "Construction", icon: "05" },
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
    disabled: "#D0D0D0",
}

function Sidebar({ activeStages, current, setCurrent, mobileOpen, setMobileOpen }: any) {
    return (
        <>
            {/* Mobile toggle */}
            <div style={{
                display: "none",
                padding: "12px 24px",
                background: C.ink,
                cursor: "pointer",
            }}
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            >
                <span style={{ color: C.gold, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {STAGES.find(s => s.id === current)?.label ?? "Menu"} {mobileOpen ? "▲" : "▼"}
                </span>
            </div>

            <div style={{
                width: 240,
                flexShrink: 0,
                borderRight: `1px solid ${C.rule}`,
                minHeight: "calc(100vh - 52px)",
                padding: "32px 0",
                position: "sticky",
                top: 52,
                alignSelf: "flex-start",
            }}>
                <div style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.inkMuted,
                    padding: "0 24px",
                    marginBottom: 16,
                }}>
                    Project Stages
                </div>

                {STAGES.map((stage) => {
                    const isActive = activeStages.includes(stage.id)
                    const isCurrent = current === stage.id
                    return (
                        <div
                            key={stage.id}
                            onClick={() => isActive && setCurrent(stage.id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 24px",
                                cursor: isActive ? "pointer" : "default",
                                background: isCurrent ? C.goldLight : "transparent",
                                borderLeft: isCurrent ? `3px solid ${C.gold}` : "3px solid transparent",
                                transition: "background 0.15s",
                            }}
                        >
                            <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: isCurrent ? C.ink : isActive ? C.ink : C.disabled,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 10,
                                fontWeight: 600,
                                fontFamily: "monospace",
                                flexShrink: 0,
                                opacity: isActive ? 1 : 0.4,
                            }}>
                                {stage.icon}
                            </div>
                            <span style={{
                                fontSize: 13,
                                fontWeight: isCurrent ? 600 : 400,
                                color: isCurrent ? C.ink : isActive ? C.inkMid : C.disabled,
                            }}>
                                {stage.label}
                            </span>
                            {!isActive && (
                                <span style={{
                                    fontSize: 10,
                                    color: C.disabled,
                                    marginLeft: "auto",
                                }}>
                                    🔒
                                </span>
                            )}
                        </div>
                    )
                })}

                <div style={{
                    margin: "24px 24px 0",
                    padding: "16px",
                    background: C.surface,
                    borderRadius: 6,
                    border: `1px solid ${C.rule}`,
                }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>Your Team</div>
                    <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.5 }}>
                        Questions? Contact your Blend project team directly.
                    </div>
                    <a href="mailto:hello@blendprojects.co" style={{
                        display: "inline-block",
                        marginTop: 10,
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.ink,
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                    }}>
                        hello@blendprojects.co →
                    </a>
                </div>
            </div>
        </>
    )
}

function ProposalSection({ project }: any) {
    return (
        <div>
            {/* Hero */}
            <div style={{ borderBottom: `1px solid ${C.rule}`, paddingBottom: 40, marginBottom: 48 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 16 }}>
                    Project Proposal · {project.proposalDate}
                </div>
                <h1 style={{ fontSize: 38, fontWeight: 300, letterSpacing: "-0.03em", color: C.ink, marginBottom: 8, lineHeight: 1.1 }}>
                    {project.modelName}
                </h1>
                <div style={{ fontSize: 15, color: C.inkMuted, marginBottom: 24 }}>
                    {project.clientName} · {project.location}
                </div>
                <div style={{ display: "inline-block", background: C.ink, color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 2 }}>
                    {project.squareFootage} sq ft · {project.roofStyle}
                </div>
            </div>

            {/* Investment */}
            <div style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginBottom: 20 }}>
                    Investment Summary
                </div>

                <SectionHeader>Kit Costs</SectionHeader>
                {[
                    ["Design and Planning", project.designPlanningFee],
                    ["Blend Kit", project.kitPrice],
                ].map(([label, value]) => (
                    <LineItem key={label} label={label} value={value} />
                ))}
                <SubtotalRow label="Kit Sub-total" value={project.kitSubtotal} />

                <SectionHeader style={{ marginTop: 28 }}>Estimated Variable Costs</SectionHeader>
                {[
                    ["Construction", project.construction],
                    ["Site Work and Foundation", project.siteWork],
                    ["Consulting and Soft Costs", project.consulting],
                ].map(([label, value]) => (
                    <LineItem key={label} label={label} value={value} />
                ))}
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
            <div style={{ marginBottom: 56 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginBottom: 20 }}>
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
                    <div key={p.phase} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${C.rule}` }}>
                        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, fontFamily: "monospace", flexShrink: 0, marginTop: 2 }}>
                                {p.phase}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                                <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 12, display: "flex", gap: 20, flexWrap: "wrap" }}>
                                    <span><b style={{ color: C.ink, fontWeight: 500 }}>Agreement:</b> {p.agreement}</span>
                                    <span><b style={{ color: C.ink, fontWeight: 500 }}>Timing:</b> {p.timing}</span>
                                </div>
                                <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 12 }}>
                                    <b style={{ color: C.ink, fontWeight: 500 }}>Fee:</b> {p.fee}
                                </div>
                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px 0" }}>
                                    {p.includes.map((item) => (
                                        <li key={item} style={{ fontSize: 13, color: C.inkMid, padding: "4px 0 4px 16px", position: "relative", lineHeight: 1.5 }}>
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
            <div style={{ background: C.ink, borderRadius: 8, padding: "32px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 400, color: "#fff", marginBottom: 4 }}>Ready to move forward?</div>
                    <div style={{ fontSize: 13, color: C.inkMuted }}>Review and sign the proposal agreement below.</div>
                </div>
                <a href="#pandadoc" style={{ display: "inline-block", background: C.gold, color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>
                    Review & Sign →
                </a>
            </div>
        </div>
    )
}

function LockedSection({ label }: { label: string }) {
    return (
        <div style={{ padding: "64px 0", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 300, color: C.inkMuted, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 13, color: C.disabled }}>This section will be unlocked by your Blend team when it's time.</div>
        </div>
    )
}

function LookbookSection() {
    return (
        <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: C.gold, marginBottom: 20 }}>Lookbook</div>
            <h2 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 8 }}>Tell us about your vision</h2>
            <p style={{ fontSize: 14, color: C.inkMuted, lineHeight: 1.6, marginBottom: 32 }}>
                The Lookbook is where you share your style, preferences, and inspiration with the Blend team. It takes about 15 minutes and helps us design a home that feels like yours.
            </p>
            <a href="https://forms.google.com" target="_blank" rel="noreferrer" style={{ display: "inline-block", background: C.ink, color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>
                Open Lookbook →
            </a>
        </div>
    )
}

function SectionHeader({ children, style }: any) {
    return (
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.rule}`, ...style }}>
            {children}
        </div>
    )
}

function LineItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid #F0F0F0`, fontSize: 14, color: C.ink }}>
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

interface JHWHubProps {
    project: any
    userEmail: string
    activeStages: string[]
}

export default function JHWHub({ project, userEmail, activeStages }: JHWHubProps) {


    const [current, setCurrent] = useState("proposal")
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div style={{ minHeight: "100vh", background: C.white, fontFamily: "system-ui, -apple-system, sans-serif", color: C.ink }}>
            {/* Top bar */}
            <div style={{ background: C.ink, padding: "0 48px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gold }}>BLEND PROJECTS</span>
                <span style={{ fontSize: 11, color: C.inkMuted }}>{userEmail}</span>
            </div>

            <div style={{ display: "flex" }}>
                <Sidebar
                    activeStages={activeStages}
                    current={current}
                    setCurrent={setCurrent}
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                />

                <div style={{ flex: 1, padding: "48px 56px 96px", maxWidth: 760 }}>
                    {current === "proposal" && <ProposalSection project={project} />}
                    {current === "design-planning" && (
                        activeStages.includes("design-planning")
                            ? <LockedSection label="Design & Planning — Coming Soon" />
                            : <LockedSection label="Design & Planning" />
                    )}
                    {current === "lookbook" && (
                        activeStages.includes("lookbook")
                            ? <LookbookSection />
                            : <LockedSection label="Lookbook" />
                    )}
                    {current === "pre-construction" && <LockedSection label="Pre-Construction" />}
                    {current === "construction" && <LockedSection label="Construction" />}
                </div>
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .mobile-toggle { display: block !important; }
                }
            `}</style>
        </div>
    )
}
