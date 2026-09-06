import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ProjectHub from "../../components/ProjectHub/hub"

const BASE_ID = "appBYDH5PMbXLdaSk"
const TABLE_ID = "tblXlavYH0jNSAFOc"

async function getProjectData(projectCode: string) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula={Project Code}="${projectCode.toUpperCase()}"`
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
        next: { revalidate: 60 },
    })
    const data = await res.json()
    if (!data.records || data.records.length === 0) return null
    return data.records[0].fields
}

export default async function ProjectPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params
    const user = await currentUser()
    if (!user) redirect("/sign-in")

    const userEmail = user.emailAddresses[0].emailAddress.toLowerCase()
    const f = await getProjectData(code)

    if (!f) return (
        <div style={{ padding: 48, fontFamily: "system-ui" }}>Project not found.</div>
    )

    const allowedEmails = (f["Allowed Emails"] ?? "")
        .split(",")
        .map((e: string) => e.trim().toLowerCase())

    if (!allowedEmails.includes(userEmail)) redirect("/")

    const activeStages = (f["Active Stages"] ?? "")
        .split(",")
        .map((s: string) => s.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-"))

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
        contractLink:      f["Contract Link"] ?? "",
        addOns:             f["Add Ons"] ?? "",
    }

    return (
        <ProjectHub
            project={project}
            userEmail={userEmail}
            activeStages={activeStages}
            projectCode={code.toUpperCase()}
            modelName={project.modelName}
        />
    )
}
