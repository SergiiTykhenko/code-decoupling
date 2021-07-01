import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import get from 'lodash/get'
import MaterialTable from '@material-ui/core/Table'
import Header, { SORT_DIRECTION } from './Header'
import Body from './Body'
import UserDialog from './UserDialog'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Table = () => {
  // Lot of states in a single component
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedBy, setSortedBy] = useState({ column: '', direction: SORT_DIRECTION.ASC, isNumber: false })
  const [editCommentId, setEditCommentId] = useState(null)
  const [newComment, setNewComment] = useState('')

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
      onClick: ({ id, myComment }) => onEditComment(id, myComment),
      renderContent: ({ id, myComment }) => editCommentId === id
        ? <>
          <TextField
            value={newComment}
            // Every updated leads to re-render of all Table
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            className="TableCommentSave"
            variant="outlined"
            color="primary"
            onClick={saveComment}
          >
            Save
          </Button>
        </>
        : myComment
    },
  ]

  // Untestable and not reusable handlers
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

  // Handlers still not testable
  const filteredPosts = useMemo(() => {
    if (bodyTextFilter) {
      return posts.filter(({ body }) => body.includes(bodyTextFilter))
    }

    return posts
  }, [bodyTextFilter, posts])

  const sortedPosts = useMemo(() => {
    const { column, direction, isNumber } = sortedBy

    if (column) {
      return [...filteredPosts].sort((a, b) => {
        if (isNumber) {
          return direction === SORT_DIRECTION.ASC ? get(a, column) - get(b, column) : get(b, column) - get(a, column)
        }

        return direction === SORT_DIRECTION.ASC
          ? String(get(a, column)).localeCompare(get(b, column))
          : String(get(b, column)).localeCompare(get(a, column))
      })
    }

    return filteredPosts
  }, [sortedBy, filteredPosts])

  const saveComment = useCallback(async (e) => {
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
  }, [posts, editCommentId, newComment])

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
