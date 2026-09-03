import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

const BASE_ID = "appBYDH5PMbXLdaSk"
const TABLE_ID = "tblXlavYH0jNSAFOc"

async function getAllProjects() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
        next: { revalidate: 60 },
    })
    const data = await res.json()
    if (!data.records) return []
    return data.records.map((r: any) => ({
        id: r.id,
        projectCode:   r.fields["Project Code"] ?? "",
        clientName:    r.fields["Client Name"] ?? "",
        location:      r.fields["Location"] ?? "",
        modelName:     r.fields["Model Name"] ?? "",
        description:   r.fields["Description"] ?? "",
        status:        r.fields["Status"] ?? "",
        allowedEmails: r.fields["Allowed Emails"] ?? "",
    }))
}

export default async function HomePage() {
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const userEmail = user.emailAddresses[0].emailAddress.toLowerCase()
    const allProjects = await getAllProjects()

    const accessibleProjects = allProjects.filter((p: any) => {
        const emails = p.allowedEmails
            .split(",")
            .map((e: string) => e.trim().toLowerCase())
        return emails.includes(userEmail)
    })

    return (
        <div style={{
            minHeight: "100vh",
            background: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1C1C1A",
        }}>
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
                    {userEmail}
                </span>
            </div>

            <div style={{
                maxWidth: 860,
                margin: "0 auto",
                padding: "64px 48px 96px",
            }}>
                <div style={{
                    borderBottom: "1px solid #E5E5E5",
                    paddingBottom: 32,
                    marginBottom: 48,
                }}>
                    <div style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#888880",
                        marginBottom: 12,
                    }}>
                        Client Portal
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 300,
                        letterSpacing: "-0.03em",
                        color: "#1C1C1A",
                        marginBottom: 8,
                        lineHeight: 1.1,
                    }}>
                        Your Projects
                    </h1>
                    <p style={{
                        fontSize: 14,
                        color: "#888880",
                        margin: 0,
                    }}>
                        Welcome{user.firstName ? `, ${user.firstName}` : ""}. Select a project below to view your proposal and journey.
                    </p>
                </div>

                {accessibleProjects.length === 0 ? (
                    <div style={{
                        padding: "48px 0",
                        textAlign: "center",
                        fontSize: 14,
                        color: "#888880",
                    }}>
                        No projects found for your account. Contact your Blend project manager if you think this is an error.
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 16 }}>
                        {accessibleProjects.map((p: any) => (
                            <Link
                                key={p.id}
                                href={`/project/${p.projectCode.toLowerCase()}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div style={{
                                    border: "1px solid #E5E5E5",
                                    borderRadius: 8,
                                    padding: "28px 32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 24,
                                    cursor: "pointer",
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            marginBottom: 8,
                                        }}>
                                            <div style={{
                                                fontSize: 10,
                                                fontWeight: 600,
                                                letterSpacing: "0.14em",
                                                textTransform: "uppercase",
                                                color: "#ffffff",
                                                background: "#1C1C1A",
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
                                                    textTransform: "uppercase",
                                                    color: "#B8986A",
                                                    border: "1px solid #B8986A",
                                                    padding: "3px 8px",
                                                    borderRadius: 2,
                                                }}>
                                                    {p.status}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: 20,
                                            fontWeight: 400,
                                            color: "#1C1C1A",
                                            marginBottom: 4,
                                        }}>
                                            {p.modelName}
                                        </div>
                                        <div style={{
                                            fontSize: 13,
                                            color: "#888880",
                                        }}>
                                            {p.clientName} · {p.location}
                                        </div>
                                        {p.description && (
                                            <div style={{
                                                fontSize: 12,
                                                color: "#888880",
                                                marginTop: 8,
                                            }}>
                                                {p.description}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: 20,
                                        color: "#888880",
                                        flexShrink: 0,
                                    }}>
                                        →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

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
                    <span>blendprojects.co</span>
                </div>
            </div>
        </div>
    )
}
