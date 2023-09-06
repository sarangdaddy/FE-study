# useReducer로 Form 객체 컴포넌트 만들기

## useState로 상태를 관리하고 있는 컴포넌트

```tsx
import { ChangeEvent, MouseEvent, useState } from 'react';

export const FormComponent = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeAge = (e: MouseEvent<HTMLButtonElement>) => {
    setAge((age) => age + 1);
  };

  return (
    <>
      <input type="text" value={name} onChange={handleChangeName} autoFocus />
      <button onClick={handleChangeAge}>age + 1</button>
      <h3>
        Hello, {name}. You are {age}.
      </h3>
    </>
  );
};
```

- `name`과 `age`를 객체로 상태를 관리하고 싶다.
- `handleChangeName`, `handleChangeAge`를 단일 함수 하나로 상태를 변경하고 싶다.

> 정해진 action에따라 여러 상태를 하나로 관리하기 위해 reducer는 좋은 선택지가 될수 있다.

## 컴포넌트에 reducer 추가하기

```tsx
const reducer = (state, action) => {};

export const FormComponent = () => {
  const [userForm, dispatch] = useReducer(reducer, { name: 'kim', age: 30 });

```

- 상태에 useReducer를 적용
- 초기값을 추가해준다.

## 사용자 이벤트에 액션을 전달하는 dispatch 함수 적용

```tsx
const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
  dispatch({ type: 'change_name', nextName: e.target.value });
};

const handleChangeAge = (e: MouseEvent<HTMLButtonElement>) => {
  dispatch({ type: 'incremented_age' });
};
```

- dispatch는 상태를 변경하는 함수가 아닌 사용자의 `액션`을 전달하는 역할을 한다.
- `액션`은 객체로 전달한다.

## 상태값을 변경하는 reducer 함수 정의하기

```tsx
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'change_name':
      return { ...state, name: action.nextName };
    case 'incremented_age':
      return { ...state, age: state.age + 1 };
  }
};
```

![](https://velog.velcdn.com/images/sarang_daddy/post/8a77c7da-e1ff-4931-be35-64619485100d/image.gif)

---

## reducer 인수 state와 action 타입 명시

```tsx
interface State {
  name: string;
  age: number;
}

type Action =
  | { type: 'change_name'; nextName: string }
  | { type: 'incremented_age' };
```

- Action 타입에는 여러 형태의 객체가 적용된다.
- 여러 형태의 타입을 명시하기 위해서는 `유니언 타입`이 유용하다.
- `유니언 타입`은 `type`을 통해서 가능하다.

> `interface`는 상속과 같은 활용에 유용하고, 명확히 여러 형태를 적용하기에는 `type`이 적합하다.
