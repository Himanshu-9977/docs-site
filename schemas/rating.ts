export default {
  name: "rating",
  title: "Rating",
  type: "document",
  fields: [
    { name: "article", type: "reference", to: [{ type: "article" }], title: "Article" },
    { name: "rating", type: "number", title: "Rating", validation: (Rule) => Rule.min(1).max(5) },
    { name: "createdAt", type: "datetime", title: "Created At" },
  ],
  preview: {
    select: {
      title: "article.title",
      rating: "rating",
      date: "createdAt",
    },
    prepare({ title, rating, date }) {
      return {
        title: `Rating for: ${title || "Unknown article"}`,
        subtitle: `${rating || 0} stars • ${date ? new Date(date).toLocaleDateString() : "Unknown date"}`,
      }
    },
  },
}
