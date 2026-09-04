"use client"

import { useState } from "react"
import Link from "next/link"

const C = {
    gold: "#B8986A",
    ink: "#1C1C1A",
    inkMuted: "#888880",
    rule: "#E5E5E5",
    surface: "#F8F8F8",
}

export default function ProjectList({ projects }: { projects: any[] }) {
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("code")

    const filtered = projects
        .filter((p) => {
            const q = search.toLowerCase()
            return (
                p.projectCode?.toLowerCase().includes(q) ||
                p.clientName?.toLowerCase().includes(q) ||
                p.location?.toLowerCase().includes(q)
            )
        })
        .sort((a, b) => {
            if (sortBy === "code") return a.projectCode?.localeCompare(b.projectCode)
            if (sortBy === "name") return a.clientName?.localeCompare(b.clientName)
            if (sortBy === "location") return a.location?.localeCompare(b.location)
            return 0
        })

    return (
        <div>
            {/* Search and sort bar */}
            <div style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
                flexWrap: "wrap" as const,
            }}>
                <input
                    type="text"
                    placeholder="Search by code, name, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: 200,
                        padding: "10px 14px",
                        fontSize: 13,
                        border: `1px solid ${C.rule}`,
                        borderRadius: 4,
                        background: C.surface,
                        color: C.ink,
                        outline: "none",
                        fontFamily: "system-ui, sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = C.gold)}
                    onBlur={(e) => (e.target.style.borderColor = C.rule)}
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        border: `1px solid ${C.rule}`,
                        borderRadius: 4,
                        background: C.surface,
                        color: C.ink,
                        outline: "none",
                        fontFamily: "system-ui, sans-serif",
                        cursor: "pointer",
                    }}
                >
                    <option value="code">Sort by Project Code</option>
                    <option value="name">Sort by Client Name</option>
                    <option value="location">Sort by Location</option>
                </select>
            </div>

            {/* Project list */}
            {filtered.length === 0 ? (
                <div style={{ padding: "48px 0", textAlign: "center" as const, fontSize: 14, color: C.inkMuted }}>
                    No projects match your search.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 16 }}>
                    {filtered.map((p: any) => (
                        <Link
                            key={p.id}
                            href={`/project/${p.projectCode.toLowerCase()}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div style={{
                                border: `1px solid ${C.rule}`,
                                borderRadius: 8,
                                padding: "28px 32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 24,
                                cursor: "pointer",
                                background: "#ffffff",
                                transition: "border-color 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ink)}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.rule)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                        <div style={{
                                            fontSize: 10,
                                            fontWeight: 600,
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase" as const,
                                            color: "#ffffff",
                                            background: C.ink,
                                            padding: "3px 8px",
                                            borderRadius: 2,
                                        }}>
                                            {p.projectCode}
                                        </div>
                                        {p.status && (
                                            <div style={{
                                                fontSize: 10,
                                                fontWeight: 600,
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase" as const,
                                                color: C.gold,
                                                border: `1px solid ${C.gold}`,
                                                padding: "3px 8px",
                                                borderRadius: 2,
                                            }}>
                                                {p.status}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 20, fontWeight: 400, color: C.ink, marginBottom: 4 }}>
                                        {p.modelName}
                                    </div>
                                    <div style={{ fontSize: 13, color: C.inkMuted }}>
                                        {p.clientName} · {p.location}
                                    </div>
                                    {p.description && (
                                        <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 8 }}>
                                            {p.description}
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 20, color: C.inkMuted, flexShrink: 0 }}>→</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
