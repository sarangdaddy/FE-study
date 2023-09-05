# memo

- memo를 사용하면 컴포넌트의 props가 변경되지 않은 경우 리렌더링을 건너뛸 수 있다.
- memo로 컴포넌트를 감싸 `메모화된 버전의 컴포넌트`를 얻을 수 있다.
- 메모화된 버전의 컴포넌트는 props가 변경되지 않는 한 **부모 컴포넌트가 리렌더링할 때 같이 리렌더링하지 않는다**.

```jsx
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

- `SomeComponent` 메모화 하고 싶은 컴포넌트
- `arePropsEqual?` 이전 props와 현재 props를 받는 함수. (일반적으로 지정하지 않는다.)

# memo 사용하기

```jsx
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

- 컴포넌트는 항상 `순수한 렌더링 로직`을 가져야 한다.
- 즉 props, state, context가 변경되지 않으면 동일한 출력을 한다.
- memo를 적용하면 이 상황을 준수했을 때 리렌더링 하지 않도록 할수 있다.

> memo는 성능 최적화를 위해서만 사용한다. (memo 존재 여부로 작동이 안되면 근본적인 다른 문제가 존재한다.)

## 컴포넌트를 memo화 해도 렌더링이 일어나는 경우

- 컴포넌트 자체 state가 변경되면 리렌더링 된다.
- 컴포넌트에서 사용중인 context가 변경되면 리렌더링 된다.

## memo를 효율적으로 사용하는 방법

### props 변경 최소화하기

- prop이 객체인 경우 `useMemo`를 사용하여 부모 컴포넌트가 해당 객체를 다시 만드는 것을 방지한다.

```jsx
function Page() {
  const [name, setName] = useState("Taylor");
  const [age, setAge] = useState(42);

  const person = useMemo(() => ({ name, age }), [name, age]);

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

> 객체는 동일한 값을 참조해도 마운트시 새로운 객체로 생성하기에 useMemo를 활용하는것이 좋다.

### 사용자 정의 비교 함수 지정하기

- 메모화된 컴포넌트의 props 변경이 최소화하는 것이 불가능할 수 있다.
- 이 경우 이전 props와 새 props를 비교할때 동등성이 아닌 `커스컴 비교 함수`를 제공할 수 있다.
- `커스텀 비교 함수`는 memo의 두 번째 인자로 전달된다.

```jsx
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

- `arePropsEqual` 커스텀 함수를 전달하여 이전 props와 새로운 props를 비교한다.

> 커스텀 비교 함수는 성능잘 잘 따져보고 사용해야한다. 특히 `깊은 비교`는 리렌더링보다 더 큰 성능을 차지한다.

# 주의사항

> prop이 객체, 배열, 함수인 경우 변경되지 않아도 리렌더링이 일어난다?

- React는 이전 prop과 새 prop을 얕은 비교로 동등성을 파악한다.
- 즉, 각각의 새 prop이 이전 prop과 `참조가 동일`한지 여부를 고려한다. (참조 값을 비교하는게 아니다)
- 부모가 다시 렌더링될 때마다 새 객체나 배열을 생성하면 설령 개별 요소들이 모두 동일하더라도 여전히 React는 변경된 것으로 간주한다.
- 마찬가지로 부모 컴포넌트를 렌더링할 때 새 함수를 만들면 React는 함수의 정의가 동일하더라도 변경된 것으로 간주한다.
- 이를 방지하려면 부모 컴포넌트에서 prop을 단순화하거나 메모화 해야한다.
