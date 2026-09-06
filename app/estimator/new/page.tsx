"use client"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"

const C = {
    gold: "#B8986A",
    ink: "#1C1C1A",
    inkMid: "#4A4A46",
    inkMuted: "#888880",
    rule: "#E5E5E5",
    surface: "#F8F8F8",
    white: "#FFFFFF",
    green: "#3DBE7A",
    red: "#E74C3C",
}

function fmt(n: number) {
    return "$" + Math.round(n).toLocaleString("en-CA")
}

export default function EstimatorPage() {
    const [models, setModels] = useState<any[]>([])
    const [kitPricing, setKitPricing] = useState<any[]>([])
    const [constructionRates, setConstructionRates] = useState<any[]>([])
    const [siteConsultingRates, setSiteConsultingRates] = useState<any[]>([])
    const [estimateClasses, setEstimateClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useUser()

    // Selections
    const [selectedModel, setSelectedModel] = useState("")
    const [selectedTier, setSelectedTier] = useState("craft")
    const [selectedRoof, setSelectedRoof] = useState("gable")
    const [selectedClass, setSelectedClass] = useState("E1")
    const [showFloor, setShowFloor] = useState(false)
    const [isCustom, setIsCustom] = useState(false)
    const [customSqFt, setCustomSqFt] = useState("")
    const [addOns, setAddOns] = useState<{name: string, price: number}[]>([])

    // Multipliers
    const [constructionMultiplier, setConstructionMultiplier] = useState(1.0)
    const [siteWorksMultiplier, setSiteWorksMultiplier] = useState(1.0)
    const [consultingMultiplier, setConsultingMultiplier] = useState(1.0)
    const [kitOverride, setKitOverride] = useState("")

    // Client info
    const [clientName, setClientName] = useState("")
    const [saving, setSaving] = useState(false)
    const [requesting, setRequesting] = useState(false)
    const [projectLocation, setProjectLocation] = useState("")
    const [notes, setNotes] = useState("Variable costs are estimates and subject to change based on site conditions, local trade pricing, and final design. Kit pricing will be finalized once design is approved and engineering is complete.\n\nSite work and foundation assumes a level, readily accessible building site with standard soil conditions. Rock excavation, significant grade change, or extended servicing runs are not included.")
    const [projectCode, setProjectCode] = useState("")

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            const [
                { data: m },
                { data: kp },
                { data: cr },
                { data: scr },
                { data: ec },
            ] = await Promise.all([
                supabase.from("models").select("*").order("name"),
                supabase.from("kit_pricing").select("*"),
                supabase.from("construction_rates").select("*"),
                supabase.from("site_consulting_rates").select("*"),
                supabase.from("estimate_classes").select("*").order("variance_pct", { ascending: false }),
            ])
            console.log("models:", m, "kit:", kp, "const:", cr, "sc:", scr, "ec:", ec)
            console.log("EC:", ec, "Models:", m)
            setModels(m ?? [])
            setKitPricing(kp ?? [])
            setConstructionRates(cr ?? [])
            setSiteConsultingRates(scr ?? [])
            setEstimateClasses(ec ?? [])
            const firstReal = m?.find((model: any) => !model.is_custom)
            if (firstReal) setSelectedModel(firstReal.slug)
            setLoading(false)
        }
        fetchData()
    }, [])

    // Derive available options based on selected model
    const currentModel = models.find(m => m.slug === selectedModel)
    const availableTiers = currentModel?.available_tiers?.split(",") ?? ["craft"]
    const availableRoofs = currentModel?.available_roof_styles?.split(",") ?? ["gable"]

    // Find kit pricing row
    const kitRow = kitPricing.find(k =>
        k.model_slug === selectedModel &&
        k.tier === selectedTier &&
        k.roof_style === selectedRoof
    )

    // Find construction rate
    const constRate = constructionRates.find(r =>
        r.tier === selectedTier &&
        r.roof_style === selectedRoof
    )

    // Find site/consulting rates
    const scRate = siteConsultingRates.find(r => r.tier === selectedTier)

    // Find estimate class
    const estClass = estimateClasses.find(e => e.class === selectedClass)

    // Calculate sq ft
    const sqFt = isCustom ? parseFloat(customSqFt) || 0 : currentModel?.sq_ft ?? 0

    // Kit costs
    const kitCostPrime = kitOverride ? parseFloat(kitOverride) : (kitRow?.kit_cost_prime ?? 0)
    const kitCostFloor = kitRow?.kit_cost_floor ?? 0
    const kitCost = showFloor ? kitCostFloor : kitCostPrime
    const dpFee = kitRow?.design_planning_fee ?? 50000

    // Construction
    const baseConstructionRate = constRate?.rate_per_sqft ?? 0
    const adjustedConstructionRate = baseConstructionRate * constructionMultiplier
    const constructionCost = adjustedConstructionRate * sqFt

    // Base subtotal
    const baseSubtotal = dpFee + kitCost + constructionCost

    // Site works
    const baseSiteRate = scRate?.site_works_rate ?? 0.15
    const adjustedSiteRate = baseSiteRate * siteWorksMultiplier
    const siteWorksCost = adjustedSiteRate * baseSubtotal

    // Consulting
    const baseConsultingRate = scRate?.consulting_rate ?? 0.05
    const adjustedConsultingRate = baseConsultingRate * consultingMultiplier
    const consultingCost = adjustedConsultingRate * baseSubtotal

    // Total
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0)
    const total = baseSubtotal + siteWorksCost + consultingCost + addOnsTotal

    // Variance
    const variance = estClass?.variance_pct ?? 30
    const totalLow = total * (1 - variance / 100)
    const totalHigh = total * (1 + variance / 100)

    function addAddOn() {
        setAddOns(prev => [...prev, { name: "", price: 0 }])
    }
    
    function updateAddOn(index: number, field: "name" | "price", value: string) {
        setAddOns(prev => prev.map((a, i) => i === index ? { ...a, [field]: field === "price" ? parseFloat(value) || 0 : value } : a))
    }
    
    function removeAddOn(index: number) {
        setAddOns(prev => prev.filter((_, i) => i !== index))
    }
    
    // Floor pricing feeds baseSubtotal, which in turn drives site works,
    // consulting and the total — so saving while it's held would persist
    // internal numbers, not just show them.
    function blockedByFloorView() {
        if (!showFloor) return false
        alert("Release the Floor view before saving — floor pricing is internal only.")
        return true
    }

    async function saveToAirtable() {
        if (blockedByFloorView()) return
        setSaving(true)
        const fields: any = {
            "Project Code": projectCode,
            "Client Name": clientName,
            "Location": projectLocation,
            "Model Name": currentModel?.name ?? "Custom",
            "Square Footage": sqFt.toString(),
            "Tier": selectedTier,
            "Roof Style": selectedRoof,
            "Estimate Class": selectedClass,
            "Kit Cost Prime": kitCostPrime,
            "Kit Cost Floor": kitCostFloor,
            "Construction Cost": constructionCost,
            "Site Works Cost": siteWorksCost,
            "Consulting Cost": consultingCost,
            "Total Estimate": total,
            "Low Range": totalLow,
            "High Range": totalHigh,
            "Construction Multiplier": constructionMultiplier,
            "Site Works Multiplier": siteWorksMultiplier,
            "Consulting Multiplier": consultingMultiplier,
            "Notes": notes,
            "Status": "draft",
            "Created At": new Date().toISOString().split("T")[0],
            "Created By": user?.emailAddresses[0]?.emailAddress ?? "",
            "Add Ons": JSON.stringify(addOns),
        }
        if (kitOverride) fields["Kit Override"] = parseFloat(kitOverride)
    
        const res = await fetch(`https://api.airtable.com/v0/appBYDH5PMbXLdaSk/tblPhWiFcCrFFF8Yq`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fields }),
        })
    
        if (res.ok) {
            window.location.href = "/estimator"
        } else {
            alert("Save failed — check console for details")
            console.error(await res.json())
        }
        setSaving(false)
    }

    async function requestApproval() {
    if (blockedByFloorView()) return
    setRequesting(true)
    
    // First save the proposal
    const saveRes = await fetch(`https://api.airtable.com/v0/appBYDH5PMbXLdaSk/tblPhWiFcCrFFF8Yq`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fields: {
                "Project Code": projectCode,
                "Client Name": clientName,
                "Location": projectLocation,
                "Model Name": currentModel?.name ?? "Custom",
                "Square Footage": sqFt.toString(),
                "Tier": selectedTier,
                "Roof Style": selectedRoof,
                "Estimate Class": selectedClass,
                "Kit Cost Prime": kitCostPrime,
                "Kit Cost Floor": kitCostFloor,
                "Construction Cost": constructionCost,
                "Site Works Cost": siteWorksCost,
                "Consulting Cost": consultingCost,
                "Total Estimate": total,
                "Low Range": totalLow,
                "High Range": totalHigh,
                "Construction Multiplier": constructionMultiplier,
                "Site Works Multiplier": siteWorksMultiplier,
                "Consulting Multiplier": consultingMultiplier,
                "Notes": notes,
                "Status": "pending",
            }
        }),
    })

    if (!saveRes.ok) {
        alert("Save failed")
        setRequesting(false)
        return
    }

    const saveData = await saveRes.json()
    const recordId = saveData.id

    const approvalRes = await fetch("https://alexpym.app.n8n.cloud/webhook/proposal-approval-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recordId,
            projectCode,
            clientName,
            location: projectLocation,
            modelName: currentModel?.name ?? "Custom",
            estimateClass: selectedClass,
            totalEstimate: `$${Math.round(total).toLocaleString("en-CA")}`,
            requestedBy: user?.emailAddresses[0]?.emailAddress ?? "",
            portalLink: `https://portal.blendprojects.co/estimator/${recordId}`,
        }),
    })

    if (approvalRes.ok) {
        window.location.href = "/estimator"
    } else {
        alert("Approval request failed")
    }
    setRequesting(false)
}

