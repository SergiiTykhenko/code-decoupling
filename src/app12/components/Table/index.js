import React from 'react'
import MaterialTable from '@material-ui/core/Table'
import Header from './Header'
import Body from './Body'
export { SORT_DIRECTION } from './Header'

const Table = ({
  config,
  sortedBy,
  setSortedBy,
  sortedPosts
}) => (
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
)

export default Table
