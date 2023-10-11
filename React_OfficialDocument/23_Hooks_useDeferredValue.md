# useDeferredValue

- useDeferredValue는 UI 일부의 업데이트를 지연시킬 수 있는 React 훅이다.

```jsx
import { useState, useDeferredValue } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

- useDeferredValue(value) : value에는 지연시키려는 값으로 어떤 타입이든 가질 수 있다.
- 초기 렌더링에는 제공한 값과 동일한 값을 반환한다.
- 업데이트가 발생하면 이전 값으로 리렌더링을 시도하고, 백그라운더에서 다시 새 값으로 리렌더링을 시도한다.

## 사용법

### 새 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시하기

```jsx
import { Suspense, useState } from "react";
import SearchResults from "./SearchResults.js";

export default function App() {
  const [query, setQuery] = useState("");
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

- 위 예제에서는 query가 업데이트 되는 동안 Suspense의 폴백이 렌더된다.
- input값이 변경 될 때마다 폴백이 나온다.

> input 값이 변경되어도 이미 검색된 단어를 유지 시켜 사용자 경험을 향상 시키고 싶다면 useDeferredValue를 사용한다.

```jsx
import { Suspense, useState, useDeferredValue } from "react";
import SearchResults from "./SearchResults.js";

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
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

- 업데이트 되는 상태값 query에 useDeferredValue를 적용한다.
- input값이 변경되어 query가 변해도 폴백은 렌더링이 안되고 기존값이 유지된다.

### 콘텐츠가 오래되었음을 표시하기

- useDeferredValue로 이전 값을 보여주는데 이 시간이 길어지면 사용자에게는 불편함을 준다. (서버 다운?)
- 이전값을 보여주는 상태값에 스타일을 적용할 수 있다.

```jsx
<div
  style={{
    opacity: query !== deferredQuery ? 0.5 : 1,
  }}
>
  <SearchResults query={deferredQuery} />
</div>
```

```jsx
import { Suspense, useState, useDeferredValue } from "react";
import SearchResults from "./SearchResults.js";

export default function App() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div
          style={{
            opacity: isStale ? 0.5 : 1,
            transition: isStale
              ? "opacity 0.2s 0.2s linear"
              : "opacity 0s 0s linear",
          }}
        >
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```
