import React from 'react'
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

const TableUI = ({
  setSortedBy,
  sortedBy,
  sortedPosts,
  setSelectedUser,
  onEditComment,
  editCommentId,
  newComment,
  setNewComment,
  saveComment,
  selectedUser
}) => (
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

export default TableUI
