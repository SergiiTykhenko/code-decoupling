import React, { memo, useState } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const EditComment = ({ saveComment }) => {
  const [newComment, setNewComment] = useState('')

  return (
    <>
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button
        className="TableCommentSave"
        variant="outlined"
        color="primary"
        onClick={(e) => {
          e.stopPropagation()
          saveComment(newComment)
        }}
      >
        Save
      </Button>
    </>
  )
}

export default memo(EditComment)
