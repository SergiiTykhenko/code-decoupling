import React from "react";
import EditComment from "./EditComment";

export const getConfig = (
  editCommentId,
  setSelectedUser,
  setEditCommentId,
  saveComment
) => [
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
