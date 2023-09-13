# createContext

- createContext를 사용하면 컴포넌트가 제공하거나 읽을 수 있는 컨텍스트를 만들 수 있다.

```jsx
import { createContext } from "react";

const SomeContext = createContext(defaultValue);
```

- defaultValue : 컨텍스트를 읽는 컴포넌트 상위 트리에 일치하는 컨텍스트 provider가 없을 때 가지는 값이다.
- 의미 있는 기본값이 없다면 null을 지정한다.

## 반환값

- createContext()는 컨텍스트 객체를 반환한다.
- 상위 컴포넌트에서 `컨텍스트 객체.Provider`로 컨텍스트 값을 지정한다.
- 하위 컴포넌트에서 `useContext(컨텍스트 객체)`를 호출해서 컨텍스트 값을 사용한다.

```jsx
import { createContext } from "react";

function App() {
  const ThemeContext = createContext("light");
  const [theme, setTheme] = useState("light");

  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

- `<ThemeContext.Provider>`에 포함된 하위 컴포넌트는 `useContext(ThemeContext)`로 value 값을 사용할 수 있다.

```jsx
function Page() {
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

> ThemeContext의 값이 변경되면 사용하는 하위 컴포넌트로 리렌더링된다.

## 사용법

- 컨텍스트는 컴포넌트가 프로퍼티를 명시적으로 전달하지 않고도 정보를 깊숙이 전달할 수 있게 한다.

```jsx
import { createContext, useState, useContext } from "react";

const ThemeContext = createContext("light");
const AuthContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("dark");
  const [currentUser, setCurrentUser] = useState({ name: "Taylor" });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

function Page() {
  // ...
  return (
    <>
      <Button />
      <Profile />
    </>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

## 파일에서 컨텍스트 import 및 export하기

- 서로 다른 파일에 있는 컴포넌트가 동일한 컨텍스트에 엑세스하는 경우가 있다.
- 이를 위해 컨텍스트는 별도의 파일에 선언하는 것이 일반적이다.

```jsx
// Contexts.js
import { createContext } from "react";

export const ThemeContext = createContext("light");
export const AuthContext = createContext(null);
```

```jsx
// App.js
import { ThemeContext, AuthContext } from "./Contexts.js";

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

```jsx
// Button.js
import { ThemeContext } from "./Contexts.js";

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```
