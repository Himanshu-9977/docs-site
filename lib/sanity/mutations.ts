import { client } from "./client"

export async function submitFeedback(data) {
  return client.create({
    _type: "feedback",
    article: {
      _type: "reference",
      _ref: data.articleId,
    },
    type: data.type,
    comment: data.comment,
    user: data.userId, // Store the user ID (can be temporary or logged in)
    createdAt: new Date().toISOString(),
  })
}

export async function submitRating(data) {
  return client.create({
    _type: "rating",
    article: {
      _type: "reference",
      _ref: data.articleId,
    },
    rating: data.rating,
    user: data.userId, // Store the user ID (can be temporary or logged in)
    createdAt: new Date().toISOString(),
  })
}

export async function addBookmark(data) {
  return client.create({
    _type: "bookmark",
    user: data.userId,
    article: {
      _type: "reference",
      _ref: data.articleId,
    },
    createdAt: new Date().toISOString(),
  })
}

export async function removeBookmark(bookmarkId) {
  return client.delete(bookmarkId)
}
