import React, { memo } from 'react'
import get from 'lodash/get'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const Body = ({
  sortedPosts,
  setSelectedUser,
  onEditComment,
  editCommentId,
  newComment,
  setNewComment,
  saveComment
}) => {
  const config = [
    {
      column: 'id',
    },
    {
      column: 'user.name',
      onClick: ({ user }) => setSelectedUser(user.name)
    },
    {
      column: 'title',
    },
    {
      column: 'body',
    },
    {
      column: 'myComment',
      title: 'Comment',
      onClick: ({ id }) => onEditComment(id),
      renderContent: ({ id, myComment }) => editCommentId === id
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
    },
  ]

  return (
    <TableBody>
      {
        sortedPosts.map(post => (
          <TableRow key={post.id}>
            {config.map(({ column, onClick, renderContent }) => (
              <TableCell
                key={column}
                className={onClick && "Clickable"}
                onClick={() => onClick && onClick(post)}
              >
                {renderContent ? renderContent(post) : get(post, column)}
              </TableCell>
            ))}
          </TableRow>
        ))
      }
    </TableBody>
  )
}

export default memo(Body)
