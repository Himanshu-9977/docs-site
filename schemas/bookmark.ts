export default {
  name: "bookmark",
  title: "Bookmark",
  type: "document",
  fields: [
    { name: "user", type: "string", title: "User ID" },
    { name: "article", type: "reference", to: [{ type: "article" }], title: "Article" },
    { name: "createdAt", type: "datetime", title: "Created At" },
  ],
  preview: {
    select: {
      title: "article.title",
      user: "user",
      date: "createdAt",
    },
    prepare({ title, user, date }) {
      return {
        title: `Bookmark: ${title || "Unknown article"}`,
        subtitle: `User: ${user || "Unknown"} • ${date ? new Date(date).toLocaleDateString() : "Unknown date"}`,
      }
    },
  },
}
