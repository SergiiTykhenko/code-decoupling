import React, { memo } from 'react'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Body = ({
  sortedPosts,
  setSelectedUser,
  onEditComment,
  editCommentId,
  newComment,
  setNewComment,
  saveComment
}) => {
  return (
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
  )
}

export default memo(Body)
