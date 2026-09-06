"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

function fmt(n: number) {
    return "$" + Math.round(n).toLocaleString("en-CA")
}

export default function ProposalPrintPage() {
    const params = useParams()
    const recordId = params.id as string

    const [loading, setLoading] = useState(true)
    const [proposal, setProposal] = useState<any>(null)

    useEffect(() => {
        async function fetchProposal() {
            const res = await fetch(`https://api.airtable.com/v0/appBYDH5PMbXLdaSk/tblPhWiFcCrFFF8Yq/${recordId}`, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}` }
            })
            const data = await res.json()
            setProposal(data.fields ?? {})
            setLoading(false)
        }
        fetchProposal()
    }, [recordId])

    useEffect(() => {
        if (!loading && proposal) {
            setTimeout(() => window.print(), 500)
        }
    }, [loading, proposal])

    if (loading) return (
        <div style={{ padding: 48, fontFamily: "system-ui", color: "#888880", textAlign: "center" }}>
            Preparing proposal for print…
        </div>
    )

    const f = proposal
    const clientName = f["Client Name"] ?? ""
    const location = f["Location"] ?? ""
    const modelName = f["Model Name"] ?? ""
    const sqFt = f["Square Footage"] ?? ""
    const roofStyle = f["Roof Style"] ?? ""
    const tier = f["Tier"] ?? ""
    const estimateClass = f["Estimate Class"] ?? ""
    const projectCode = f["Project Code"] ?? ""
    const createdAt = f["Created At"] ?? ""

    const dpFee = f["Design Planning Fee"] ?? 50000
    const kitCost = f["Kit Cost Prime"] ?? 0
    const kitOverride = f["Kit Override"]
    const finalKitCost = kitOverride ? kitOverride : kitCost
    const constructionCost = f["Construction Cost"] ?? 0
    const siteWorksCost = f["Site Works Cost"] ?? 0
    const consultingCost = f["Consulting Cost"] ?? 0
    const total = f["Total Estimate"] ?? 0
    const addOns: { name: string; price: number }[] = (() => {
        try {
            const parsed = JSON.parse(f["Add Ons"] ?? "[]")
            return Array.isArray(parsed) ? parsed : []
        } catch { return [] }
    })()
    const addOnsTotal = addOns.reduce((sum, a) => sum + (a.price || 0), 0)
    const low = f["Low Range"] ?? 0
    const high = f["High Range"] ?? 0
    const notes = f["Notes"] ?? ""

    const baseSubtotal = dpFee + finalKitCost + constructionCost
    const variance = parseInt(estimateClass.replace("E", "")) === 0 ? 50 :
                     parseInt(estimateClass.replace("E", "")) === 1 ? 30 :
                     parseInt(estimateClass.replace("E", "")) === 2 ? 25 :
                     parseInt(estimateClass.replace("E", "")) === 3 ? 20 :
                     parseInt(estimateClass.replace("E", "")) === 4 ? 15 : 10

    return (
        <>
            <style>{`
                @media print {
                    @page {
                        size: letter portrait;
                        margin: 0.5in;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print { display: none !important; }
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: system-ui, -apple-system, sans-serif; color: #1C1C1A; background: #fff; }
            `}</style>

            {/* Print button — hidden on print */}
            <div className="no-print" style={{ position: "fixed", top: 16, right: 16, zIndex: 100 }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: "10px 20px", background: "#1C1C1A", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif" }}
                >
                    Print / Save PDF
                </button>
            </div>

            <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 0", minHeight: "100vh", display: "flex", flexDirection: "column" as const }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #1C1C1A" }}>
                    <div>
                        <img src="/logo-dark.png" alt="Blend Projects" style={{ height: 36, width: "auto", marginBottom: 12 }} />
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888880" }}>
                            blendprojects.co
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#888880", marginBottom: 4 }}>
                            Project Estimate
                        </div>
                        <div style={{ fontSize: 10, color: "#888880" }}>{projectCode} · {createdAt}</div>
                        <div style={{ display: "inline-block", marginTop: 8, background: "#1C1C1A", color: "#fff", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2 }}>
                            {estimateClass} — ±{variance}%
                        </div>
                    </div>
                </div>

                {/* Client & Project */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 18, fontWeight: 300, letterSpacing: "-0.02em", color: "#1C1C1A", marginBottom: 4 }}>
                        {modelName}
                    </div>
                    <div style={{ fontSize: 12, color: "#888880", marginBottom: 12 }}>
                        {clientName} · {location}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "#F0F0F0", color: "#1C1C1A", padding: "3px 8px", borderRadius: 2 }}>
                            {sqFt} sq ft
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "#F0F0F0", color: "#1C1C1A", padding: "3px 8px", borderRadius: 2 }}>
                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", background: "#F0F0F0", color: "#1C1C1A", padding: "3px 8px", borderRadius: 2 }}>
                            {roofStyle.charAt(0).toUpperCase() + roofStyle.slice(1)}
                        </div>
                    </div>
                </div>

                {/* Investment Summary */}
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#B8986A", marginBottom: 12 }}>
                        Investment Summary
                    </div>

                    {/* Kit costs */}
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888880", paddingBottom: 6, marginBottom: 8, borderBottom: "1px solid #E5E5E5" }}>
                        Kit Costs
                    </div>
                    <PrintLine label="Design and Planning" value={dpFee} />
                    <PrintLine label="Blend Kit" value={finalKitCost} />
                    <PrintLine label="Kit Sub-total" value={dpFee + finalKitCost} bold border />

                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888880", paddingBottom: 6, marginBottom: 8, marginTop: 20, borderBottom: "1px solid #E5E5E5" }}>
                        Estimated Variable Costs
                    </div>
                    <PrintLine label="Construction" value={constructionCost} />
                    <PrintLine label="Site Work and Foundation" value={siteWorksCost} />
                    <PrintLine label="Consulting and Soft Costs" value={consultingCost} />
                    {addOns.filter(a => a.price > 0).map((a, i) => (
                        <PrintLine key={i} label={a.name || "Add On"} value={a.price} />
                    ))}
                    <PrintLine label="Variable Sub-total" value={siteWorksCost + consultingCost + constructionCost + addOnsTotal} bold border />

                    <PrintLine label="Total Estimated Cost" value={total} bold large border />
                </div>

                {/* Estimate Class */}
                <div style={{ marginBottom: 32, padding: "16px 20px", background: "#F8F8F8", borderRadius: 6, border: "1px solid #E5E5E5" }}>
                    <div style={{ fontSize: 10, color: "#4A4A46", lineHeight: 1.6 }}>
                    This is a <strong>{estimateClass}</strong> estimate with a variance of <strong>±{variance}%</strong>. Variable costs are estimates and subject to change based on site conditions, local trade pricing, and final design.
                    </div>
                </div>

                {/* Notes / Disclaimer */}
                {notes && (
                    <div style={{ marginBottom: 32, padding: "14px 16px", background: "#F8F8F8", borderRadius: 4, border: "1px solid #E5E5E5" }}>
                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888880", marginBottom: 8 }}>Notes</div>
                        <div style={{ fontSize: 10, color: "#4A4A46", lineHeight: 1.6 }}>{notes}</div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ paddingTop: 16, borderTop: "1px solid #E5E5E5", display: "flex", justifyContent: "space-between", fontSize: 9, color: "#888880", marginTop: "auto" }}>
                    <span>Blend Projects Inc. · blendprojects.co</span>
                    <span>{projectCode} · {modelName} · {location}</span>
                </div>
            </div>
        </>
    )
}

function PrintLine({ label, value, bold, large, border }: { label: string; value: number; bold?: boolean; large?: boolean; border?: boolean }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            borderBottom: border ? "2px solid #1C1C1A" : "1px solid #F5F5F5",
            fontSize: large ? 15 : 12,
            fontWeight: bold ? 600 : 400,
            color: "#1C1C1A",
            marginBottom: border ? 8 : 0,
        }}>
            <span>{label}</span>
            <span>{fmt(value)}</span>
        </div>
    )
}
