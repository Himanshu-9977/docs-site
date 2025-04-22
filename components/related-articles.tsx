import Link from "next/link"

interface RelatedArticlesProps {
  articles: any[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Related Articles</h3>
      <ul className="space-y-2 text-sm">
        {articles.map((article) => (
          <li key={article._id}>
            <Link
              href={`/docs/${article.category.slug.current}/${article.slug.current}`}
              className="inline-block text-muted-foreground transition-colors hover:text-foreground"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
