const initialState = {
  bodyText: ''
}

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'BODY_TEXT':
      return {
        ...state,
        bodyText: action.bodyText
      }

    default:
      return state
  }
}

export default reducers
