import { getCategories } from "@/lib/sanity/queries"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DocsPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our documentation to find guides, tutorials, and reference materials.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category._id} className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/docs/${category.slug.current}`}>Browse Articles</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
