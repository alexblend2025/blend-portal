import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const BASE_ID = "appBYDH5PMbXLdaSk"
const TABLE_ID = "tblXlavYH0jNSAFOc"
const FIELDS = {
    projectCode:       "fldJVp47jfkxWuavz",
    clientName:        "fld3jQyPbWrj6oUAa",
    location:          "fld09xLDf0Xd4M5Cb",
    modelName:         "fldbMyMWkIBiQKPZB",
    squareFootage:     "fld3h28UqOp6HM5df",
    roofStyle:         "fldSPej8GSjeIZMWD",
    proposalDate:      "fldrPiEVSzqyhBs8t",
    designPlanningFee: "fldkzPwwOqy51u057",
    kitPrice:          "fldyoPKGu3y8FjW12",
    kitSubtotal:       "fld16YKJkvaUSxytQ",
    construction:      "fldhePKT5o1Zci1fB",
    siteWork:          "fld82YkgBkD5zes5c",
    consulting:        "fldGYzMHnpdtXj00H",
    variableSubtotal:  "fldmoeYVKjSKhRnPD",
    totalCost:         "fld0mGhCl9Mduf1HK",
    phase1Fee:         "fld7R0W3hRsKN4pqo",
    phase2Fee:         "fldyJpgHbIZI4FdYg",
    evergreen1:        "fldCVN71k79PH26m8",
    evergreen2:        "fldbbZl9Y3OXbpvEV",
}

