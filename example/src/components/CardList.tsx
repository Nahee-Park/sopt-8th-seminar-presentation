import { useEffect, useReducer } from 'react';
import { getNasaData } from '../lib/api';
import nasaDataReducer from '../reducer/nasaDataReducer';
import EachCard from './Card';

function CardList() {
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

  return (
    <section
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', justifyContent: 'space-around' }}
    >
      {state.loading ? (
        <p>로딩중 ...</p>
      ) : (
        <>
          {state.data &&
            state.data?.map((item, idx) => (
              <div key={item?.href}>
                <EachCard
                  imageUrl={item?.links && item?.links[0]?.href}
                  title={item?.data[0]?.title}
                  description={item?.data[0]?.description}
                  dateCreated={item?.data[0]?.date_created}
                  center={item?.data[0]?.center}
                />
              </div>
            ))}
          {state.error && <p>에러 났어요 {state.error.message}</p>}
        </>
      )}
    </section>
  );
}

export default CardList;
