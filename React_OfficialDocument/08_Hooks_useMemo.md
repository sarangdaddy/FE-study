# useMemo

useMemo는 `리렌더링 사이`의 계산 결과를 캐시할 수 있는 React 훅이다.

```jsx
const cachedValue = useMemo(calculateValue, dependencies);
```

## useMemo의 매개변수

- calculateValue  
  : 캐시하려는 값을 계산하는 `함수`  
  : 이 함수는 순수해야한다. (인자를 받지 않고, 값을 반드시 반환)  
  : 초기 렌더링 중에 함수를 호출한다.  
  : 이후 렌더링에서는 `의존성`이 변경되었다면, calculateValue를 호출하고 결과를 반환한다.  
  : 결과값은 나중에 재사용할 수 있도록 저장한다.

- dependencies  
  : calculateValue 코드 내에서 참조되는 모든 `반응형 값`들의 목록  
  : React는 의존성 값을 이전값과 비교한다.

## useMemo의 반환값

- 초기 렌더링에서 useMemo는 인자 없이 calculateValue를 호출한 결과를 반환한다.
- 이후 렌더링에서는 의존성이 변경된 경우에 calculateValue를 다시 호출하여 그 결과를 반환한다.
- 의존성이 변경되지 않은 경우에는 마지막 렌더링에서 저장된 값을 반환한다.

> 반환 값을 캐싱하는 것을 `메모화`라 하며, 이것이 useMemo 훅이다.

## useMemo 사용

```jsx
import { useMemo } from "react";

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

- `() => filterTodos(todos, tab)` 인자 없이 계산값을 반환하는 `계산 함수`
- `[todos, tab]` 컴포넌트 내에서 계산에 사용되는 모든 반응값 `의존성 목록`
- 초기 렌더링에서 계산된 값을 visibleTodos에 저장
- **이후 렌더링에서 의존성이 변경되지 않았다면 계산 없이 저장 중인 visibleTodos에 값 반환**
- 의존성이 변경되었다면 새로 계산한 값을 반환한다.

> useMemo는 의존성이 변경되기 전까지 계산 결과를 캐시로 유지한다.  
> 이는 불필요한 계산을 막아준다.

### 비용이 많이 드는 재계산 생략하기

- 기본적으로 React는 컴포넌트가 다시 렌더링 되면 컴포넌트 전체 본문을 다시 실행한다.
- 위 예제에서 TodoList거 state를 업데이트 하거나 새로운 props를 받는 경우 `filterTodos`가 다시 실행된다.
- `filterTodos`가 큰 배열이거나 고비용의 계산을 수행한다면, **같은 값을 다시 계산하는 행위를 건너뛰고 싶을 수 있다.**

> 이처럼 useMemo는 성능 최적화 목적으로 사용된다.  
> 코드의 작동 여부와는 상관이 없다.

```jsx
import { useMemo } from "react";

function filterTodos(todos, tab) {
  return todos.filter((todo) => {
    if (tab === "all") {
      return true;
    } else if (tab === "active") {
      return !todo.completed;
    } else if (tab === "completed") {
      return todo.completed;
    }
  });
}

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- 위 예제에서 filterTodos는 `메모화` 되었다.
- props로 전달받는 todos, tab이 변경된 경우에는 filterTodos가 다시 계산된다.
- theme만 변경된 경우에는 filterTodos가 이전 계산 값을 사용하여 불필요한 계산을 막아준다.

### 컴포넌트의 리렌더링 건너뛰기 (useMemo & memo)

- 어떤 경우에는 useMemo를 사용하여 자식 컴포넌트의 리렌더링 성능을 최적화할 수 있다.

```jsx
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

- TodoList 컴포넌트는 visibleTodos를 List 자식 컴포넌트에게 전달한다.
- TodoList 컴포넌트가 리렌더링되면 List도 반드시 리렌더링 된다.
- props가 변하지 않으면 렌더링을 막아주는 `memo`를 List에 적용해보자.

```jsx
import { memo } from "react";

const List = memo(function List({ items }) {
  // ...
});
```

- props가 동일하다면 리렌더링이 일어나면 안된다.
- 하지만 visibleTodos는 같은 값을 반환하더라도 **이는 다른 배열이다.**
- 때문에 List 컴포넌트는 지금도 무조건 렌더링이 발생한다.

> TodoList가 렌더링되면서 생성된 visibleTodos는 배열이기에 같은 값을 가져도 다른 객체다.

```jsx
export default function TodoList({ todos, tab, theme }) {
  // 리렌더링 사이에 계산 결과를 캐싱하도록 합니다...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
    // ...따라서 여기의 의존성이 변경되지 않는다면 ...
  );
  return (
    <div className={theme}>
      {/* ...List는 같은 props를 전달받게 되어 리렌더링을 건너뛸 수 있게 됩니다 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

- visibleTodos 계산을 useMemo로 감싸면, 리렌더링 사이에 동일한 값을 보장한다.
- 즉 새로운 객체가 계산된 것이 아니다.
- 객체, 배열과 같은 경우에는 useMemo를 통해 memo로 감싼 List 컴포넌트의 리렌더링을 막을 수 있다.

### 다른 훅의 의존성 메모화

- 컴포넌트 본문에서 직접 생성한 객체에 의존하는 계산이 있다고 생각하자.

```jsx
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 주의: 컴포넌트 내부에서 생성한 객체 의존성
  // ...
```

- 위 예제의 경우 컴포넌트가 실행될 때마다 searchOptions이 생성되기에 의미가 없다.

```jsx
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ allItems 또는 text 변경시에만 변경됨
  // ...
```

- visibleItems은 searchOptions이 아닌 searchOptions을 변경시켜주는 text에 의존되었다.

### 함수 메모화

- 자식 컴포넌트가 memo로 감싸져 있고, prop으로 함수를 전달한다고 생각하자.

```jsx
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post("/product/" + productId + "/buy", {
      referrer,
      orderDetails,
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

- `{}`가 다른 객체를 생성하는 것과 같이, `function() {} 함수 선언` 및 `() => {} 표현식` 등은 모두 **리렌더링할 때마다 다른 함수를 생성**한다.
- memo를 사용해도 자식 컴포넌트를 리렌더링 된다.

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

- 함수 handleSubmit(props)를 useMemo로 전달한다.
- useMemo로 함수를 메모화하려면 계산 함수가 다른 함수를 반환해야 한다.
- 중첩함수를 추가로 작성하는 것은 가독성이 좋지않다.
- 그래서 React는 useCallback 훅을 제공해준다.

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback(
    (orderDetails) => {
      post("/product/" + productId + "/buy", {
        referrer,
        orderDetails,
      });
    },
    [productId, referrer]
  );

  return <Form onSubmit={handleSubmit} />;
}
```

> 함수를 메모화 하는 경우에는 useCallback으로 중첩함수를 생략할 수 있다.

# useMemo는 반드시 사용해야 할까?

- useMemo는 성능을 최적화 해주는 역할만 한다.
- useMemo는 `렌더링 단계에서만` 최적화를 제공한다.

> 즉, 초기화에는 오히려 속도를 늦추고 이 효과가 중첩될 수 있다.

아래 참고 문서를 참고하고 useMemo의 사용성에 대해서 고민해보자.

[useMemo를 사용하는 것을 당장 멈추세요!](https://velog.io/@lky5697/stop-using-usememo-now)  
[정말 리액트에서 useMemo를 사용해야 할까요?](https://github.com/yeonjuan/dev-blog/blob/master/JavaScript/should-you-really-use-usememo.md)
