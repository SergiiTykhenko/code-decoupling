import { useEffect, useState } from "react";
import { fetchPosts, fetchUser } from "./api";

export const useGetPosts = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchPosts()

        const userIds = data.reduce((ids, { userId }) =>
            ids.includes(userId) ? ids : [...ids, userId]
          , [])

        const users = await Promise.all(userIds.map(fetchUser))

        const finalData = data.map(post => ({
          ...post,
          user: users.find(({ data: { id } }) => id === post.userId)?.data
        }))

        setPosts(finalData)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  return [posts, setPosts]
}
