import type React from "react"
import { SideNav } from "@/components/side-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { VersionSelector } from "@/components/version-selector"
import { UserNav } from "@/components/user-nav"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background px-4 md:px-6">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Docsy.</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <Link
                href="/search"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground md:hidden"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
              <ModeToggle />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <div className="container flex-1">
        <div className="flex-1 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 lg:sticky lg:block lg:py-10">
            <Suspense>
              <SideNav />
            </Suspense>
            <div className="mt-6 px-3">
              <VersionSelector />
            </div>
          </aside>
          <main className="relative py-6 lg:py-10">
            <div className="mx-auto w-full min-w-0">
              <Suspense>
                <MobileNav />
              </Suspense>
              {children}
            </div>
          </main>
        </div>
      </div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Himanshu with ❤.
          </p>
        </div>
      </footer>
    </div>
  )
}
