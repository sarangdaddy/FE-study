## 🔍 상태 업데이트와 리렌더링 과정

### 1. 사용자에 의해 이벤트 발생

- 사용자가 버튼을 클릭하거나 입력을 하는 등의 이벤트가 발생한다.

### 2. 이벤트 핸들러 함수 실행

- 해당 이벤트에 대한 핸들러 함수가 실행된다. 예를 들어 버튼 클릭에 대한 `handleClick` 함수가 있다.

### 3. 이벤트 핸들러 안에서 useState의 setter 함수 실행

- 이벤트 핸들러 함수 내에서 `useState`의 setter 함수(ex:setAge)가 호출된다.
- 이 함수 호출로 인해 React는 상태 변경을 `예약`한다.
- 실제로 상태는 바로 업데이트 되지 않고 예약 된다. (setter 함수가 스택에 쌓이는 개념과 비슷하다.)
- _**상태 변경을 `일괄적`으로 처리하기 위해서 예약을 한다.**_
- 예약된 setter 함수들은 이벤트 루프가 완료될 때까지 대기한다.

### 4. 일괄 처리 (Batching)

- 일괄 처리에서 대기 중인 setter 함수가 모두 처리된다.
- setter 함수가 `직접적인 상태 할당`인 경우 상태에 새로운 값을 `직접` 제공한다.
- setter 함수가 `업데이터 함수`인 경우 이전 상태를 기반으로 새로운 상태를 `계산`한다.
- 이렇게 일괄 처리로 변경된 상태들이 `최종 상태`가 결정된다.
- 일괄 처리 덕분에 여러 상태값이 변경되어도 렌더링은 한번만 일어난다.
- _**React는 여러 상태 업데이트를 일괄 처리하는 방식을 사용하여 효율을 높인다.**_
- 아직 `최종 상태` 값이 반환된 것은 아니다.

### 5. 리렌더링 (컴포넌트 함수 실행)

- 일괄 처리에서의 `최종상태`가 기존 상태와 동일하다면 리렌더링은 생략된다.
- 상태가 변경되었다고 판단되면 React는 컴포넌트를 리렌더링 한다.
- **_이 과정에서 useState는 최신 상태를 반환하고 변수에 할당한다._**

### 6. JSX 스냅샷 (Virtual DOM 생성)

- 리렌더링이 일어나면 새로운 JSX 구조가 생성된다.
- 리액트는 새로운 JSX 구조를 스냅샷으로 저장한다.
- 이것은 Virtual DOM의 형태로 `메모리 상에` 존재한다.

### 7. React가 JSX를 실제 DOM에 반영

- React는 `이전 상태의 Virtual DOM`과 `새로운 Virtual DOM`을 비교하여 (Diffing 알고리즘), 실제 DOM에 반영할 변경 사항을 결정한다.
- _**즉, 변경이 필요한 DOM만이 업데이트 된다.**_

### 실제 코드로 리렌더링 과정을 알아보기

```jsx
import React, { useState } from "react";

function MyComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>{count}</p>
    </div>
  );
}
```

- button을 클릭하면 이벤트가 실행 setCount로 상태 업데이트 예약
- 이벤트 루프가 종료되면 상태 업데이트 일괄처리
- count + 1 로 최종상태 결정
- 이전 상태값과 다르기에 리렌더링 실행
- count + 1 최종상태 값 반환
- 새로운 JSX 스냅샷 저장
- 이전 JSX 스냅샷과 새로운 JSX 스냅샷 비교
- `<p>` 태그 내부의 텍스트가 변경되므로, 실제 `<p>` DOM 변경
- `<button>` 태그는 변경되지 않았으므로, 이 부분은 그대로 유지

> 이 과정을 통해 React는 효율적으로 UI를 업데이트하며, 개발자에게 `선언적인 프로그래밍` 방식을 가능하게 한다.

## ⛔️ useState 사용에 주의사항

- set 함수는 다음 렌더링에 대한 state 변수만 업데이트 한다.
- **set 함수를 호출한 후에도 렌더링 과정에서 state 변수에는 변경 전 값이 담겨져 있다.**
- set 함수로 호출한 값이 이전 값과 같다면 리렌더링 하지 않는다.
- **React는 state 업데이트를 `일괄 처리`한다. 모든 이벤트 핸들러가 실행되고 set 함수를 호출한 후에 화면을 업데이트 한다.**
- DOM에 접근하기 위해 React가 화면을 일찍 업데이트하도록 강제해야 하는 경우 `flushSync`를 사용한다.
- React는 렌더링 도중 set 함수를 만나면 렌더링 중인 내용을 버리고 새로운 state로 다시 렌더링을 시도한다.

## 📝 예제로 이해하는 useState

### 이전 state를 기반으로 state 업데이트하기 (업데이터 함수)

```jsx
const [age, setAge] = useState(40);

const handleClick = () => {
  setAge(age + 1);
  setAge(age + 1);
  setAge(age + 1);
};
```

- 위 예제 처럼 설정자 함수로 이전 state를 기반으로 state 값을 업데이트 할 수 있다.
- 하지만 결과는 43이 아닌 41로 나온다.

> 렌더링 중 state age값은 업데이트 되지 않기 때문이다.

- 업데이트 된 state를 렌더링 중에 사용하고 싶다면 설정자 함수에 `업데이터 함수`를 전달해야 한다.

```jsx
function handleClick() {
  setAge((a) => a + 1); // setAge(40 => 41)
  setAge((a) => a + 1); // setAge(41 => 42)
  setAge((a) => a + 1); // setAge(42 => 43)
}
```

- `a => a + 1` 은 업데이터 함수다.
- 업테이터 함수는 대기 중인 state를 가져와서 다음 state를 계산한다.

1. a => a + 1은 대기 중인 state로 40를 받고 다음 state로 41을 반환한다.
2. a => a + 1은 대기 중인 state로 41을 받고 다음 state로 42를 반환한다.
3. a => a + 1은 대기 중인 state로 42를 받고 다음 state로 43를 반환한다.
4. 대기 중인 다른 업데이트가 없으므로, React는 결국 43을 현재 state로 저장한다.

> 설정하려는 state가 이전 state에서 계산되는 경우 업데이터 함수를 전달하자.

> ❓ 만약 어떤 state가 `다른 state` 변수의 이전 state로부터 계산된다면?  
> 💡 이를 하나의 객체로 결합하고 `reducer`를 사용하는 것이 좋다.

### 이전 렌더링에서 얻은 정보 저장하기

- 보통 이벤트 핸들러에서 state를 업데이트 한다.
- 드물게 렌더링된 값을 기반으로 state를 조정해야 하는 경우가 있다. ❓

```jsx
import { useState } from "react";

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? "increasing" : "decreasing");
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

- count는 props로 전달 받은 값이다.
- trend는 count의 값이 증가했는지 감소했는지 알고 싶다. ❗️
- trend는 count의 렌더링 결과 값(렌더링된 값)을 가지고 판단해야한다.

> 일반적인 패턴은 아니지만 useEffect를 사용하는 것 보다 효율적이다. (두 번 렌더링 방지)
