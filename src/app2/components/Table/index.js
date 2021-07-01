import React, { useEffect, useState } from 'react'
import axios from 'axios'
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

const Table = () => {
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

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

  return (
    <div className="Table">
      <MaterialTable>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Post title</TableCell>
            <TableCell>Post body</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            posts.map(({id, user, title, body}) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell className="Clickable" onClick={() => setSelectedUser(user)}>{user.name}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{body}</TableCell>
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
