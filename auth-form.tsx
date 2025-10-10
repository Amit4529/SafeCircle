"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

function isValidIndianPhone(v: string) {
  // +91 followed by 10 digits, allowing optional space after +91
  return /^\+91\s?[1-9]\d{9}$/.test(v.trim())
}

export function AuthForm() {
  const [loginPhone, setLoginPhone] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupFaceVerified, setSignupFaceVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const router = useRouter()

  const loginValid = useMemo(
    () => isValidIndianPhone(loginPhone) && loginPassword.length >= 4,
    [loginPhone, loginPassword],
  )

  const signupValid = useMemo(
    () => isValidIndianPhone(signupPhone) && signupPassword.length >= 4,
    [signupPhone, signupPassword],
  )

  const canSignup = signupValid && signupFaceVerified

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Welcome to SafeCircle</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="login-phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input
                id="login-phone"
                type="tel"
                placeholder="+91 9876543210"
                inputMode="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
              />
              {!isValidIndianPhone(loginPhone) && loginPhone.length > 0 ? (
                <p className="text-xs text-destructive">Enter a valid Indian number starting with +91 and 10 digits.</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" asChild disabled={!loginValid}>
              <Link href="/home" aria-disabled={!loginValid}>
                Login
              </Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/home">Use Face Authentication (mock)</Link>
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="signup-phone" className="text-sm font-medium">
                Phone number
              </Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="+91 9876543210"
                inputMode="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
              />
              {!isValidIndianPhone(signupPhone) && signupPhone.length > 0 ? (
                <p className="text-xs text-destructive">Enter a valid Indian number starting with +91 and 10 digits.</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="signup-password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Button
                type="button"
                variant={signupFaceVerified ? "default" : "outline"}
                onClick={async () => {
                  if (signupFaceVerified) return
                  setVerifying(true)
                  try {
                    // simulate face capture + match
                    await new Promise((r) => setTimeout(r, 1200))
                    setSignupFaceVerified(true)
                  } finally {
                    setVerifying(false)
                  }
                }}
                disabled={signupFaceVerified || verifying}
              >
                {signupFaceVerified ? "Face Verified" : verifying ? "Verifying..." : "Verify Face (mock)"}
              </Button>
              {!signupFaceVerified ? (
                <p className="text-xs text-muted-foreground">Face verification is required to create an account.</p>
              ) : (
                <p className="text-xs text-green-600">Face verification complete.</p>
              )}
            </div>

            <Button
              className="w-full"
              type="button"
              disabled={!canSignup}
              onClick={() => {
                if (!canSignup) return
                // In a real app, submit signup to server here, then navigate
                router.push("/home")
              }}
            >
              Create Account
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
