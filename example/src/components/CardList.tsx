import { Suspense } from 'react';
import { fetchNasaData } from '../lib/api';

import EachCard from './Card';
import ErrorBoundary from './common/ErrorBoundary';

function CardList() {
  return (
    <ErrorBoundary renderFallback={({ error, reset }) => <p>에러 났어요 {error?.message}</p>}>
      <Suspense fallback={<p>로딩중 ...</p>}>
        <Resolved resource={fetchNasaData('earth', 1)} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Resolved({ resource }: any) {
  const data = resource.read();

  return (
    <section
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', justifyContent: 'space-around' }}
    >
      {data?.collection?.items.map((item: any) => (
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
    </section>
  );
}

export default CardList;
