import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import MaterialTable from '@material-ui/core/Table'
import Header, { SORT_DIRECTION } from './Header'
import Body from './Body'
import UserDialog from './UserDialog'
import EditComment from './EditComment'
import { filterPosts, sortPosts } from './helpers'
import { fetchPosts, fetchUser, savePost } from './api'

const Table = () => {
  // Lot of states in a single component
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedBy, setSortedBy] = useState({ column: '', direction: SORT_DIRECTION.ASC, isNumber: false })
  const [editCommentId, setEditCommentId] = useState(null)

  const bodyTextFilter = useSelector(state => state.filters.bodyText)

  const config = [
    {
      column: 'id',
      title: 'ID',
      sortable: true,
      isNumber: true
    },
    {
      column: 'user.name',
      title: 'Name',
      sortable: true,
      onClick: ({ user }) => setSelectedUser(user.name)
    },
    {
      column: 'title',
      title: 'Post title',
      sortable: true
    },
    {
      column: 'body',
      title: 'Post body',
      sortable: true
    },
    {
      column: 'myComment',
      title: 'Comment',
      onClick: ({ id }) => setEditCommentId(id),
      renderContent: ({ id, myComment }) => editCommentId === id
        ? <EditComment saveComment={saveComment} />
        : myComment
    },
  ]

  // Untestable and not reusable handlers
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

  const filteredPosts = useMemo(() => filterPosts(posts, bodyTextFilter), [bodyTextFilter, posts])
  const sortedPosts = useMemo(() => sortPosts(filteredPosts, sortedBy), [sortedBy, filteredPosts])

  const saveComment = useCallback(async (newComment) => {
    const postToUpdate = posts.find(({ id }) => id === editCommentId)

    const updatedPost = {
      ...postToUpdate,
      myComment: newComment
    }

    const { data: newPost } = await savePost(updatedPost)
    const updatedPosts = posts.map(post => post.id === editCommentId ? newPost : post)

    setPosts(updatedPosts)
    setEditCommentId(null)
  }, [posts, editCommentId])

  const onEditComment = useCallback((selectedId, myComment) => {
    setEditCommentId(selectedId)
    setNewComment(myComment)
  }, [setEditCommentId])

  return (
    <div className="Table">
      <MaterialTable>
        <Header
          sortedBy={sortedBy}
          setSortedBy={setSortedBy}
          config={config}
        />
        <Body
          sortedPosts={sortedPosts}
          config={config}
        />
      </MaterialTable>
      <UserDialog
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  )
}

export default Table
