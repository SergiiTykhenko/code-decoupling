import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import get from 'lodash/get'

import TableUI from './TableUI'

const Table = () => {
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [filteredPosts, setFilteredPosts] = useState([])
  const [sortedPosts, setSortedPosts] = useState([])
  const [sortedBy, setSortedBy] = useState({ column: '', direction: 'ASC', isNumber: false })
  const [editCommentId, setEditCommentId] = useState(null)
  const [newComment, setNewComment] = useState('')

  const bodyTextFilter = useSelector(state => state.filters.bodyText)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios('https://jsonplaceholder.typicode.com/posts')

        const userIds = data.reduce((ids, { userId }) =>
          ids.includes(userId) ? ids : [...ids, userId]
        , [])

        const users = await Promise.all(userIds.map(userId => axios(`https://jsonplaceholder.typicode.com/users/${userId}`)))

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

  useEffect(() => {
    if (bodyTextFilter) {
      const newFilteredPosts = posts.filter(({ body }) => body.includes(bodyTextFilter))

      return setFilteredPosts(newFilteredPosts)
    }

    setFilteredPosts(posts)
  }, [bodyTextFilter, posts])

  useEffect(() => {
    const { column, direction, isNumber } = sortedBy

    if (column) {
      const nextSortedPosts = [...filteredPosts].sort((a, b) => {
        if (isNumber) {
          return direction === 'ASC' ? get(a, column) - get(b, column) : get(b, column) - get(a, column)
        }

        return direction === 'ASC'
          ? String(get(a, column)).localeCompare(get(b, column))
          : String(get(b, column)).localeCompare(get(a, column))
      })

      return setSortedPosts(nextSortedPosts)
    }

    setSortedPosts(filteredPosts)
  }, [sortedBy, filteredPosts])

  const saveComment = async (e) => {
    e.stopPropagation()
    const postToUpdate = posts.find(({ id }) => id === editCommentId)

    try {
      const { data: newPost } = await axios.put(`https://jsonplaceholder.typicode.com/posts/${editCommentId}`, {
        ...postToUpdate,
        myComment: newComment
      })

      const updatedPosts = posts.map(post => post.id === editCommentId ? newPost : post)

      setPosts(updatedPosts)
    } catch (err) {
      console.error(err)
    }

    setEditCommentId(null)
    setNewComment('')
  }

  const onEditComment = selectedId => {
    const post = posts.find(({ id }) => id === selectedId)

    setEditCommentId(selectedId)
    setNewComment(post.myComment || '')
  }

  return (
    <TableUI
      setSortedBy={setSortedBy}
      sortedBy={sortedBy}
      sortedPosts={sortedPosts}
      setSelectedUser={setSelectedUser}
      onEditComment={onEditComment}
      editCommentId={editCommentId}
      newComment={newComment}
      setNewComment={setNewComment}
      saveComment={saveComment}
      selectedUser={selectedUser}
    />
  )
}

export default Table
