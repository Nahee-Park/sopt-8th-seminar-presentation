import useNasaData from '../hooks/useNasaData';

import EachCard from './Card';

function CardList() {
  const { loading, data, error } = useNasaData();
  return (
    <section
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', justifyContent: 'space-around' }}
    >
      {loading ? (
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
