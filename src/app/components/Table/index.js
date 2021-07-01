import React, {useEffect, useState} from "react";
import axios from "axios";
import MaterialTable from "@material-ui/core/Table";
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

const Table = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios('https://jsonplaceholder.typicode.com/posts')

        setPosts(data)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  return (
    <div className="Table">
      <MaterialTable>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Post title</TableCell>
            <TableCell>Post body</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            posts.map(({id, userId, title, body}) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{userId}</TableCell>
                <TableCell>{title}</TableCell>
                <TableCell>{body}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </MaterialTable>
    </div>
  )
}

export default Table
