import React, { memo } from 'react'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC'
}

const Header = ({
  sortedBy,
  setSortedBy,
}) => {
  const config = [
    {
      column: 'id',
      title: 'ID',
      sortable: true,
      isNumber: true
    },
    {
      column: 'user.name',
      title: 'Name',
      sortable: true
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
      title: 'Comment',
    },
  ]

  return (
    <TableHead>
      <TableRow>
        {
          config.map(({ column, title, sortable, isNumber }) => (
            <TableCell
              className={`TableCell${sortable ? ' Clickable' : ''}`}
              onClick={() => sortable && setSortedBy(column, isNumber)}
            >
              {title}
              {sortedBy.column === column && (
                sortedBy.direction === 'ASC' ? ` ↑` : ` ↓`
              )}
            </TableCell>
          ))
        }
      </TableRow>
    </TableHead>
  )
}

export default memo(Header)
