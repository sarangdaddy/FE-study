# useId

- useId는 접근성 속성에 전달할 수 있는 고유 ID를 생성하기 위한 React 훅이다.
- useId는 컴포넌트의 최상위 수준에서 호출하여 고유한 ID를 생성한다.

```jsx
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

- useId는 특정 컴포넌트 내 특정 useId 와 관련된 고유 ID 문자열를 반환한다.
- useId를 목록에서 키를 생성하기 위해 사용면 안된다. 키는 데이터에서 생성되어야 한다.
- 생성된 ID를 다른 속성에 전달한 수 있다.

```jsx
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

## 사용법

- HTML 두 태그를 연결할때 고유한 ID가 필요하다.
- ID를 하드코딩하면 동일한 ID가 중복되기에 동일한 컴포넌트를 사용하면 충돌이 일어난다.
- 컴포넌트 렌더링 마다 고유한 ID를 생성하여 부여하면 이를 방지할 수 있다.

```jsx
import { useId } from "react";

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input type="password" aria-describedby={passwordHintId} />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

> 서버 사이드 렌더링에서 HTML이 먼저 생성되는데 useId를 사용하면 부모 경로가 일치하기에 hydration에서도 일치한다.

### 생성된 모든 ID에 공유 접두사 지정하기

- 단일 페이지에서 여러 개의 독립적인 React 애플리케이션을 렌더링하는 경우,
- createRoot 또는 hydrateRoot를 호출하여 identifierPrefix에 옵션으로 전달한다.
- 이렇게 하면 생성된 모든 식별자가 지정한 고유한 접두사로 시작하기 때문에 서로 다른 두 앱에서 생성된 ID가 충돌하지 않는다.

```jsx
// index
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./styles.css";

const root1 = createRoot(document.getElementById("root1"), {
  identifierPrefix: "my-first-app-",
});
root1.render(<App />);

const root2 = createRoot(document.getElementById("root2"), {
  identifierPrefix: "my-second-app-",
});
root2.render(<App />);

// App
import { useId } from "react";

function PasswordField() {
  const passwordHintId = useId();
  console.log("Generated identifier:", passwordHintId);
  return (
    <>
      <label>
        Password:
        <input type="password" aria-describedby={passwordHintId} />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```
