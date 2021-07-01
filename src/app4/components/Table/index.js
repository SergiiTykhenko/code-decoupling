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
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
    <div className="Table">
      <MaterialTable>
        <TableHead>
          <TableRow>
            <TableCell
              className="TableCell Clickable"
              onClick={() => setSortedBy({
                column: 'id',
                direction: sortedBy.column !== 'id' || sortedBy.direction === 'DESC' ? 'ASC' : 'DESC',
                isNumber: true
              })}
            >
              ID
              {sortedBy.column === 'id' && (
                sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
              )}
            </TableCell>
            <TableCell
              className="TableCell Clickable"
              onClick={() => setSortedBy({
                column:'user.name',
                direction: sortedBy.column !== 'user.name' || sortedBy.direction === 'DESC' ? 'ASC' : 'DESC'
              })}
            >
              Name
              {sortedBy.column === 'user.name' && (
                sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
              )}
            </TableCell>
            <TableCell
              className="TableCell Clickable"
              onClick={() => setSortedBy({
                column: 'title',
                direction: sortedBy.column !== 'title' || sortedBy.direction === 'DESC' ? 'ASC' : 'DESC'
              })}
            >
              Post title
              {sortedBy.column === 'title' && (
                sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
              )}
            </TableCell>
            <TableCell
              className="TableCell Clickable"
              onClick={() => setSortedBy({
                column: 'body',
                direction: sortedBy.column !== 'body' || sortedBy.direction === 'DESC' ? 'ASC' : 'DESC'
              })}
            >
              Post body
              {sortedBy.column === 'body' && (
                sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
              )}
            </TableCell>
            <TableCell className="TableCell">
              Comment
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            sortedPosts.map(({ id, user, title, body, myComment }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell
                  className="Clickable"
                  onClick={() => setSelectedUser(user)}
                >
                  {user.name}
                </TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{body}</TableCell>
                <TableCell
                  className="Clickable"
                  onClick={() => onEditComment(id)}
                >
                  {
                    editCommentId === id
                      ? <>
                          <TextField
                            value={newComment}
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
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </MaterialTable>
      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      >
        <DialogTitle>User info</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <List className="List">
              <ListItem>
                <ListItemText primary="Name" secondary={selectedUser.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Username" secondary={selectedUser.username} />
              </ListItem>
              <ListItem>
                <ListItemText primary="email" secondary={selectedUser.email} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Website" secondary={selectedUser.website} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Company" secondary={selectedUser.company?.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="City" secondary={selectedUser.address?.city} />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Table
