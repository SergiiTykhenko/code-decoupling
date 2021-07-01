import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import get from 'lodash/get'
import MaterialTable from '@material-ui/core/Table'
import Header, { SORT_DIRECTION } from './Header'
import Body from './Body'
import UserDialog from './UserDialog'

const Table = () => {
  // Lot of states in a single component
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedBy, setSortedBy] = useState({ column: '', direction: SORT_DIRECTION.ASC, isNumber: false })
  const [editCommentId, setEditCommentId] = useState(null)
  const [newComment, setNewComment] = useState('')

  const bodyTextFilter = useSelector(state => state.filters.bodyText)

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

  // Effects that are setting inner state lead to unnecessary renders
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

  // Handlers causing not needed renders
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

  const sortBy = (column, isNumber) => setSortedBy({
    column,
    direction: sortedBy.column !== column || sortedBy.direction === SORT_DIRECTION.DESC
      ? SORT_DIRECTION.ASC
      : SORT_DIRECTION.DESC,
    isNumber
  })

  return (
    <div className="Table">
      <MaterialTable>
        <Header
          sortedBy={sortedBy}
          setSortedBy={sortBy}
        />
        <Body
          sortedPosts={sortedPosts}
          setSelectedUser={setSelectedUser}
          onEditComment={onEditComment}
          editCommentId={editCommentId}
          newComment={newComment}
          setNewComment={setNewComment}
          saveComment={saveComment}
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
