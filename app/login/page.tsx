"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, login, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // If already logged in as admin, redirect to admin dashboard
    if (mounted && !isLoading && user?.isAdmin) {
      router.push("/admin")
    }
  }, [user, isLoading, router, mounted])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // This is a simple demo - in a real app, you'd validate against a real auth system
    if (password === "admin123") {
      login(true) // Log in as admin
      router.push("/admin")
    } else {
      setError("Invalid password")
    }
    setIsSubmitting(false)
  }

  const handleGuestLogin = () => {
    login(false) // Log in as regular user
    router.push("/docs")
  }

  if (isLoading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your password to access the admin area or continue as a guest.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">For demo purposes, use "admin123" as the password.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login as Admin"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleGuestLogin}>
              Continue as Guest
            </Button>
            <div className="text-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Return to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
