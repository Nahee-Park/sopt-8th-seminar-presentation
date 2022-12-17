---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
title: 'FE 비동기 상태관리 전략: 선언적으로 비동기 처리 하기'
info: 'FE에서 비동기 상태를 어떻게 하면 좀 더 선언적으로 표현할 수 있을 지 그 사례를 소개합니다.'
---

# FE 비동기 상태관리 전략
## : 리액트 쿼리 찍먹하기 ? -> 선언적으로 비동기 처리 하기

발표자료 링크 : https://github.com/Nahee-Park/sopt-8th-seminar-presentation

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: image-right
image: https://s3.ap-northeast-2.amazonaws.com/sopt-makers-internal//prod/image/project/6ab6020f-37d2-466e-829b-22697f16c4e3-IMG_9727.JPG
---
# Speaker

박나희 (devstone)

- SOPT 28기 웹파트 
- SOPT 29기 서버파트
- SOPT 30기 웹파트 && 운영팀
- (전) Goorm Software Engineer Internship (2021.9~2022.2)
- (현) Dsrvlabs Software Engineer Internship (2022.6~)
- AUSG 6th member 

---

# 어떤 코드가 더 이해하기 쉬우신가요?


```ts
function getBazFromX(x) {
 if (x === undefined) {
   return undefined;
 }
 if (x.foo === undefined) {
  return undefined;
 }
 if (x.foo.bar === undefined) {
   return undefined;
 }
  return x.foo.bar.baz;
};
```

```ts 
function getBazFromX(x) {
  return x?.foo?.bar?.baz;
};
```
---


# 명령형 프로그래밍 vs 선언형 프로그래밍
- 명령형 프로그래밍 : baz를 찾기 위해 x를 보고 x.foo보고 x.foo.bar를 보고 x.foo.bar.baz를 보고 ... <br/>
  -> 명령형 프로그래밍은 어떻게를 일일이 간섭하는 것이고

- 선언형 프로그래밍 : x?.foo?.bar?.baz <br/>
  -> 선언형은 무엇에 집중하고 나머지는 맡긴다.

---

# 데이터 패칭을 한 번 해볼까요
- api.ts
```ts
import axios from 'axios';

const BASE_URL = 'https://images-api.nasa.gov';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const getNasaData = async (keyword: string, page: number) => {
  const data = await client.get(`/search?q=${keyword}&page=${page}`);
  return data?.data;
};
```

---

- CardList.ts

```ts {2-4|5-18} {maxHeight:'100'}
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


```

---

```tsx
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
```
---
---

# 장점과 단점

## 장점 
- 단순 ! 
- try-catch를 통해 함수 내부에서 성공한 경우 / 실패한 경우가 함수 내부에서 선언적으로 갈림

## 단점
- loading, error, data의 산발적인 상태 관리 
- 한땀한땀 상태를 변경시켜줘야 함

---
---
# useState -> useReducer를 써보자 

- nasaDataReducer.ts

<img>

```ts 
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
```

---

```tsx
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
```

---

- CardList.ts

```ts 
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


```

---

```tsx
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
```
---
---


- useNasaData.ts
```ts
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
```
---

- CardList.ts

```ts
function CardList() {
  const { loading, data, error } = useNasaData();
  return (
    <section
      style={{ display: 'flex', flexWrap: 'wrap', rowGap: '24px', justifyContent: 'space-around' }}
    >
      {loading ? ( <p>로딩중 ...</p>) : (
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
```
---

# 장점과 단점

## 장점 
- 아까에 비해 재사용성 증가 (hook을 호출)
- 데이터를 처리하는 로직 내에서 loading, error, data의 선언적인 처리 

## 단점
- 여전히 ... 컴포넌트 내부에서 모든 분기 처리를 해줘야 하는데 만약 이런 처리를 여러 컴포넌트에서 해줘야 하지 않을까 ? <br/>
  -> 컴포넌트 내부에서 좀 더 깔끔한 비동기 상태 처리를 해 줄 수 없을까? <br/>
  -> 컴포넌트가 오로지 집중해야 할 로직에만 집중할 수 있도록 처리해줄 수 없을까?


---

# React의 Suspense 이용하기

React.Suspense
React.Suspense lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let Suspense handle more scenarios such as data fetching. You can read about this in our roadmap.

Today, lazy loading components is the only use case supported by <React.Suspense>:

```ts

// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

---

# 한 번 비동기 상태를 전파시켜 볼까요
- utils.ts
```ts
export default function wrapPromise(promise: Promise<any>) {
  let status = 'pending';
  let result: any;
  let suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    },
  );
  return {
    read() {
      switch (status) {
        case 'pending':
          throw suspender;
        case 'error':
          throw result;
        default:
          return result;
      }
    },
  };
}
```

---

- api.ts
```ts
import axios from 'axios';
import wrapPromise from '../utils/wrapPromise';

