# useRef

- useRef는 렌더링에 필요하지 않은 값을 참조할 수 있는 React 훅이다.

```jsx
const ref = useRef(initialValue);
```

- initialValue는 ref 객체의 current 프로퍼티 초기 설정값이다.
- 여기에는 어떤 유형의 값이든 지정할 수 있다. 이 인자는 초기 렌더링 이후부터는 무시된다.

## 반환값 (current)

- 단일 프로퍼티를 가진 객체를 반환한다.
- 처음에는 initialValue로 설정된다.
- ref 객체를 JSX 노드의 ref속성으로 React에 전달하면 React는 반환값(current)를 설정한다.
- 다음 렌더링에서 useRef는 동일한 객체를 반환한다.

## 주의사항

- ref.current는 state와 별개로 변경할 수 있다.
- 단, state를 포함하는 경우 변이하면 안된다.
- ref.current는 변경해도 리렌더링 하지 않는다.
- 초기화를 제외한 렌더링 중에 ref.current를 쓰거나 읽으면 안된다.

# 사용법 1 (랜더링으로 변하지 않는 값으로 사용)

```jsx
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

- useRef는 처음에 제공한 초기값으로 설정된 단일 current 프로퍼티가 있는 ref 객체를 반환한다.
- 다음 렌더링에서 useRef는 동일한 객체를 반환한다.
- ref는 변경할 수 있다. 다만, ref를 변경해도 리렌더링을 촉발하지 않는다.
- 즉, ref는 컴포넌트의 시각적 출력에 영향을 미치지 않는 정보를 저장하는 데 적합하다.
- 예를 들어, interval ID를 저장했다가 나중에 불러와야 하는 경우 ref에 넣을 수 있다.
- ref 내부의 값을 업데이트하려면 current 프로퍼티를 수동으로 변경해야 한다.

```jsx
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  // intervalId를 ref로 저장
  // 이 값은 리렌더링 되더라도 변하지 않고 보존된다.
  intervalRef.current = intervalId;
}

function handleStopClick() {
  // 기억해둔 intervalId로 interval 취소
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

## ref의 특징

- (렌더링할 때마다 재설정되는 일반 변수와 달리) 리렌더링 사이에 정보를 저장할 수 있다.
- (리렌더링을 촉발하는 state 변수와 달리) 변경해도 리렌더링을 촉발하지 않는다.
- (정보가 공유되는 외부 변수와 달리) 각각의 컴포넌트에 로컬로 저장된다.

# 사용법 2 (DOM 조작으로 사용)

- ref를 사용하여 DOM을 조작할 수 있다.
- 먼저 초기값이 null인 ref 객체를 선언한다.

```jsx
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

- ref객체를 ref 속성으로 조작하려는 DOM 노드의 JSX에 전달한다.

```jsx
// ...
return <input ref={inputRef} />;
```

- React가 DOM 노드를 생성하고 화면에 그린 후, React는 ref 객체의 **current프로퍼티를 DOM 노드**로 설정한다.
- 이제 DOM 노드 `<input>`요소 접근해 `focus()`와 같은 메서드를 호출할 수 있습니다.
- 노드가 화면에서 제거되면 React는 current 프로퍼티를 다시 null로 설정한다.

# 사용법 3 (콘텐츠 재생성 피하기)

- `new VideoPlayer()`의 결과는 초기 렌더링에만 사용되지만, 호출 자체는 이후의 모든 렌더링에서도 여전히 계속 이뤄진다.
- 이는 값비싼 객체를 생성하는 경우 낭비일 수 있다.

```jsx
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

- ref로 해결할 수 있다.

```jsx
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

> 일반적으로 렌더링 중에 ref.current를 쓰거나 읽는 것은 허용되지 않는다.  
> 하지만 이 경우에는 결과가 항상 동일하고 초기화 중에만 조건이 실행되므로 충분히 예측할 수 있으므로 괜찮다.

```
ref객체를 하위 컴포넌트에게 전달할 수 있을까?
-> ref를 받는 하위 컴포넌트에서 forwardRef를 사용해야 한다.
```
