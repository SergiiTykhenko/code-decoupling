import React, { memo } from 'react'
import get from 'lodash/get'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const Body = ({
  sortedPosts,
  config
}) => {

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
