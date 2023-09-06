# useContext

- useContext는 컴포넌트에서 context를 읽고 `구독`할 수 있게 해주는 Hook이다.

```jsx
const value = useContext(SomeContext);
```

- useContext는 호출하는 컴포넌트에 대한 context값을 반환한다.
- 이 값은 컴포넌트 트리상 가까운 `SomeContext.Provider`에 전달된 value다.
- Provider가 없는 경우 `createContext`에 전달한 `defaultValue`가 된다.
- React는 context가 변경되면 **context를 읽는 컴포넌트를 자동으로 리렌더링한다**.

# 사용법

## 트리 깊숙이 데이터 전달하기

- Button에서 props로 전달 받지 않은 상위 상태값을 읽고 싶다.
- 컴포넌트 최상위 레벨에서 useContext를 호출하여 context를 읽고 구독한다.

```jsx
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

- useContext는 ThemeContext에 대한 값을 반환한다.
- ThemeContext 값을 결정하기 위해 상위 컴포넌트 탐색하고 가까운 `context provider`를 찾는다.

```jsx
import { createContext } from "react";

// context를 제공해주는 createContext가 필요하다
const ThemeContext = createContext(null);

function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

- button 상위에 있는 Form 컴포넌트에서 `context provider` 찾았다.
- **중간에 몇개의 컴포넌트를 거쳤는지는 중요하지 않다.**
- ThemeContext 값 `value="dark"`를 받을 수 있다.

## context를 통해 전달된 데이터 업데이트 하기

```jsx
function MyPage() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button
        onClick={() => {
          setTheme("light");
        }}
      >
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

- context값이 변경되길 원한다면 state와 결합한다.
- setter 함수로 state 값이 변경되면 context값을 가지는 컴포넌트로 리렌더링된다.

## fallback 기본값 지정하기

- React가 부모 트리에서 특정 context의 provider들을 찾을 수 없는 경우
- useContext()가 반환하는 context 값은 해당 context를 생성할 때 지정한 기본값과 동일하다.

```jsx
const ThemeContext = createContext("light");
```

- 기본 값은 의미 있는 값으로 명시하자

## 트리 일부에 대한 context 재정의하기

- 트리의 일부분을 다른 값의 provider로 감싸 해당 부분에 대한 context를 재정의할 수 있다.

```jsx
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

## 객체 및 함수 전달 시 리렌더링 최적화

- context를 통해 `객체와 함수`를 포함한 모든 값을 전달할 수 있다.

```jsx
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

- 여기서 context 값은 두 개의 프로퍼티를 가진 JavaScript 객체이며, 그 중 하나는 함수다.
- MyApp이 리렌더링할 때마다(예: 라우트 업데이트), 이것은 다른 함수를 가리키는 다른 객체가 된다.
- React는 useContext(AuthContext)를 호출하는 트리 깊숙한 곳의 모든 컴포넌트도 리렌더링해야 한다.
- 하지만, **currentUser와 같은 기초 데이터가 변경되지 않았다면 리렌더링할 필요가 없다**.
- React가 이 사실을 활용할 수 있도록 login 함수를 useCallback으로 감싸고 객체 생성은 useMemo로 감싸야 한다.

```jsx
import { useCallback, useMemo } from "react";

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      login,
    }),
    [currentUser, login]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

> 이 변경으로 인해 MyApp이 리렌더링해야 하는 경우에도 currentUser가 변경되지 않는 한  
> useContext(AuthProvider)를 호출하는 컴포넌트는 리렌더링할 필요가 없다.
