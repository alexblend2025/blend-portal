"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const AIRTABLE_BASE = "appBYDH5PMbXLdaSk"
const PROPOSALS_TABLE = "tblPhWiFcCrFFF8Yq"
const AIRTABLE_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_KEY

const C = {
    gold: "#B8986A",
    ink: "#1C1C1A",
    inkMid: "#4A4A46",
    inkMuted: "#888880",
    rule: "#E5E5E5",
    surface: "#F8F8F8",
    white: "#FFFFFF",
}

async function fetchProposals() {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${PROPOSALS_TABLE}`
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}` },
    })
    const data = await res.json()
    console.log("proposals data:", data)
    return data.records ?? []
}

export default function EstimatorDashboard() {
    const [proposals, setProposals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchProposals().then(records => {
            setProposals(records)
            setLoading(false)
        })
    }, [])

    const filtered = proposals.filter(p => {
        const q = search.toLowerCase()
        const f = p.fields
        return (
            f["Client Name"]?.toLowerCase().includes(q) ||
            f["Project Code"]?.toLowerCase().includes(q) ||
            f["Location"]?.toLowerCase().includes(q) ||
            f["Model Name"]?.toLowerCase().includes(q)
        )
    })

    return (
        <div style={{ minHeight: "100vh", background: C.white, fontFamily: "system-ui, -apple-system, sans-serif", color: C.ink }}>
            {/* Top nav */}
            <div style={{ background: C.ink, padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link href="/">
                        <img src="/logo-white.png" alt="Blend Projects" style={{ height: 32, width: "auto", display: "block", cursor: "pointer" }} />
                    </Link>
                    <Link href="/" style={{ fontSize: 11, color: "#888880", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                        ← Portal
                    </Link>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.gold }}>
                    Blend Toolbox
                </span>
            </div>

            <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px 96px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.rule}` }}>
                    <div>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8 }}>
                            Blend Toolbox
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", margin: 0 }}>
                            Project Estimator
                        </h1>
                    </div>
                    <Link href="/estimator/new" style={{ textDecoration: "none" }}>
                        <button style={{ padding: "12px 24px", background: C.ink, color: C.white, border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                            + New Estimate
                        </button>
                    </Link>
                </div>

                {/* Search */}
                <div style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        placeholder="Search by client, code, location, or model..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: `1px solid ${C.rule}`, borderRadius: 4, background: C.surface, color: C.ink, outline: "none", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" as const }}
                        onFocus={e => (e.target.style.borderColor = C.gold)}
                        onBlur={e => (e.target.style.borderColor = C.rule)}
                    />
                </div>

                {/* Proposals list */}
                {loading ? (
                    <div style={{ padding: "48px 0", textAlign: "center" as const, fontSize: 14, color: C.inkMuted }}>Loading proposals…</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: "48px 0", textAlign: "center" as const, fontSize: 14, color: C.inkMuted }}>
                        {search ? "No proposals match your search." : "No proposals yet. Create your first estimate."}
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                        {filtered.map((p: any) => {
                            const f = p.fields
                            const isPushed = f["Status"] === "pushed"
                            const isPending = f["Status"] === "pending"
                            return (
                                <Link key={p.id} href={`/estimator/${p.id}`} style={{ textDecoration: "none" }}>
                                    <div
                                        style={{ border: `1px solid ${C.rule}`, borderRadius: 8, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, background: C.white, cursor: "pointer" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = C.ink)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = C.rule)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                {f["Project Code"] && (
                                                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.white, background: C.ink, padding: "2px 8px", borderRadius: 2 }}>
                                                        {f["Project Code"]}
                                                    </div>
                                                )}
                                                {f["Estimate Class"] && (
                                                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.gold, border: `1px solid ${C.gold}`, padding: "2px 8px", borderRadius: 2 }}>
                                                        {f["Estimate Class"]}
                                                    </div>
                                                )}
                                                <div style={{ 
    fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, 
    color: isPushed ? C.gold : isPending ? "#E8A020" : C.inkMuted, 
    border: `1px solid ${isPushed ? C.gold : isPending ? "#E8A020" : C.rule}`, 
    padding: "2px 8px", borderRadius: 2 
}}>
    {isPushed ? "Pushed" : isPending ? "Pending Approval" : "Draft"}
</div>
                                            </div>
                                            <div style={{ fontSize: 17, fontWeight: 400, color: C.ink, marginBottom: 2 }}>
                                                {f["Client Name"] || "Unnamed Client"}
                                            </div>
                                            <div style={{ fontSize: 12, color: C.inkMuted }}>
                                                {[f["Model Name"], f["Location"]].filter(Boolean).join(" · ")}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                                            {f["Total Estimate"] && (
                                                <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 2 }}>
                                                    ${Math.round(f["Total Estimate"]).toLocaleString("en-CA")}
                                                </div>
                                            )}
                                            {f["Created Date"] && (
                                                <div style={{ fontSize: 11, color: C.inkMuted }}>
                                                    {new Date(f["Created Date"]).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: 64, paddingTop: 20, borderTop: `1px solid ${C.rule}`, fontSize: 11, color: C.inkMuted, display: "flex", justifyContent: "space-between" }}>
                    <span>Blend Projects Inc.</span>
                    <span>Blend Toolbox — Estimator</span>
                </div>
            </div>
        </div>
    )
}
