import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import MaterialTable from '@material-ui/core/Table'
import Header, { SORT_DIRECTION } from './Header'
import Body from './Body'
import UserDialog from './UserDialog'
import { filterPosts, sortPosts } from './helpers'
import { savePost } from './api'
import {useGetPosts} from "../../../app11/components/Table/hooks";
import {getConfig} from "../../../app11/components/Table/config";

const Table = () => {
  // Lot of states in a single component
  const [selectedUser, setSelectedUser] = useState(null)
  const [sortedBy, setSortedBy] = useState({ column: '', direction: SORT_DIRECTION.ASC, isNumber: false })
  const [editCommentId, setEditCommentId] = useState(null)

  const bodyTextFilter = useSelector(state => state.filters.bodyText)

  // Untestable and not reusable handlers
  const [posts, setPosts] = useGetPosts()

  const filteredPosts = useMemo(() => filterPosts(posts, bodyTextFilter), [bodyTextFilter, posts])
  const sortedPosts = useMemo(() => sortPosts(filteredPosts, sortedBy), [sortedBy, filteredPosts])

  const saveComment = useCallback(async (newComment) => {
    const postToUpdate = posts.find(({ id }) => id === editCommentId)

    const updatedPost = {
      ...postToUpdate,
      myComment: newComment
    }

    const { data: newPost } = await savePost(updatedPost)

    const updatedPosts = posts.map(post => post.id === editCommentId ? newPost : post)

    setPosts(updatedPosts)
    setEditCommentId(null)
  }, [posts, editCommentId])

  const config = getConfig(
    editCommentId,
    setSelectedUser,
    setEditCommentId,
    saveComment
  )

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
