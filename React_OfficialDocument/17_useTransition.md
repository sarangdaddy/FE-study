# useTransition

- useTransition은 UI를 차단하지 않고 state를 업데이트할 수 있는 React 훅이다.
- 컴포넌트의 최상위 레벨에서 useTransition을 호출하여 일부 state 업데이트를 트랜지션으로 표시한다.

```jsx
import { useTransition } from "react";

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

- isPending : 보류 중인 트랜지션이 있는지 여부를 알려주는 플래그
- startTransition 함수 : state 업데이트를 트랜지션으로 표시할 수 있는 startTransition 함수

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

- useTransition이 반환하는 startTransition 함수를 사용하면 state 업데이트를 트랜지션으로 표시할 수 있다.

## 사용 예시

### state 업데이트를 논블로킹 트랜지션으로 표시하기

- 사용자가 탭을 클릭한다.
- 탭은 데이터 통신 등으로 로딩 시간이 필요하다.
- 트랜지션을 사용한다면 로딩 시간 중에도 다른 UI가 반응한다.

```jsx
// 트랜지션 적용 안한 경우
export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }
```

- tab state가 변경되는 동안 다른 UI는 멈춘다.

```jsx
// 트랜지션 적용
export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
```

- [tab state가 변경 중에도 다른 UI가 즉각적으로 반응한다.](https://react-ko.dev/reference/react/useTransition#examples)

### 트랜지션에서 상위 컴포넌트 업데이트하기

- 부모 컴포넌트의 state 업데이트에도 적용이 가능하다.

```jsx
// 부모로 부터 전달 받은 state 업데이트 함수 `onClick`에 적용한 예시
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

### 트랜지션 중에 ‘보류중’ state 표시하기

- isPending 플래그 값을 사용하여 트랜지션 적용 중임을 사용자에게 표시할 수 있다.

```jsx
import { useTransition } from "react";

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }

  // pending인 경우 css 스타일 적용
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button
      onClick={() => {
        startTransition(() => {
          onClick();
        });
      }}
    >
      {children}
    </button>
  );
}
```

### 원치 않는 로딩 표시 방지하기

- Suspense를 통해 로딩 중 fallback이 나옴을 막고 싶다면 트랜지션을 사용한다.

```jsx
export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
```

```jsx
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
```

### [Suspense가 도입된 라우터 구축하기](https://react-ko.dev/reference/react/useTransition#building-a-suspense-enabled-router)

- React 프레임워크나 라우터를 구축하는 경우 페이지 네비게이션을 트랜지션으로 표시하는 것이 좋다.

```jsx
import { Suspense, useState, useTransition } from "react";
import IndexPage from "./IndexPage.js";
import ArtistPage from "./ArtistPage.js";
import Layout from "./Layout.js";

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState("/");
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === "/") {
    content = <IndexPage navigate={navigate} />;
  } else if (page === "/the-beatles") {
    content = (
      <ArtistPage
        artist={{
          id: "the-beatles",
          name: "The Beatles",
        }}
      />
    );
  }
  return <Layout isPending={isPending}>{content}</Layout>;
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

❓ 사용하고 있는 Link, useNavigate에서는 어떻게 적용하지?

```jsx
export default function App() {
  return (
    <Router>
      <Suspense fallback={<BigSpinner />}>
        <MyRouter />
      </Suspense>
    </Router>
  );
}

function MyRouter() {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const customNavigate = (to) => {
    startTransition(() => {
      navigate(to);
    });
  };

  const Link = ({ to, children }) => {
    return (
      <OriginalLink
        to={to}
        onClick={(e) => {
          e.preventDefault();
          customNavigate(to);
        }}
      >
        {children}
      </OriginalLink>
    );
  };
```
