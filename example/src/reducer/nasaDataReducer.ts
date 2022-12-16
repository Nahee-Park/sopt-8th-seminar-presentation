import { useReducer, useEffect } from 'react';

const FETCH_REQUEST = 'FETCH_REQUEST';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAILURE = 'FETCH_FAILURE';

type State = {
  loading: boolean;
  data: Nullable<Array<any>>;
  error: Nullable<Error>;
};

type Action =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_FAILURE'; payload: any };

function nasaDataReducer(state: State, action: Action): State {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        loading: true,
        data: null,
        error: null,
      };
    case FETCH_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_FAILURE:
      return {
        loading: false,
        data: null,
        error: action.payload,
      };
    default:
      return state;
  }
}

export default nasaDataReducer;
