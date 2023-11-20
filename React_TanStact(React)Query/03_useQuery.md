# useQuery

## useQuery 기본 사용법

- useQuery 훅은 데이터 패칭을 위해 사용된다.

```tsx
const { data, isLoading, ... } =  useQuery(queryKey, queryFn, {
  // ...options ex) enabled, staleTime, ...
});
```

- useQuery는 기본적으로 3개의 인자를 받는다.
-  첫 번째 인자 queryKey(필수)
-  두 번째 인자 queryFn(필수)
-  세 번째 인자 options(optional)

### queryKey

```tsx
const getAllSuperHero = async () => {
  return await axios.get("http://localhost:4000/superheroes");
};

const { data, isLoading } = useQuery(["super-heroes"], getAllSuperHero);           
```

- v3까지는 queryKey로 문자열 또는 배열 모두 지정할 수 있는데, v4부터는 무조건 배열로 지정해야 한다.
- useQuery는 첫 번째 인자인 queryKey를 기반으로 데이터 캐싱을 관리한다.

```tsx
const getSuperHero = async ( heroId : string) => {
  return await axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const useSuperHeroData = (heroId: string) => {
   return useQuery(["super-hero", heroId], () => getSuperHero(heroId));
};
```

- 만약, 쿼리가 특정 변수에 의존한다면 배열에다 이어서 넣어주면 된다. ex: ["super-hero", heroId, ...]

### queryFn

```tsx
useQuery({ queryKey: ['todos'], queryFn: fetchAllTodos })
useQuery({ queryKey: ['todos', todoId], queryFn: () => fetchTodoById(todoId) })
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId)
    return data
  },
})
useQuery({
  queryKey: ['todos', todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
})
```

- useQuery의 두 번째 인자인 queryFn는 Promise를 반환하는 함수를 넣어야한다.

### options

```tsx
const useSuperHeroData = (heroId: string) => {
  return useQuery(["super-hero", heroId], () => getSuperHero(heroId), {
    cacheTime: 5 * 60 * 1000, // 5분
    staleTime: 1 * 60 * 1000, // 1분
    retry: 1,
    // ...options
  });
};
```

