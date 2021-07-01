import React, { memo } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const UserDialog = ({
  selectedUser,
  setSelectedUser
}) => {
  const config = [
    {
      title: "Name",
      value: selectedUser?.name
    },
    {
      title: "Username",
      value: selectedUser?.username
    },
    {
      title: "email",
      value: selectedUser?.email
    },
    {
      title: "Website",
      value: selectedUser?.website
    },
    {
      title: "Company",
      value: selectedUser?.company?.name
    },
    {
      title: "City",
      value: selectedUser?.address?.city
    },
  ]

  return (
    <Dialog
      open={!!selectedUser}
      onClose={() => setSelectedUser(null)}
    >
      <DialogTitle>User info</DialogTitle>
      <DialogContent>
        {selectedUser && (
          <List className="List">
            {
              config.map(({ title, value }) => (
                <ListItem>
                  <ListItemText primary={title} secondary={value} />
                </ListItem>
              ))
            }
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default memo(UserDialog)
