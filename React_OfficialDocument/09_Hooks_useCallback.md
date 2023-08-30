# useCallback

- useCallback은 `리렌더링 사이`에 `함수 정의`를 캐시할 수 있는 React 훅이다.

```jsx
const cachedFn = useCallback(fn, dependencies);
```

## useCallback의 매개변수

- fn  
  : 캐시하려는 `함수` 값이다.  
  : 어떤 인자도 받을 수 있고 어떤 값이라도 반환할 수 있다.  
  : 초기 렌더링 중에 함수를 반환한다. (❗️ 호출하지 않는다.)  
  : 이후 렌더링에서 `의존성`이 변경되지 않았다면 동일한 함수를 다시 제공한다.  
  : 이후 렌더링에서는 `의존성`이 변경되었다면, fn 함수를 제공하고 나중에 재사용할 수 있도록 저장한다. (❗️ 호출하지 않는다.)  
  : 함수는 반환되므로 호출 시기와 여부를 결정할 수 있다.

- dependencies  
  : fn 코드 내에서 참조되는 모든 `반응형 값`들의 목록  
  : React는 의존성 값을 이전값과 비교한다.

## useCallback의 반환값

- 초기 렌더링에서 useCallback은 전달한 fn 함수를 반환한다.
- 의존성이 변경되지 않은 경우에는 렌더링 중 마지막 렌더링에서 이미 저장된 fn 함수를 반환한다.
- 의존성이 변경된 경우에는 `렌더링 중 전달`했던 fn 함수를 반환한다.

> 렌더링 성능을 최적화할 때 자식 컴포넌트에 전달하는 `함수`를 캐시해야 할 때 `useCallback` 훅을 사용한다.

## useCallback 사용

```jsx
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

- useCallback에는 캐시할 함수를 전달해야 한다.

```jsx
(orderDetails) => {
  post("/product/" + productId + "/buy", {
    referrer,
    orderDetails,
  });
};
```

- `[productId, referrer]` 함수 내에서 사용되는 반환값을 포함하는 의존성 배열을 전달해야 한다.
- 초기 렌더링에서 useCallback은 처음 전달된 함수를 반환한다.
- 의존성이 변경되면 이번 렌더링에서 전달한 함수를 반환한다.
- 의존성이 변경되지 않으면 이전과 같은 함수를 반환한다.
- 즉, useCallback은 의존성이 변경되기 전까지는 리렌더링에 대해 함수를 캐시한다.

```jsx
function ProductPage({ productId, referrer, theme }) {

  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

- 위 예제 ProductPage 컴포넌트에서 ShippingForm 컴포넌트에게 handleSubmit 함수를 전달한다.
- theme prop이 변경된다면 ProductPage 컴포넌트는 리렌더링 된다.
- 이때 자식 컴포넌트 ShippingForm도 리렌더링 된다.
- ShippingForm에게 전달되는 props는 변경이 없다면 memo로 감싸서 리렌더링을 방지할 수 있다.

```jsx
import { memo } from "react";

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

- ShippingForm 컴포넌트는 모든 props가 동일하다면 리렌더링을 건너뛴다고 생각할 수 있다.
- 하지만 ShippingForm 컴포넌트는 리렌더링 된다. ❓
- theme만 변경이 되더라고 handleSubmit는 새로운 함수로 정의된다.
- JavaScript에서 `function () {}` 또는 `() => {}`는 항상 `새 객체를` 생성하기 때문이다. ❗️

```jsx
function ProductPage({ productId, referrer, theme }) {
  // 리렌더링 사이에 함수를 캐싱하도록 지시합니다...
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  ); // ...따라서 이 의존성이 변경되지 않는 한...

  return (
    <div className={theme}>
      {/* ...ShippingForm은 동일한 props를 받으므로 리렌더링을 건너뛸 수 있습니다.*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

- handleSubmit을 useCallback으로 감싸면, 의존성 변경이 없는한 `동일한 함수`로 캐시해준다.

> 자식 컴포넌트에게 `함수`를 전달할 때 useCallback을 사용한다면 자식의 불필요한 리렌더링을 방지 할 수 있다.

## 💡 useMemo와 useCallback은 자식 컴포넌트를 최적화 할때 유용하다.

```jsx
import { useMemo, useCallback } from "react";

function ProductPage({ productId, referrer }) {
  const product = useData("/product/" + productId);

  const requirements = useMemo(() => {
    // 함수를 호출하고 그 결과를 캐시합니다.
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback(
    (orderDetails) => {
      // 함수 자체를 캐시합니다.
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

### useMemo

- useMemo는 호출한 함수의 결과를 캐시한다.
- 이 예제에서는 product가 변경되지 않는 한 변경되지 않도록 computeRequirements(product)를 호출한 결과를 캐시한다.
- **이렇게 하면 불필요하게 ShippingForm을 리렌더링하지 않고도 requirements 객체를 전달할 수 있다.**
- 필요한 경우 (product 변경), React는 렌더링 중에 전달된 함수를 호출하여 결과를 계산한다.

### useCallback

- useCallback은 함수 자체를 캐시한다.
- useMemo와 달리, 제공한 함수를 호출하지 않는다.
- 대신 제공한 함수를 캐시하여 productId 또는 referrer가 변경되지 않는 한 handleSubmit 자체가 변경되지 않도록 한다.
- **이렇게 하면 불필요하게 ShippingForm을 리렌더링하지 않고도 handleSubmit 함수를 전달할 수 있다.**
- **사용자가 폼을 제출할 때까지 코드가 실행되지 않는다.**

## useCallback으로 감싼 함수 내에서 state 업데이트가 필요한 경우

- 메모된 콜백이 이전 state를 기반으로 state를 업데이트해야 할 수도 있다.
- 아래 예제에서 handleAddTodo 함수는 다음 할일을 추가 (setTodos)하기 위해 todos를 의존성으로 지정했다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

- `업데이터 함수`를 전달하여 의존성을 제거할 수 있다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos에 대한 의존성이 필요하지 않음
  // ...
```

## Effect에서 useCallback으로 감싼 함수 사용하기

- Effect 내부에서 함수를 호출하고 싶은 경우가 있다.

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

- 여기서 options은 반응형 값이다 즉 의존성에 createOptions함수를 선언해야 한다.

```jsx
useEffect(() => {
  const options = createOptions();
  const connection = createConnection();
  connection.connect();
  return () => connection.disconnect();
}, [createOptions]); // 🔴 문제: 이 의존성은 렌더링시마다 변경됨
// ...
```

- useCallback을 사용하면 의존성 문제가 해결된다.

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ roomId 변경시에만 변경됨

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]);  // ✅ createOptions 변경시에만 변경됨
  // ...
```

- 하지만 제일 좋은 방법은 `함수 의존성`을 없애는 방법인다.

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback이나 함수에 대한 의존성이 필요하지 않음!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ roomId 변경시에만 변경됨
  // ...
```

## 커스텀 훅 최적화하기

> 커스텀 훅을 작성하는 경우 반환하는 모든 함수를 useCallback으로 감싸는 것이 좋다.

```jsx
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback(
    (url) => {
      dispatch({ type: "navigate", url });
    },
    [dispatch]
  );

  const goBack = useCallback(() => {
    dispatch({ type: "back" });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

- 이렇게 하면 훅의 소비자가 필요할 때 자신의 코드를 최적화할 수 있다.