- 3번째 인자는 선택사항으로 다양한 옵션을 설정할 수 있다.
- [다양한 옵션 (리액트 공식사이트)](https://tanstack.com/query/latest/docs/react/reference/useQuery)


## useQuery 주요 리턴 데이터

- useQuery는 여러 리턴 값들을 제공해준다.

1. data : 요청된 쿼리에 대한 성공적인 응답의 결과 데이터
2. error : 쿼리 요청 중 발생한 오류
3. isLoading : 쿼리가 현재 진행 중인지 여부를 나타내는 부울 값
4. isError : 쿼리가 오류로 인해 실패했는지 여부를 나타내는 부울 값
5. isSuccess : 쿼리가 성공적으로 완요되었는지 여부를 나타내는 부울 값
6. isFetching : 쿼리가 요청 중이거나 백그라운에서 새로고침 중인지 여부를 나타내는 부울 값
7. status : 쿼리의 현재 상태를 나타내는 문자열  
    - loading: 말 그대로 아직 캐시된 데이터가 없고 로딩중일 때 상태
    - error: 요청 에러 발생했을 때 상태
    - success: 요청 성공했을 때 상태 
8. fetchStatus : 쿼리의 "데이터 패칭" 상태를 나타내는 문자열  
   - fetching : 쿼리가 데이터를 가져오고 있을때 상태
   - paused : 쿼리가 일시적으로 중단되었음을 타나내는 상태
   - idle : 쿼리가 현재 활성 상태가 아닐 때 설정되며, 이는 데이터가 필요하지 않거나 사용되지 않을때 발생
9. refetch : 쿼리를 수동으로 다시 실핼할 수 있는 함수 (쿼리 리트리거)

> status는 쿼리의 결과에 대한 전반적인 상태를 나태는 반면,  
> fetchStatus는 쿼리 함수의 실행 상태에 좀 더 구체적으로 초점을 맞춘다.
> 즉, status는 data가 있는지 없는지에 대한 상태를 의미한다.  
> fetchStatus는 쿼리 즉, queryFn 요청이 진행중인지 아닌지에 대한 상태를 의미한다.

## useQuery 주요 옵션

- useQuery에서 추가 가능한 옵션들에 대해서 알아보자
- [공식문서 추가 옵션 내용](https://tanstack.com/query/latest/docs/react/reference/useQuery)

### staleTime & cacheTime

- stale는 썩은 이라는 의미로 최신 상태가 아님을 뜻한다.
- fresh는 신선한 이라는 의미로 최신 상태를 뜻한다.

```tsx
const { isLoading, isFetching, data, isError, error } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    cacheTime: 5 * 60 * 1000, // 5분
    staleTime: 1 * 60 * 1000, // 1분
  }
);
```

#### staleTime: (number | Infinity)
- staleTime은 데이터가 fresh에서 stale 상태로 변경되는 데 걸리는 시간, 
- 만약 staleTime이 3000이면 fresh상태에서 3초 뒤에 stale로 변환된다.
- fresh 상태일 때는 쿼리 인스턴스가 새롭게 mount 되어도 네트워크 요청(fetch)이 일어나지 않는다.
- 데이터가 한번 fetch 되고 나서 staleTime이 지나지 않았다면(fresh상태) 
- unmount 후 다시 mount 되어도 fetch가 일어나지 않는다.
- staleTime의 기본값은 0이기 때문에 일반적으로 fetch 후에 바로 stale이 된다.

#### cacheTime: (number | Infinity)
- 데이터가 inactive 상태일 때 캐싱 된 상태로 남아있는 시간
- 쿼리 인스턴스가 unmount 되면 데이터는 inactive 상태로 변경되며, 캐시는 cacheTime만큼 유지된다.
- cacheTime이 지나면 가비지 콜렉터로 수집된다.
- cacheTime이 지나기 전에 쿼리 인스턴스가 다시 mount 되면, 데이터를 fetch하는 동안 캐시 데이터를 보여준다.
- cacheTime은 staleTime과 관계없이, 무조건 inactive 된 시점을 기준으로 캐시 데이터 삭제를 결정한다.
- cacheTime의 기본값은 5분이다.

> staleTime이 0으로 데이터가 stale되었다고 해서 무조건 새로운 fetch를 실해하지 않는다.  
> cacheTime이 유효하다면 stale 된 데이터라도 우선 캐시된 데이터를 사용하고,  
> 백그라운드에서 refetch 로 변경 사항을 비교하고 없다면 유지한다.  
> 만약 재검증 단계에서 변경사항을 발견하면 캐시를 새 데이터로 업데이트하고 UI도 갱신된다.

### refetchOnMount

```tsx
const { isLoading, isFetching, data, isError, error } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    refetchOnMount: true,
  }
);
```
- refetchOnMount (boolean | 'always')
- refetchOnMount는 데이터가 state 상태일 경우, mount마다 refetch를 실행한다.
- 기본값은 true다.
- always로 설정하면 마운트 시마다 매번 refetch를 실행한다. (flash여도 실행)
- false로 설정하면 최초 fetch 이후에는 refetch하지 않는다.

### refetchOnWindowFocus

```tsx
const { isLoading, isFetching, data, isError, error } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    refetchOnWindowFocus: true,
  }
);
```

- refetchOnWindowFocus는 데이터가 stale 상태일 경우 윈도우가 포커실 될 때다마 refetch를 실행한다.
- 기본값은 true다.
- 크롬에서 다른 탬을 눌렀다가 다시 원래 보던 중인 탭을 눌렀을때 해당한다.
- 어떤 행위든 다른 창을 클릭하면 발생한다.

### Polling 

```tsx
const { isLoading, isFetching, data, isError, error } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  }
);
```

- Polling은 리얼타임 웹을 위한 기법이다.
- 일정한 주기로 서버와 응답을 주고 받는다.
- refetchInterval은 일정 시간 마다 refetch를 실행한다.
- refetchIntervalInBackground를 true로 설정하면 창이 focus되지 않아도 refetch를 시겨준다.

### enabled refetch

- 쿼리 자동 실행을 차단해준다.
- 특정 이벤트를 통해 데이터를 요청 받고자 할 때 사용된다.

```tsx
const { isLoading, isFetching, data, isError, error, refetch } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    enabled: false,
  }
);

const handleClickRefetch = useCallback(() => {
  refetch();
}, [refetch]);

return (
  <div>
    {data?.data.map((hero: Data) => (
      <div key={hero.id}>{hero.name}</div>
    ))}
    <button onClick={handleClickRefetch}>Fetch Heroes</button>
  </div>
);
```

- false를 주면 자동 실행되지 않는다.
- 쿼리 오류가 발생하면 오류만 기록된다. 오류를 발생시키려면 throwOnError속성을 true로 해서 전달해야 한다.
- 만약 enabled: false를 줬다면 queryClient가 쿼리를 다시 가져오는 방법 중 invalidateQueries와 refetchQueries를 무시한다.

### retry

```tsx
const result = useQuery(["todos", 1], fetchTodoListPage, {
  retry: 10, // 오류를 표시하기 전에 실패한 요청을 10번 재시도합니다.
});
```

- retry (boolean | number | (failureCount: number, error: TError) => boolean)
- retry는 쿼리가 실패하면 useQuery를 특정 횟수(기본값 3)만큼 재요청하는 옵션이다.
- retry가 false인 경우, 실패한 쿼리는 기본적으로 다시 시도하지 않는다.

### select

```tsx
const { isLoading, isFetching, data, isError, error, refetch } = useQuery(
  ["super-hero"],
  getSuperHero,
  {
    onSuccess,
    onError,
    select(data) {
      const superHeroNames = data.data.map((hero: Data) => hero.name);
      return superHeroNames;
    },
  }
);

return (
  <div>
    <button onClick={handleClickRefetch}>Fetch Heroes</button>
    {data.map((heroName: string, idx: number) => (
      <div key={idx}>{heroName}</div>
    ))}
  </div>
);
```

- select 옵션을 사용하여 쿼리 함수에서 반환된 데이터의 일부를 변환하거나 선택할 수 있다.

### keepPreviousData

```tsx
const fetchColors = async (pageNum: number) => {
  return await axios.get(
    `http://localhost:4000/colors?_limit=2&_page=${pageNum}`
  );
};

