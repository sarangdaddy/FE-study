# useReducer

- useReducer는 컴포넌트에 reducer를 추가할 수 있는 React Hook이다.
- useState와 같이 컴포넌트의 상태를 관리하는데 사용된다.

```tsx
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

## 매개변수

```tsx
useReducer(reducer, initialArg, init?)
```

### reducer

- state가 업데이트되는 방식을 지정하는 reducer 함수다.
- 순수한 함수여야 한다.
- `state`, `action`을 인자로 받고, `state`를 반환해야 한다.

### initialArg ({ age: 42 })

- 초기 state가 계산되는 값이다.
- optional `init`인자에 따라 달라진다.

### optional (init)

- 초기 state 계산 방법을 지정하는 `초기화 함수`다.
- 지정하지 않으면 초기 state는 initialArg 값으로 설정된다.
- 지정되어 있다면 초기 state는 init(initialArg) 결과값으로 설정된다.

## 반환값

- useReducer는 두 개의 값을 가진 배열을 반환한다.

1. 현재 state
2. state를 업데이트하고 리렌더링을 촉발할 수 있는 `dispatch function`

### dispatch function

- dispatch 함수는 state를 다른 값으로 업데이트하고 다시 렌더링을 촉발한다.

```jsx
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

> React는 reducer 함수에 현재 state와 `dispatch한 액션`을 전달하고 다음값으로 설정한다.

### action

- 사용자가 수행한 작업이다.
- 보통 type 속성이 있는 객체다.

## 사용법

```jsx
import { useReducer } from "react";

function reducer(state, action) {
  // 3️⃣
  if (action.type === "incremented_age") {
    return {
      age: state.age + 1,
    };
  }
  throw Error("Unknown action.");
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 }); // 1️⃣

  return (
    <>
      <button
        onClick={() => {
          dispatch({ type: "incremented_age" }); // 2️⃣
        }}
      >
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

- 1️⃣ 관리하고자 하는 상태를 useReducer로 설정한다.
- 2️⃣ 사용자의 이벤트(액션)에 반응하여 상태를 변경할 수 있는 dispatch 함수를 호출
- 3️⃣ 현재 state와 액션을 reducer함수에 전달하고 다음 state를 계산하고 반환한다.

> useReducer는 이벤트 핸들러의 state 업데이트 로직을 컴포넌트 외부의 단일 함수로 옮길 수 있다.  
> [useState와 useReducer 중 하나를 선택하는 방법](https://react-ko.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

### Form 객체 reducer로 상태 관리하기

1.  컴포넌트에 reducer 추가하기

```tsx
const reducer = (state, action) => {};

export const FormComponent = () => {
  const [userForm, dispatch] = useReducer(reducer, { name: 'kim', age: 30 });

```

- 상태에 useReducer를 적용
- 초기값을 추가해준다.

2. 사용자 이벤트에 액션을 전달하는 dispatch 함수 적용

```tsx
const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: "change_name", nextName: e.target.value });
};

const handleChangeAge = (e: MouseEvent<HTMLButtonElement>) => {
  dispatch({ type: "incremented_age" });
};
```

- dispatch는 상태를 변경하는 함수가 아닌 사용자의 `액션`을 전달하는 역할을 한다.
- `액션`은 객체로 전달한다.

3. 상태값을 변경하는 reducer 함수 정의하기

```tsx
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "change_name":
      return { ...state, name: action.nextName };
    case "incremented_age":
      return { ...state, age: state.age + 1 };
  }
};
```

### 초기 state 재생성 방지하기

```jsx
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

- 초기값은 처음에만 사용되지만 `createInitialState()`을 호출하면 렌더링마다 호출한다.
- 값이 큰 함수라면 성능에 좋지 않다.

> 초기값이 함수로 반환된다면 세 번째 인수로 초기화 함수를 전달하자

```jsx
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

- createInitialState `함수 자체`가 전달되었기 때문에 이후 렌더링에서 재호출이 일어나지 않는다.