if (loading) return <div>Loading...</div>

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
                Project Estimator
            </span>
        </div>

        <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px 96px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "start" }}>

            {/* Left — inputs */}
            <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8 }}>Blend Toolbox</div>
                <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", marginBottom: 32 }}>Project Estimator</h1>

                {/* Client Info */}
                <Section title="Client Information">
                    <Field label="Project Code">
                        <input value={projectCode} onChange={e => setProjectCode(e.target.value.toUpperCase())} placeholder="e.g. JHW" maxLength={5} style={inputStyle} />
                    </Field>
                    <Field label="Client Name">
                        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Morné Van Antwerp" style={inputStyle} />
                    </Field>
                    <Field label="Project Location">
                        <input value={projectLocation} onChange={e => setProjectLocation(e.target.value)} placeholder="e.g. Halifax, NS" style={inputStyle} />
                    </Field>
                </Section>

                {/* Model Selection */}
                <Section title="Model">
                    <Field label="Model">
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <select
                                value={isCustom ? "custom" : selectedModel}
                                onChange={e => {
                                    if (e.target.value === "custom") {
                                        setIsCustom(true)
                                        setSelectedModel("custom")
                                    } else {
                                        setIsCustom(false)
                                        setSelectedModel(e.target.value)
                                    }
                                }}
                                style={inputStyle}
                            >
                                {models.filter(m => !m.is_custom).map(m => (
                                    <option key={m.slug} value={m.slug}>{m.name} — {m.sq_ft} sq ft</option>
                                ))}
                                <option value="custom">Custom Size</option>
                            </select>
                        </div>
                    </Field>
                    {isCustom && (
                        <Field label="Custom Square Footage">
                            <input type="number" value={customSqFt} onChange={e => setCustomSqFt(e.target.value)} placeholder="e.g. 1400" style={inputStyle} />
                        </Field>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Field label="Tier">
                            <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)} style={inputStyle}>
                                {availableTiers.map((t: string) => (
                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Roof Style">
                            <select value={selectedRoof} onChange={e => setSelectedRoof(e.target.value)} style={inputStyle}>
                                {availableRoofs.map((r: string) => (
                                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </Section>

                {/* Estimate Class */}
                <Section title="Estimate Class">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                        {estimateClasses.map(ec => (
                            <button
                                key={ec.class}
                                onClick={() => setSelectedClass(ec.class)}
                                style={{
                                    padding: "10px 4px",
                                    borderRadius: 4,
                                    border: `1px solid ${selectedClass === ec.class ? C.ink : C.rule}`,
                                    background: selectedClass === ec.class ? C.ink : C.white,
                                    color: selectedClass === ec.class ? C.white : C.inkMid,
                                    cursor: "pointer",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontFamily: "system-ui, sans-serif",
                                }}
                            >
                                {ec.class}
                                <div style={{ fontSize: 9, fontWeight: 400, marginTop: 2, color: selectedClass === ec.class ? "#888880" : C.inkMuted }}>±{ec.variance_pct}%</div>
                            </button>
                        ))}
                    </div>
                    {estClass && (
                        <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 8 }}>{estClass.label} — {estClass.description}</div>
                    )}
                </Section>

                {/* Adjustments */}
                <Section title="Regional & CEO Adjustments">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <Field label="Construction ×">
                            <input type="number" step="0.05" value={constructionMultiplier} onChange={e => setConstructionMultiplier(parseFloat(e.target.value) || 1)} style={inputStyle} />
                        </Field>
                        <Field label="Site Works ×">
                            <input type="number" step="0.05" value={siteWorksMultiplier} onChange={e => setSiteWorksMultiplier(parseFloat(e.target.value) || 1)} style={inputStyle} />
                        </Field>
                        <Field label="Consulting ×">
                            <input type="number" step="0.05" value={consultingMultiplier} onChange={e => setConsultingMultiplier(parseFloat(e.target.value) || 1)} style={inputStyle} />
                        </Field>
                    </div>
                    <Field label="Kit Cost Override (leave blank to use pricing table)">
                        <input type="number" value={kitOverride} onChange={e => setKitOverride(e.target.value)} placeholder={fmt(kitCostPrime)} style={inputStyle} />
                    </Field>
                </Section>

                {/* Notes */}
                <Section title="Add Ons">
                    {addOns.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                value={a.name}
                                onChange={e => updateAddOn(i, "name", e.target.value)}
                                placeholder="e.g. Deck, Garage, Carport"
                                style={{ ...inputStyle, flex: 2 }}
                            />
                            <input
                                type="number"
                                value={a.price || ""}
                                onChange={e => updateAddOn(i, "price", e.target.value)}
                                placeholder="$0"
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                                onClick={() => removeAddOn(i)}
                                style={{ padding: "10px 12px", background: "none", border: `1px solid ${C.rule}`, borderRadius: 4, cursor: "pointer", color: C.inkMuted, fontFamily: "system-ui, sans-serif", fontSize: 13 }}>
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addAddOn}
                        style={{ padding: "10px 14px", background: "none", border: `1px solid ${C.rule}`, borderRadius: 4, cursor: "pointer", color: C.inkMid, fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                        + Add Item
                    </button>
                </Section>
                
                <Section title="Notes">
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any assumptions, site conditions, or context for this estimate…" rows={4} style={{ ...inputStyle, resize: "vertical" as const }} />
                </Section>
                
            </div>

            {/* Right — estimate output */}
            <div style={{ position: "sticky", top: 72 }}>
                <div style={{ border: `1px solid ${C.rule}`, borderRadius: 8, overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ background: C.ink, padding: "20px 24px" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 4 }}>
                            {selectedClass} — {estClass?.label}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 300, color: C.white }}>
                            {clientName || "New Project"}
                        </div>
                        {projectLocation && <div style={{ fontSize: 12, color: "#888880", marginTop: 2 }}>{projectLocation}</div>}
                        <div style={{ fontSize: 11, color: "#888880", marginTop: 4 }}>
                            {currentModel?.name ?? "Custom"} · {sqFt} sq ft · {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} · {selectedRoof.charAt(0).toUpperCase() + selectedRoof.slice(1)}
                        </div>
                    </div>

                    {/* Floor toggle */}
                    <div style={{ padding: "12px 24px", background: C.surface, borderBottom: `1px solid ${C.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: C.inkMuted }}>Floor pricing · internal only</span>
                        {/* Momentary: floor pricing is only ever visible while held, so it
                            can't be left on and saved into an estimate. */}
                        <button
                            onMouseDown={() => setShowFloor(true)}
                            onMouseUp={() => setShowFloor(false)}
                            onMouseLeave={() => setShowFloor(false)}
                            onTouchStart={() => setShowFloor(true)}
                            onTouchEnd={() => setShowFloor(false)}
                            onTouchCancel={() => setShowFloor(false)}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setShowFloor(true) }}
                            onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") setShowFloor(false) }}
                            onBlur={() => setShowFloor(false)}
                            onContextMenu={(e) => e.preventDefault()}
                            style={{
                                padding: "4px 12px",
                                borderRadius: 20,
                                border: `1px solid ${showFloor ? C.ink : C.rule}`,
                                background: showFloor ? C.ink : C.white,
                                color: showFloor ? C.white : C.inkMid,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "system-ui, sans-serif",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                touchAction: "none",
                            }}
                        >
                            {showFloor ? "Floor" : "Hold for Floor"}
                        </button>
                    </div>

                    {/* Line items */}
                    <div style={{ padding: "20px 24px" }}>
                        {/* Grouped to match the client proposal and PDF: Construction is a
                            variable cost to the client, even though it sits inside
                            baseSubtotal for the percentage calculations below. */}
                        <EstGroupLabel first>Kit Costs</EstGroupLabel>
                        <EstLine label="Design & Planning" value={dpFee} />
                        <EstLine label="Kit Cost" value={kitCost} sub={showFloor ? "Floor pricing" : "Prime pricing"} />
                        <div style={{ borderTop: `1px solid ${C.rule}`, margin: "8px 0" }} />
                        <EstLine label="Kit Sub-total" value={dpFee + kitCost} bold />

                        <EstGroupLabel>Estimated Variable Costs</EstGroupLabel>
                        <EstLine label={`Construction (${fmt(adjustedConstructionRate)}/sqft)`} value={constructionCost} />
                        <EstLine label={`Site Works (${(adjustedSiteRate * 100).toFixed(1)}%)`} value={siteWorksCost} />
                        <EstLine label={`Consulting (${(adjustedConsultingRate * 100).toFixed(1)}%)`} value={consultingCost} />
                        {addOns.filter(a => a.price > 0).map((a, i) => (
                            <EstLine key={i} label={a.name || "Add On"} value={a.price} />
                        ))}
                        <div style={{ borderTop: `1px solid ${C.rule}`, margin: "8px 0" }} />
                        <EstLine label="Variable Sub-total" value={constructionCost + siteWorksCost + consultingCost + addOnsTotal} bold />

                        <div style={{ marginTop: 10 }}>
                            <EstLine label="Base Subtotal" value={baseSubtotal} muted sub="D&P + Kit + Construction · the % rates above apply to this" />
                        </div>

                        <div style={{ borderTop: `2px solid ${C.ink}`, margin: "12px 0" }} />
                        <EstLine label="Total Estimate" value={total} bold large />

                        {/* Variance range */}
                        <div style={{ marginTop: 16, padding: "12px 16px", background: C.surface, borderRadius: 6, border: `1px solid ${C.rule}` }}>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, marginBottom: 8 }}>
                                ±{variance}% Range
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                                <span style={{ color: C.inkMuted }}>Low</span>
                                <span style={{ fontWeight: 600 }}>{fmt(totalLow)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
                                <span style={{ color: C.inkMuted }}>High</span>
                                <span style={{ fontWeight: 600 }}>{fmt(totalHigh)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.rule}`, display: "grid", gap: 8 }}>
                        <button
                            onClick={saveToAirtable}
                            disabled={saving}
                            style={{ width: "100%", padding: "12px", background: saving ? C.inkMuted : C.surface, color: C.ink, border: `1px solid ${C.rule}`, borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: saving ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif" }}>
                            {saving ? "Saving…" : "Save Draft"}
                        </button>
                        <button
                            onClick={requestApproval}
                            disabled={requesting}
                            style={{ width: "100%", padding: "12px", background: requesting ? C.inkMuted : C.gold, color: C.white, border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: requesting ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif" }}>
                            {requesting ? "Requesting…" : "Request Approval →"}
                        </button>
                        <button style={{ width: "100%", padding: "12px", background: C.white, color: C.inkMuted, border: `1px solid ${C.rule}`, borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, cursor: "not-allowed", fontFamily: "system-ui, sans-serif" }} disabled>
                            Push to Project (requires approval)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
return (
    <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: C.gold, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${C.rule}` }}>
            {title}
        </div>
        <div style={{ display: "grid", gap: 16 }}>
            {children}
        </div>
    </div>
)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
return (
    <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.inkMuted, marginBottom: 6, letterSpacing: "0.04em" }}>{label}</div>
        {children}
    </div>
)
}

function EstGroupLabel({ children, first }: { children: React.ReactNode; first?: boolean }) {
return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.inkMuted, paddingBottom: 6, marginBottom: 8, marginTop: first ? 0 : 20, borderBottom: `1px solid ${C.rule}` }}>
        {children}
    </div>
)
}

function EstLine({ label, value, sub, bold, large, muted }: { label: string; value: number; sub?: string; bold?: boolean; large?: boolean; muted?: boolean }) {
const size = large ? 15 : muted ? 11 : 13
const color = muted ? C.inkMuted : C.ink
return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: muted ? "3px 0" : "5px 0" }}>
        <div>
            <div style={{ fontSize: size, fontWeight: bold ? 600 : 400, color }}>{label}</div>
            {sub && <div style={{ fontSize: 10, color: C.inkMuted, marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: size, fontWeight: bold ? 600 : 400, color, flexShrink: 0 }}>{fmt(value)}</div>
    </div>
)
}

const inputStyle: React.CSSProperties = {
width: "100%",
padding: "10px 12px",
fontSize: 13,
border: `1px solid ${C.rule}`,
borderRadius: 4,
background: C.surface,
color: C.ink,
outline: "none",
fontFamily: "system-ui, sans-serif",
boxSizing: "border-box",
}