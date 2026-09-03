import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function JHWPage() {
    const user = await currentUser()

    if (!user) {
        redirect("/sign-in")
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F5F0EB",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                textAlign: "center",
                color: "#1C1C1A",
            }}>
                <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#888880",
                    marginBottom: 8,
                }}>
                    BLEND PROJECTS
                </div>
                <h1 style={{
                    fontSize: 28,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    marginBottom: 4,
                }}>
                    JHW Project Portal
                </h1>
                <p style={{
                    fontSize: 13,
                    color: "#888880",
                }}>
                    Welcome, {user.firstName ?? user.emailAddresses[0].emailAddress}
                </p>
            </div>
        </div>
    )
}