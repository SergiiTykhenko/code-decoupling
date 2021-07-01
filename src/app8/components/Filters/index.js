import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import TextField from '@material-ui/core/TextField'

import { setBodyTextFilter } from "../../actions";

const Index = () => {
  const dispatch = useDispatch()
  const bodyText = useSelector(state => state.filters.bodyText)

  return (
    <div className="Filters">
      <TextField
        label="Body text"
        value={bodyText}
        onChange={(e) => dispatch(setBodyTextFilter(e.target.value))}
      />
    </div>
  )
}

export default Index
