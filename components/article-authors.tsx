import Image from "next/image"

interface ArticleAuthorsProps {
  authors: any[]
}

export function ArticleAuthors({ authors }: ArticleAuthorsProps) {
  if (!authors || authors.length === 0) {
    return null
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-lg font-medium">Written by</h3>
      <div className="mt-4 flex flex-wrap gap-4">
        {authors.map((author) => (
          <div key={author._id} className="flex items-center space-x-3">
            {author.image && (
              <Image
                src={author.image.url || "/placeholder.svg"}
                alt={author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{author.name}</p>
              {author.bio && <p className="text-sm text-muted-foreground">{author.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
