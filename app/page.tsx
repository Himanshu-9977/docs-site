import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"
import { getCategories } from "@/lib/sanity/queries"
import { UserNav } from "@/components/user-nav"


export default async function Home() {
  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background px-4 md:px-6">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Docsy</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Link
                href="/search"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground"
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
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 px-4 md:px-8 lg:px-32">
          <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-full break-words">Docsy</h1>
            <p className="max-w-full md:max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
              Find comprehensive guides and documentation to help you start working with our product as quickly as
              possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:space-x-4 w-full sm:w-auto mt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/docs">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/search">Search</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-full sm:max-w-[58rem] flex-col items-center space-y-4 text-center px-4 sm:px-6">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl max-w-full break-words">Categories</h2>
            <p className="max-w-full sm:max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Browse our documentation by category to find what you need.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 grid-cols-1 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 px-4 sm:px-6">
            {categories.map((category) => (
              <div key={category._id} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6">
                  <div className="space-y-2">
                    <h3 className="font-bold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{category.description}</p>
                  </div>
                  <Link
                    href={`/docs/${category.slug.current}`}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 mt-4"
                  >
                    View Articles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Himanshu with ❤.
          </p>
        </div>
      </footer>
    </div>
  )
}
