import { client, readOnlyClient } from "./client"

export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(order asc) {
      _id,
      title,
      "slug": slug,
      description,
      icon
    }`,
  )
}

export async function getCategoryBySlug(slug) {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug,
      description,
      icon
    }`,
    { slug },
  )
}

export async function getArticlesByCategory(categoryId, version = null) {
  let filter = `_type == "article" && category._ref == $categoryId`

  if (version) {
    filter += ` && version == $version`
  }

  return client.fetch(
    `*[${filter}] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug,
      summary,
      version,
      publishedAt,
      updatedAt
    }`,
    { categoryId, version },
  )
}

export async function getArticleBySlug(slug) {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug,
      summary,
      content,
      version,
      "category": category->{
        _id,
        title,
        "slug": slug
      },
      "authors": authors[]->{
        _id,
        name,
        bio,
        "image": image.asset->{
          "url": url
        }
      },
      "relatedArticles": relatedArticles[]->{
        _id,
        title,
        "slug": slug,
        "category": category->{
          title,
          "slug": slug
        }
      },
      publishedAt,
      updatedAt
    }`,
    { slug },
  )
}

export async function searchArticles(query, version = null) {
  let filter = `_type == "article" && (
    title match $query + "*" ||
    summary match $query + "*" ||
    pt::text(content) match $query + "*"
  )`

  if (version) {
    filter += ` && version == $version`
  }

  return client.fetch(
    `*[${filter}] {
      _id,
      title,
      "slug": slug,
      summary,
      version,
      "category": category->{
        _id,
        title,
        "slug": slug
      },
      publishedAt,
      updatedAt
    } | order(publishedAt desc)`,
    { query: query.toLowerCase(), version },
  )
}

export async function getVersions() {
  return client.fetch(
    `*[_type == "article"] | order(version desc) {
      "version": version
    } | group by version`,
  )
}

export async function getArticleRating(articleId) {
  const result = await client.fetch(
    `{
      "ratings": *[_type == "rating" && article._ref == $articleId] {
        rating
      },
      "totalRatings": count(*[_type == "rating" && article._ref == $articleId])
    }`,
    { articleId },
  )

  // Calculate average manually since avg() function is not available
  let averageRating = 0;
  if (result.ratings && result.ratings.length > 0) {
    const sum = result.ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    averageRating = sum / result.ratings.length;
  }

  return {
    averageRating: averageRating || 0,
    totalRatings: result.totalRatings || 0,
  }
}

export async function getUserBookmarks(userId) {
  return client.fetch(
    `*[_type == "bookmark" && user == $userId] {
      _id,
      "article": article->{
        _id,
        title,
        "slug": slug,
        summary,
        "category": category->{
          title,
          "slug": slug
        }
      },
      createdAt
    } | order(createdAt desc)`,
    { userId },
  )
}

export async function isArticleBookmarked(userId, articleId) {
  const result = await client.fetch(
    `*[_type == "bookmark" && user == $userId && article._ref == $articleId][0] {
      _id
    }`,
    { userId, articleId },
  )

  return result ? result._id : null
}

export async function getFeedbackAnalytics() {
  return client.fetch(
    `{
      "totalFeedback": count(*[_type == "feedback"]),
      "positiveFeedback": count(*[_type == "feedback" && type == "positive"]),
      "negativeFeedback": count(*[_type == "feedback" && type == "negative"]),
      "feedbackByCategory": *[_type == "category"] {
        _id,
        title,
        "positive": count(*[_type == "feedback" && type == "positive" && references(^._id)]),
        "negative": count(*[_type == "feedback" && type == "negative" && references(^._id)])
      },
      "recentFeedback": *[_type == "feedback"] | order(createdAt desc)[0...10] {
        _id,
        type,
        comment,
        createdAt,
        "article": article->{
          title,
          "slug": slug,
          "category": category->{
            title,
            "slug": slug
          }
        }
      }
    }`,
  )
}

export async function getRatingAnalytics() {
  // We need to modify this query to avoid using avg() function
  // First, get all the basic data
  const basicData = await client.fetch(
    `{
      "totalRatings": count(*[_type == "rating"]),
      "allRatings": *[_type == "rating"] { rating },
      "ratingDistribution": [
        {"rating": 1, "count": count(*[_type == "rating" && rating == 1])},
        {"rating": 2, "count": count(*[_type == "rating" && rating == 2])},
        {"rating": 3, "count": count(*[_type == "rating" && rating == 3])},
        {"rating": 4, "count": count(*[_type == "rating" && rating == 4])},
        {"rating": 5, "count": count(*[_type == "rating" && rating == 5])}
      ],
      "categories": *[_type == "category"] {
        _id,
        title,
        "ratings": *[_type == "rating" && references(^._id)] { rating },
        "totalRatings": count(*[_type == "rating" && references(^._id)])
      },
      "articles": *[_type == "article"] {
        _id,
        title,
        "slug": slug,
        "category": category->{
          title,
          "slug": slug
        },
        "ratings": *[_type == "rating" && article._ref == ^._id] { rating },
        "totalRatings": count(*[_type == "rating" && article._ref == ^._id])
      }
    }`,
  )

  // Calculate overall average rating
  let averageRating = 0;
  if (basicData.allRatings && basicData.allRatings.length > 0) {
    const sum = basicData.allRatings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    averageRating = sum / basicData.allRatings.length;
  }

  // Calculate average ratings for categories
  const ratingsByCategory = basicData.categories.map(category => {
    let avgRating = 0;
    if (category.ratings && category.ratings.length > 0) {
      const sum = category.ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      avgRating = sum / category.ratings.length;
    }
    return {
      _id: category._id,
      title: category.title,
      averageRating: avgRating,
      totalRatings: category.totalRatings
    };
  });

  // Calculate average ratings for articles and sort them
  const articlesWithRatings = basicData.articles.map(article => {
    let avgRating = 0;
    if (article.ratings && article.ratings.length > 0) {
      const sum = article.ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      avgRating = sum / article.ratings.length;
    }
    return {
      ...article,
      averageRating: avgRating
    };
  });

  // Sort articles by average rating and take top 10
  const topRatedArticles = articlesWithRatings
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10)
    .map(article => ({
      _id: article._id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      averageRating: article.averageRating,
      totalRatings: article.totalRatings
    }));

  return {
    totalRatings: basicData.totalRatings,
    averageRating,
    ratingDistribution: basicData.ratingDistribution,
    ratingsByCategory,
    topRatedArticles
  };
}

export async function getAllArticles() {
  return client.fetch(
    `*[_type == "article"] | order(updatedAt desc) {
      _id,
      title,
      "slug": slug,
      summary,
      version,
      "category": category->{
        _id,
        title,
        "slug": slug
      },
      publishedAt,
      updatedAt
    }`,
  )
}

export async function getAllCategories() {
  return client.fetch(
    `*[_type == "category"] | order(order asc) {
      _id,
      title,
      "slug": slug,
      description,
      icon,
      order
    }`,
  )
}

export async function getAllAuthors() {
  return client.fetch(
    `*[_type == "author"] | order(name asc) {
      _id,
      name,
      "slug": slug,
      bio,
      "image": image.asset->{
        "url": url
      }
    }`,
  )
}

export async function getArticleById(id) {
  return client.fetch(
    `*[_type == "article" && _id == $id][0] {
      _id,
      title,
      "slug": slug,
      summary,
      content,
      version,
      "category": category->{
        _id,
        title
      },
      "authors": authors[]->{
        _id,
        name
      },
      "tags": tags,
      "relatedArticles": relatedArticles[]->{
        _id,
        title
      },
      publishedAt,
      updatedAt
    }`,
    { id },
  )
}

export async function getCategoryById(id) {
  return client.fetch(
    `*[_type == "category" && _id == $id][0] {
      _id,
      title,
      "slug": slug,
      description,
      icon,
      order
    }`,
    { id },
  )
}

export async function getAuthorById(id) {
  return client.fetch(
    `*[_type == "author" && _id == $id][0] {
      _id,
      name,
      "slug": slug,
      bio,
      "image": image.asset->{
        "url": url
      }
    }`,
    { id },
  )
}
