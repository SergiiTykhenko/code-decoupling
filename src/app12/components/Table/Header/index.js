import React, {memo} from 'react'
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
  config
}) => {
  const sortBy = (column, isNumber) => setSortedBy({
    column,
    direction: sortedBy.column !== column || sortedBy.direction === SORT_DIRECTION.DESC
      ? SORT_DIRECTION.ASC
      : SORT_DIRECTION.DESC,
    isNumber
  })

  return (
    <TableHead>
      <TableRow>
        {
          config.map(({ column, title, sortable, isNumber }) => (
            <TableCell
              key={column}
              className={`TableCell${sortable ? ' Clickable' : ''}`}
              onClick={() => sortable && sortBy(column, isNumber)}
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
