import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#F5F0EB",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <SignIn />
        </div>
    )
}