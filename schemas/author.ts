export default {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "Name" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "name" } },
    { name: "image", type: "image", title: "Image", options: { hotspot: true } },
    { name: "bio", type: "text", title: "Bio" },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "bio",
      media: "image",
    },
  },
}