const BASE_URL = 'https://images-api.nasa.gov';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const getNasaData = async (keyword: string, page: number) => {
  const data = await client.get(`/search?q=${keyword}&page=${page}`);
  return data?.data;
};

export function fetchNasaData(keyword: string, page: number) {
  return wrapPromise(getNasaData(keyword, page));
}
```

---

- CardList.ts
```ts
function CardList() {
  return (
    <ErrorBoundary renderFallback={({ error, reset }) => <p>에러 났어요 {error?.message}</p>}>
      <Suspense fallback={<p>로딩중 ...</p>}>
        <Resolved resource={fetchNasaData('earth', 1)} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

- CardList.tsx
```tsx
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
```

--- 
# 장점과 단점

## 장점 
- 컴포넌트에서 오로지 '성공'한 로직만 집중할 수 있음
- 에러, 로딩 상태 컴포넌트 단에서의 공통 처리 가능 (공통 바운더리 -> 재사용 가능 )
## 단점
- 복잡하다 .. 귀찮다 .. 언제 저거 랩핑하고 .. 바운더리 만들고 하지 ?
- 여기서 이제 더 복잡한 부분들을 고려해야 한다면 ? -> 전역적인 데이터 관리, 캐싱 ? 도대체 언제 저거 한땀한땀 다 고려해서 설계하지 ?

---

# 위의 모든 것을 쉽게할 수 있도록 지원해주는 라이브러리

- SWR
- react-query

---

# react-query
- App.tsx
```tsx
import Router from './core/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

---


- CardList.tsx


```tsx
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getNasaData } from '../lib/api';

import EachCard from './Card';
import ErrorBoundary from './common/ErrorBoundary';

function CardList() {
  return (
    <ErrorBoundary renderFallback={({ error, reset }) => <p>에러 났어요 {error?.message}</p>}>
      <Suspense fallback={<p>로딩중 ...</p>}>
        <Resolved />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

```tsx

function Resolved() {
  const { data } = useQuery(['nasa_info'], () => getNasaData('earth', 1), {
    suspense: true,
  });
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
```

---

- 심지어 react-query를 사용하면 아까 데이터 패칭 훅을 만들어서 loading, error 상태를 리턴했었는데 이러한 상태값들도 반환을 해줘요
- https://tanstack.com/query/v4/docs/react/reference/useQuery
```jsx
 function Todos() {
   const { isLoading, isError, data, error } = useQuery('todos', fetchTodoList)
 
   if (isLoading) {
     return <span>Loading...</span>
   }
 
   if (isError) {
     return <span>Error: {error.message}</span>
   }
 
   // We can assume by this point that `isSuccess === true`
   return (
     <ul>
       {data.map(todo => (
         <li key={todo.id}>{todo.title}</li>
       ))}
     </ul>
   )
 }
```

---

- 그리고 위에서 정의한 키를 통해 캐싱되기 때문에 키를 통해 데이터 값을 가져올 수 있어요 <br/>
  -> 리코일이나, 리덕스, 혹은 context api같은 전역 상태관리 라이브러리를 따로 쓰지 않고 리액트쿼리만으로 서버에서 받아온 상태들에 접근할 수 있어요. <br/>
  -> 클라이언트 사이드의 전역 상태 / 서버 사이드의 전역 상태를 분리할 수 있어요.

```ts
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const data = queryClient.getQueryData('nasa_info');
// 아까 해당 키로 불러왔던 data를 가져올 수 있음

```

---

# Recap

- 비동기 데이터를 불러오는 다양한 방법 <br/>
  -> useState로 상태를 하나하나 관리할 수도 있고, <br/>
  -> useReducer로 좀 더 상태를 조망할 수 있고 <br/>
  -> Suspence, ErrorBoundary를 통해 컴포넌트 자체가 집중해야 할 로직에 집중하게 만들 수 있다 <br/>
- 선언적인 로직 -> 복잡성 증가 -> 쉽게 처리할 수 있는 라이브러리들의 등장 <br/>
  -> 리액트 쿼리 / SWR 고려할 수 있음
  -> 위에서 한땀한땀 정의한 것들을 라이브러리를 이용해 훨씬 간단하게 할 수 있음
  -> 서버 사이드의 상태들을 비동기 처리 라이브러리를 다 퉁칠 수 있음 (recoil, redux, context api 등에서는 클라이언트의 전역 상태만 고려해도 괜찮아짐)


---

