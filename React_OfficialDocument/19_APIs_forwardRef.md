# forwardRef

- 컴포넌트가 ref를 받아 자식 컴포넌트로 전달하도록 하려면 forwardRef()를 호출한다.

```jsx
// 부모
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;

// 자식
import { forwardRef } from "react";

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return <input value={value} onChange={onChange} ref={ref} />;
});

export default MyInput;
```

- 자식 컴포넌트는 부모로 부터 props와 ref를 가지고 forwardRef를 호출한다.
- 그 반환값을 자신으로 하는 JSX 결과물을 반환한다.

## 사용법

- 먼저 ref를 전달 받을 자식 컴포넌트에서 forwardRef를 호출해야 한다.

```jsx
import { forwardRef } from "react";

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

- 이렇게 하면 부모 컴포넌트에서 ref를 전달할 수 있다. (DOM 노출을 허용한다.)

```jsx
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

## 주의사항

- ref를 과도하게 사용하면 안된다.
- `노드로 스크롤하기`, `노드에 초점 맞추기`, `애니메이션 트리거하기`, `텍스트 선택하기` 등 prop으로 표현할 수 없는 필수적인 동작에만 ref를 사용해야 한다.
- prop으로 무언가를 표현할 수 있다면 ref를 사용해서는 안 된다. prop으로 대체하자.
