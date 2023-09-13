# Suspense

- `<Suspense>`를 사용하면 자식이 로딩을 완료할 때까지 폴백(대체 UI)을 표시할 수 있다.

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

## Props

- children : 렌더링하려는 실제 UI. 렌더링 중 children이 일시 중단되면 fallback이 렌더링된다.
- fallback : children 완료까지 대신 렌더링할 `대체 UI` 로딩 스피터나 스켈레톤과 같은 플레이스 홀더 뷰를 사용한다.

## 주의사항

### React는 처음 마운트하기 전에 일시 중단된 렌더링의 state를 보존하지 않는다.

데이터를 로딩하는 컴포넌트를 가지고 있다고 가정했을때,  
이 컴포넌트는 데이터가 로드되기 전까지는 렌더링을 중단(suspend)한다.  
데이터 로딩이 완료되면, 컴포넌트는 다시 렌더링을 시도한다.  
그런데, 데이터 로딩 중에 컴포넌트의 일부 state가 변경되었다면 어떻게 될까?  
React는 해당 state를 "버린다".

```jsx
import { useState, Suspense } from "react";

function DataFetchingComponent() {
  let data = fetchData(); // 가정: 이 함수는 Promise를 반환합니다.
  return <div>Data: {data}</div>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
      <Suspense fallback={<div>Loading...</div>}>
        <DataFetchingComponent />
      </Suspense>
    </div>
  );
}
```

- 위의 예제에서, `DataFetchingComponent`는 데이터를 가져올 때까지 렌더링을 중단한다.
- 만약 사용자가 "Increase Count" 버튼을 클릭하여 count state를 변경하더라도,  
  `DataFetchingComponent`가 처음 마운트되기 전에 변경된 state는 보존되지 않는다.
- 데이터가 로드되면, React는 `DataFetchingComponent`를 처음부터 다시 렌더링한다.

> 이것이 React의 Suspense가 작동하는 방식 중 하나로 `데이터 로딩 중에 발생할 수 있는 여러 부작용(예: 불필요한 state 변경)`을 방지하기 위함이다.

### Suspense가 트리에 대한 콘텐츠를 표시하고 있다가 다시 일시 중단된 경우, 그 원인이 된 업데이트가 `startTransition`이나 `useDeferredValue`로 인한 것이 아니라면 `fallback`이 다시 표시된다.

```
1. startTransition:
   이 함수는 `비동기적으로 업데이트`를 수행하려 할 때 사용된다.
   startTransition을 사용하면 React는 해당 업데이트를 `전환(transition)`으로 간주하고,
   이 업데이트가 화면에 반영되는 것을 지연시킬 수 있다. 이렇게 하면 사용자 인터페이스가 더 부드럽게 느껴진다.

2. useDeferredValue:
   이 Hook은 특정 값을 지연시키려 할 때 사용된다.
   예를 들어, 사용자가 입력하는 텍스트와 같이 빠르게 변경되는 값을 지연시키려 할 때 유용하다.
```

> 즉, Suspense가 이미 데이터를 로딩하여 콘텐츠를 표시하고 있지만.  
> "의도적인 지연"이 아닌 이유로 다시 데이터를 로딩해야 할 경우 Suspense는 fallback을 표시한다.

```jsx
import { useState, useDeferredValue, Suspense } from "react";

function DataFetchingComponent({ query }) {
  let data = fetchData(query); // Promise를 반환 가정
  return <div>Data: {data}</div>;
}

function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query, { timeoutMs: 2000 });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <DataFetchingComponent query={deferredQuery} />
      </Suspense>
    </div>
  );
}
```

- 사용자가 입력 값을 변경하면 `DataFetchingComponent`는 새로운 query로 데이터를 로딩한다.
- `useDeferredValue`를 사용하여 query의 변경을 지연시키고 있기 때문에,  
  입력이 빠르게 이루어져도 DataFetchingComponent의 렌더링이 빈번하게 발생하지 않는다.
- 만약 `useDeferredValue`의 지연시간(timeoutMs)이 초과되면, 지연된 값과 현재 입력값이 동기화된다.  
  이 경우, DataFetchingComponent는 새로운 query로 데이터를 로딩한다.

> startTransition이나 useDeferredValue로 인한 업데이트가 발생하면,  
> Suspense는 이미 표시된 콘텐츠를 유지하며 fallback을 다시 표시하지 않는다.  
> 다시 말해, 사용자는 "Loading..."과 같은 fallback 메시지를 볼 확률이 줄어든다.

### React가 다시 일시 중단되어 이미 표시된 콘텐츠를 숨겨야 하는 경우, 콘텐츠 트리에서 `layout Effect`를 클린업 한다.

- `layout Effect`는 레이아웃 효과로 DOM 요소의 크기나 위치와 같은 레아아웃 정보를 측정하거나 변경하는 코드다.
- 콘텐츠가 다시 표시될 준비과 되면 React는 `layout Effect`를 다시 실행한다.
- 이를 통해 콘텐츠가 숨겨져 있는 동안에는 DOM 레이아웃을 측정하는 Effect가 해당 작업을 시도하지 않도록 한다.

