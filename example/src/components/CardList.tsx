import React, { useEffect, useState } from 'react';
import { getNasaData } from '../lib/api';
import EachCard from './Card';

function CardList() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<null | Array<any>>(null);
  const [error, setError] = useState<Nullable<Error>>(null);

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await getNasaData('earth', 1);
      setData(result.collection.items);
      setIsLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <section
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', justifyContent: 'space-around' }}
    >
      {isLoading ? (
        <p>로딩중 ...</p>
      ) : (
        <>
          {data &&
            data?.map((item, idx) => (
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
          {error && <p>에러 났어요 {error.message}</p>}
        </>
      )}
    </section>
  );
}

export default CardList;
