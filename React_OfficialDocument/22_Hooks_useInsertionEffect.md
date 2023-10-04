# useInsertionEffect

> useInsertionEffect는 CSS-in-JS 라이브러리 작성자를 위한 훅이다.  
> CSS-in-JS 라이브러리에서 작업 중에 스타일을 주입하고자 하는 경우가 아니라면, useEffect나 useLayoutEffect가 더 나을 수 있다.

```jsx
useInsertionEffect(setup, dependencies?)
```

- setup  
  : Effect의 로직이 포함된 함수. 컴포넌트가 DOM에 추가되기 전에 React는 셋업 함수를 실행한다.  
   변경된 의존성으로 다시 렌더링할 때마다 React는 (클린업 함수를 정의한 경우) 먼저 이전 값으로 클린업 함수를 실행한 다음,  
   새 값으로 셋업 함수를 실행합니다. 컴포넌트가 DOM에서 제거되기 전에 React는 클린업 함수를 한 번 더 실행한다.

- 선택적 dependencies  
  : setup 코드 내에서 참조된 모든 반응형 값의 목록.  
  반응형 값에는 props, state, 컴포넌트 본문 내부에서 직접 선언된 모든 변수와 함수가 포함된다.  
  이 인수를 생략하면 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 실행됩니다.

## 주의사항

- Effect는 클라이언트에서만 실행된다. 서버 렌더링 중에는 실행되지 않는다.
- useInsertionEffect 내부에서는 state를 업데이트할 수 없다.
- useInsertionEffect가 실행될 때까지는 refs가 아직 첨부되지 않았고, DOM이 아직 업데이트되지 않았다.

## 사용법

### CSS-in-JS 라이브러리에서 동적 스타일 삽입하기

- 기존에는 일반 CSS를 사용해 React 컴포넌트의 스타일을 지정했다.

```js
// JS 파일 작성 코드:
<button className="success" />

// CSS 파일 작성 코드:
.success { color: green; }
```

- CSS-in-JS 라이브러리에서 런타임 중에 동적으로 `<style>`태그를 삽입하려고 하는 경우가 있다.
- 이 경우, 런타임 주입이 React 라이프사이클에서 잘못된 시점에 발생하면 속도가 매우 느려질 수 있다.

> 이 문제를 해결해 주는게 useInsertionEffect다.

```jsx
// CSS-in-JS 라이브러리 코드 내부에
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // 앞서 설명한 것처럼 <style> 태그의 런타임 주입은 권장하지 않습니다.
    // 하지만 런타임 주입을 해야한다면, useInsertionEffect에서 수행하는 것이 중요합니다.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS("...");
  return <div className={className} />;
}
```

- useInsertionEffect를 호출하여 DOM 변경 전에 스타일을 주입한다.

> `렌더링 중에 스타일을 주입`한다면 리엑트는 컴포넌트 트리를 렌더링하는 동만 매 프레임을 다시 계산해야 한다.  
> useInsertionEffect를 사용한다면 `<style>` 태그가 이미 주입되어 있기 때문에 이 문제를 해결해 준다.
