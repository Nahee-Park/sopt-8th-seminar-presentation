import React, { useEffect, useReducer } from 'react';
import { getNasaData } from '../lib/api';
import nasaDataReducer from '../reducer/nasaDataReducer';

function useNasaData() {
  const [state, dispatch] = useReducer(nasaDataReducer, {
    loading: false,
    data: null,
    error: null,
  });
  const getData = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const result = await getNasaData('earth', 1);
      dispatch({ type: 'FETCH_SUCCESS', payload: result.collection.items });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: error });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
  };
}

export default useNasaData;
