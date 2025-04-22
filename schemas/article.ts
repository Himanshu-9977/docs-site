export default {
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Title" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "title" } },
    { name: "category", type: "reference", to: [{ type: "category" }], title: "Category" },
    { name: "summary", type: "text", title: "Summary" },
    {
      name: "content",
      type: "array",
      of: [{ type: "block" }, { type: "code" }, { type: "image", options: { hotspot: true } }],
      title: "Content",
    },
    { name: "version", type: "string", title: "Version" },
    { name: "authors", type: "array", of: [{ type: "reference", to: [{ type: "author" }] }], title: "Authors" },
    { name: "tags", type: "array", of: [{ type: "string" }], title: "Tags" },
    {
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      title: "Related Articles",
    },
    { name: "publishedAt", type: "datetime", title: "Published At" },
    { name: "updatedAt", type: "datetime", title: "Updated At" },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "category.icon",
    },
  },
}
