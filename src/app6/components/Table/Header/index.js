import React, { memo } from 'react'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const Header = ({
  sortedBy,
  setSortedBy,
}) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          className="TableCell Clickable"
          onClick={() => setSortedBy('id', true)}
        >
          ID
          {sortedBy.column === 'id' && (
            sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
          )}
        </TableCell>
        <TableCell
          className="TableCell Clickable"
          onClick={() => setSortedBy('user.name')}
        >
          Name
          {sortedBy.column === 'user.name' && (
            sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
          )}
        </TableCell>
        <TableCell
          className="TableCell Clickable"
          onClick={() => setSortedBy('title')}
        >
          Post title
          {sortedBy.column === 'title' && (
            sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
          )}
        </TableCell>
        <TableCell
          className="TableCell Clickable"
          onClick={() => setSortedBy('body')}
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
  )
}

export default memo(Header)
