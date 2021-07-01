import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import get from 'lodash/get'
import MaterialTable from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Header from './Header'
import Body from './Body'
import UserDialog from './UserDialog'

const Table = () => {
  // Lot of states in a single component
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedPosts, setSortedPosts] = useState([])
  const [sortedBy, setSortedBy] = useState({ column: '', direction: 'ASC', isNumber: false })
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

  const onEditComment = useCallback(selectedId => {
    const post = posts.find(({ id }) => id === selectedId)

    setEditCommentId(selectedId)
    setNewComment(post.myComment || '')
  }, [posts])

  const sortBy = (column, isNumber) => setSortedBy({
    column,
    direction: sortedBy.column !== column || sortedBy.direction === 'DESC' ? 'ASC' : 'DESC',
    isNumber
  })

  // A lot of JSX that might be split into separate components
  // Copy-pasted components that could be complicated to update in the future
  // JSX contains copy-pasted handlers
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