const { isLoading, isError, error, data, isFetching, isPreviousData } =
  useQuery(["colors", pageNum], () => fetchColors(pageNum), {
    keepPreviousData: true,
  });
```

- keepPreviousData를 true로 설정하면 쿼리 키가 변경되어서 새로운 데이터를 요청하는 동안에도 마지막 data 값을 유지한다.
- keepPreviousData은 페이지네이션과 같은 기능을 구현할 때 편리하다. 
- 캐싱 되지 않은 페이지를 가져올 때 목록이 깜빡거리는 현상을 방지할 수 있다.
- 또한, isPreviousData 값으로 현재의 쿼리 키에 해당하는 값인지 확인할 수 있다. 
- 페이지네이션을 예로 들면, 아직 새로운 데이터가 캐싱 되지 않았다면, 
- 이전 데이터이므로 true를 반환하고 새로운 데이터가 정상적으로 받아져 왔다면 이전데이터가 아니므로 false를 반환한다.

### placeholderData

- placeholderData는 쿼리가 로드되는 동안 초기에 보여질 임시 데이터를 설정하는데 사용된다.
- 데이터를 로드하는 동안 빈 화면이나 로딩 인디게이터만 보여주는 것보다 나은 UX를 제공한다.

```tsx
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  const result = useQuery(["todos"], () => fetch("/todos"), {
    placeholderData,
  });
}
```

- 리스트나 테이블과 같은 UI 요소에서 데이터가 로드되기 전에 플레이스홀더 또는 스켈레톤 컴포넌트를 표시할 수 있다.
- generateFakeTodos()는 실제 데이터를 기다리는동안 보여줄 거짓 데이터를 임의로 생성해서 추가한다.
