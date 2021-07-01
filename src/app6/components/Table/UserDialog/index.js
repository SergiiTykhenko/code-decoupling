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
      name: 'Name',
      value: selectedUser.name
    }
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
  )
}

export default memo(UserDialog)
