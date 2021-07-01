import get from 'lodash/get'
import {SORT_DIRECTION} from "../../components/Table";

export const filterPosts = (posts, text) => {
  if (text) {
    return posts.filter(({ body }) => body.includes(text))
  }

  return posts
}

export const sortPosts = (posts, sortedBy) => {
  const { column, direction, isNumber } = sortedBy

  if (column) {
    return [...posts].sort((a, b) => {
      if (isNumber) {
        return direction === SORT_DIRECTION.ASC ? get(a, column) - get(b, column) : get(b, column) - get(a, column)
      }

      return direction === SORT_DIRECTION.ASC
        ? String(get(a, column)).localeCompare(get(b, column))
        : String(get(b, column)).localeCompare(get(a, column))
    })
  }

  return posts
}

export const updatePost = function* (posts, postId, newComment) {
  const postToUpdate = posts.find(({ id }) => id === postId)

  const updatedPost = {
    ...postToUpdate,
    myComment: newComment
  }

  const newPost = yield updatedPost

  return posts.map(post => post.id === postId ? newPost : post)
}