async function getProjectData(projectCode: string) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula={Project Code}="${projectCode}"`
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
        next: { revalidate: 60 },
    })
    const data = await res.json()
    if (!data.records || data.records.length === 0) return null
    return data.records[0].fields
}

export default async function JHWPage() {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const f = await getProjectData("JHW")
    if (!f) return <div style={{ padding: 48, fontFamily: "system-ui" }}>Project data not found.</div>

    const project = {
        clientName:        f["Client Name"] ?? "",
        location:          f["Location"] ?? "",
        modelName:         f["Model Name"] ?? "",
        squareFootage:     f["Square Footage"] ?? "",
        roofStyle:         f["Roof Style"] ?? "",
        proposalDate:      f["Proposal Date"] ?? "",
        designPlanningFee: f["Design Planning Fee"] ?? "",
        kitPrice:          f["Kit Price"] ?? "",
        kitSubtotal:       f["Kit Subtotal"] ?? "",
        construction:      f["Construction"] ?? "",
        siteWork:          f["Site Work"] ?? "",
        consulting:        f["Consulting"] ?? "",
        variableSubtotal:  f["Variable Subtotal"] ?? "",
        totalCost:         f["Total Cost"] ?? "",
        phase1Fee:         f["Phase1 Fee"] ?? "",
        phase2Fee:         f["Phase2 Fee"] ?? "",
        evergreen1:        f["Evergreen1"] ?? "",
        evergreen2:        f["Evergreen2"] ?? "",
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1C1C1A",
        }}>
            {/* Top bar */}
            <div style={{
                background: "#1C1C1A",
                padding: "0 48px",
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#B8986A",
                }}>
                    BLEND PROJECTS
                </span>
                <span style={{
                    fontSize: 11,
                    color: "#888880",
                    letterSpacing: "0.06em",
                }}>
                    {user.emailAddresses[0].emailAddress}
                </span>
            </div>

            <div style={{
                maxWidth: 860,
                margin: "0 auto",
                padding: "64px 48px 96px",
            }}>

                {/* Hero */}
                <div style={{
                    borderBottom: "1px solid #E5E5E5",
                    paddingBottom: 40,
                    marginBottom: 48,
                }}>
                    <div style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#888880",
                        marginBottom: 16,
                    }}>
                        Project Proposal · {project.proposalDate}
                    </div>
                    <h1 style={{
                        fontSize: 42,
                        fontWeight: 300,
                        letterSpacing: "-0.03em",
                        color: "#1C1C1A",
                        marginBottom: 8,
                        lineHeight: 1.1,
                    }}>
                        {project.modelName}
                    </h1>
                    <div style={{
                        fontSize: 16,
                        color: "#888880",
                        fontWeight: 400,
                        marginBottom: 24,
                    }}>
                        {project.clientName} · {project.location}
                    </div>
                    <div style={{
                        display: "inline-block",
                        background: "#1C1C1A",
                        color: "#ffffff",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        padding: "6px 14px",
                        borderRadius: 2,
                    }}>
                        {project.squareFootage} sq ft · {project.roofStyle}
                    </div>
                </div>

                {/* Investment */}
                <div style={{ marginBottom: 56 }}>
                    <div style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#B8986A",
                        marginBottom: 20,
                    }}>
                        Investment Summary
                    </div>

                    {/* Kit costs */}
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#888880",
                        marginBottom: 12,
                        paddingBottom: 8,
                        borderBottom: "1px solid #E5E5E5",
                    }}>
                        Kit Costs
                    </div>
                    {[
                        ["Design and Planning", project.designPlanningFee],
                        ["Blend Kit", project.kitPrice],
                    ].map(([label, value]) => (
                        <div key={label} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 0",
                            borderBottom: "1px solid #F0F0F0",
                            fontSize: 14,
                            color: "#1C1C1A",
                        }}>
                            <span>{label}</span>
                            <span style={{ fontWeight: 500 }}>{value}</span>
                        </div>
                    ))}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "2px solid #1C1C1A",
                        fontSize: 14,
                        fontWeight: 600,
                    }}>
                        <span>Kit Sub-total</span>
                        <span>{project.kitSubtotal}</span>
                    </div>

                    {/* Variable costs */}
                    <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#888880",
                        marginBottom: 12,
                        marginTop: 28,
                        paddingBottom: 8,
                        borderBottom: "1px solid #E5E5E5",
                    }}>
                        Estimated Variable Costs
                    </div>
                    {[
                        ["Construction", project.construction],
                        ["Site Work and Foundation", project.siteWork],
                        ["Consulting and Soft Costs", project.consulting],
                    ].map(([label, value]) => (
                        <div key={label} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 0",
                            borderBottom: "1px solid #F0F0F0",
                            fontSize: 14,
                            color: "#1C1C1A",
                        }}>
                            <span>{label}</span>
                            <span style={{ fontWeight: 500 }}>{value}</span>
                        </div>
                    ))}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "2px solid #1C1C1A",
                        fontSize: 14,
                        fontWeight: 600,
                    }}>
                        <span>Variable Sub-total</span>
                        <span>{project.variableSubtotal}</span>
                    </div>

                    {/* Total */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "20px 0",
                        fontSize: 18,
                        fontWeight: 600,
                        borderBottom: "2px solid #1C1C1A",
                    }}>
                        <span>Total Estimated Cost</span>
                        <span>{project.totalCost}</span>
                    </div>

                    <div style={{
                        marginTop: 16,
                        fontSize: 12,
                        color: "#888880",
                        lineHeight: 1.6,
                    }}>
                        Variable costs are estimates and subject to change based on site conditions, local trade pricing, and final design. Kit pricing will be finalized once design is approved and engineering is complete. Site work and foundation assumes a level, readily accessible building site with standard soil conditions. Rock excavation, significant grade change, or extended servicing runs are not included.
                    </div>
                </div>

                {/* Process */}
                <div style={{ marginBottom: 56 }}>
                    <div style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#B8986A",
                        marginBottom: 20,
                    }}>
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
                        <div key={p.phase} style={{
                            marginBottom: 32,
                            paddingBottom: 32,
                            borderBottom: "1px solid #E5E5E5",
                        }}>
                            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                                <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "#1C1C1A",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontFamily: "monospace",
                                    flexShrink: 0,
                                    marginTop: 2,
                                }}>
                                    {p.phase}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{p.title}</div>
                                    <div style={{ fontSize: 12, color: "#888880", marginBottom: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
                                        <span><b style={{ color: "#1C1C1A", fontWeight: 500 }}>Agreement:</b> {p.agreement}</span>
                                        <span><b style={{ color: "#1C1C1A", fontWeight: 500 }}>Timing:</b> {p.timing}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#888880", marginBottom: 16 }}>
                                        <b style={{ color: "#1C1C1A", fontWeight: 500 }}>Fee:</b> {p.fee}
                                    </div>
                                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0" }}>
                                        {p.includes.map((item) => (
                                            <li key={item} style={{ fontSize: 13, color: "#4A4A46", padding: "4px 0 4px 16px", position: "relative", lineHeight: 1.5 }}>
                                                <span style={{ position: "absolute", left: 0, color: "#B8986A" }}>→</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    {p.gate && (
                                        <div style={{ background: "#F8F8F8", border: "1px solid #E5E5E5", borderRadius: 4, padding: "10px 14px", fontSize: 12, color: "#4A4A46" }}>
                                            <b style={{ color: "#1C1C1A" }}>Decision Gate:</b> {p.gate}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{
                    background: "#1C1C1A",
                    borderRadius: 8,
                    padding: "36px 40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 24,
                }}>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 400, color: "#ffffff", marginBottom: 4 }}>Ready to move forward?</div>
                        <div style={{ fontSize: 13, color: "#888880" }}>Review and sign the proposal agreement below.</div>
                    </div>
                    <a href="#pandadoc" style={{
                        display: "inline-block",
                        background: "#B8986A",
                        color: "#ffffff",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "14px 28px",
                        borderRadius: 4,
                        textDecoration: "none",
                    }}>
                        Review & Sign →
                    </a>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 64,
                    paddingTop: 20,
                    borderTop: "1px solid #E5E5E5",
                    fontSize: 11,
                    color: "#888880",
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <span>Blend Projects Inc.</span>
                    <span>JHW · {project.modelName} · {project.location}</span>
                </div>
            </div>
        </div>
    )
}
