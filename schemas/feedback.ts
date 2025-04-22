export default {
  name: "feedback",
  title: "Feedback",
  type: "document",
  fields: [
    { name: "article", type: "reference", to: [{ type: "article" }], title: "Article" },
    { name: "type", type: "string", title: "Type", options: { list: ["positive", "negative"] } },
    { name: "comment", type: "text", title: "Comment" },
    { name: "createdAt", type: "datetime", title: "Created At" },
  ],
  preview: {
    select: {
      title: "article.title",
      subtitle: "comment",
      description: "type",
    },
    prepare({ title, subtitle, description }) {
      return {
        title: `Feedback on: ${title || "Unknown article"}`,
        subtitle: subtitle || "No comment",
        description: `Type: ${description || "Unknown"}`,
      }
    },
  },
}