> 이는 화면에 표시되지 않는 불필요한 작업을 막아주는 성능에 중요한 최적화 작업이다.

## 사용법

- 애플리케이션 어떤 부분이든 Suspense 경계로 감쌀 수 있다.

```jsx
<Suspense fallback={<Loading />}>
  <Albums />
</Suspense>
```

- React는 자식에게 필요한 모든 코드와 데이터가 로드될 때까지 폴백을 표시한다.

### ❗️ Note!

- Suspense 컴포넌트를 도입한 데이터 소스에서만 Suspense 컴포넌트를 활성화할 수 있다.

  - Relay 및 Next.js와 같은 Suspense 도입 프레임워크를 사용한 데이터 페칭
  - lazy를 사용한 지연 로딩 컴포넌트 코드

- Suspense는 Effect나 이벤트 핸들러 내부에서 페칭하는 경우를 감지하지 않는다.

### 콘텐츠를 한 번에 드러내기

- Suspense 내의 모든 컴포넌트는 단일 취급된다.
- 즉, Suspense 내의 하나만 데이터 대기를 위해 일시 중단되더라도 모든 컴포넌트가 로딩 표시된다.
- 이후 모든 컴포넌트가 준비되면 한번에 표시된다.

```jsx
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

- Suspense의 직접적인 자식이 아니라도 동일하게 적용된다.

```jsx
<Suspense fallback={<Loading />}>
  <Details artistId={artist.id} />
</Suspense>;

function Details({ artistId }) {
  return (
    <>
      <Biography artistId={artistId} />
      <Panel>
        <Albums artistId={artistId} />
      </Panel>
    </>
  );
}
```

### 중첩된 콘텐츠가 로드될 때 표시하기

- 화면의 일부는 표시하고 일부는 로딩 표시하고 싶은 경우가 있다.
- Suspense는 컴포넌트가 일시 중단되면 가장 가까운 Suspense 폴백을 표시한다.
- 이를 이용해 중첩으로 Suspense 하여 로딩 시컨스를 만들 수 있다.

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

1. Biography가 아직 로드되지 않은 경우 전체 콘텐츠 영역 대신 BigSpinner가 표시된다.
2. Biography로드가 완료되면 BigSpinner가 콘텐츠로 대체된다.
3. Albums가 아직 로드되지 않은 경우 Albums 및 그 부모 Panel 대신 AlbumsGlimmer가 표시된다.
4. 마지막으로 Albums 로딩이 완료되면 Albums가 AlbumsGlimmer를 대체한다.

> Suspense 중첩을 활용해서 UI의 어떤 부분이 동시에 표시되어야 하는지 조정할 수 있다.

### 새 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시하기

- 위 예제에서는 새로운 데이터를 받아오는동안 페이지가 "Loading"을 표시했다.
- 새로운 데이터를 `자주` 받아오는 경우는 매번 "Loading" 표시보다는 이전 결과값을 유지하고 싶다.
- `useDeferredValue`를 사용하면 이전 화면을 보여줄 수 있다.

```jsx
export default function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div
          style={{
            opacity: query !== deferredQuery ? 0.5 : 1,
          }}
        >
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

❓ `useDeferredValue`를 사용하면 suspense가 왜 필요하지?

### 이미 표시된 콘텐츠가 숨겨지지 않도록 방지하기

- 일부 컴포넌트가 표시된 상태에서 내부 컴포넌트 일시 중단으로 전체 페이지가 사라질 수 있다.

```jsx
export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    setPage(url);
  }
```

- 이를 방지하기 위해 `startTransition`을 사용하여 state 업데이트를 트랜지션으로 표시할 수 있다.
- `startTransition`는 React에게 state 전환이 긴급하지 않기에 이미 표시된 콘텐츠를 숨기는 대신 이전 페이지를 계속 표시하라고 알려준다.

```jsx
function Router() {
  const [page, setPage] = useState('/');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

### 트랜지션이 발생하고 있음을 나타내기

- 트랜지션중에는 이전 페이지를 보여준다.
- 하지만 새로운 데이터를 받고 있음을 알리는 표시가 없다. (사용자 입장에서 불편하다.)
- `useTransition`을 사용하면 `isPending`이라는 불리언 값을 제공하여 트랜지션 동안 스타일을 변경할 수 있다.

```jsx
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
```

### 탐색시 Suspense 경계 재설정하기

- 트랜지션하는 동안 React는 이미 표시된 콘텐츠를 숨기지 않는다.
- 하지만 다른 매개변수, 즉 다른 경로로 이동하는 경우에는 "로딩"을 표시하고 싶을 수 있다.
- 이떄는 `key`를 사용하여 React에게 알려준다.

```jsx
<ProfilePage key={queryParams.id} />
```

- 동일한 프로필 페이지라면 어떤 콘텐츠가 일시 중단된 경우 표시되었던 콘텐츠는 유지되길 원한다.
- 하지만 다른 프로필 페이지라면 기존 콘텐츠는 사라지고 "로딩"이 표시됨이 좋다.
