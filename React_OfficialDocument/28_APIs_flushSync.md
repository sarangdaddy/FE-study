# flushSync

- flushSync를 사용하면 강제로 제공된 콜백 내부의 모든 업데이트를 동기적으로 flush(강제로 비워냄)하도록 할 수 있다.
- 이렇게 하면 DOM이 즉시 업데이트된다.

```jsx
import { flushSync } from "react-dom";

flushSync(() => {
  setSomething(123);
});
```

- flushSync를 호출하면 React가 보류 중이던 작업을 강제로 flush하고 DOM을 동기적으로 업데이트 한다.
- callback : 함수. React는 즉시 이 콜백을 호출하고 여기에 포함된 모든 업데이트를 동기적으로 flush한다.
- 또한 보류 중인 모든 업데이트, Effect 또는 Effect 내부의 업데이트를 flush할 수도 있다.
- 이 flushSync 호출의 결과로 업데이트가 일시 중단되면 폴백이 다시 표시될 수 있다.

## 사용법

### 서드파티 통합을 위한 업데이트 flush하기

- flushSync를 사용하면 React가 콜백 내부의 모든 state 업데이트를 강제로 동기적으로 flush하도록 할 수 있다.
- 예를 들어, onbeforeprint 브라우저 API를 사용하면 인쇄 대화 상자가 열리기 직전에 페이지를 변경할 수 있다.
- 이 기능은 문서를 인쇄할 때 더 보기 좋게 표시할 수 있는 사용자 지정 인쇄 스타일을 적용하는 데 유용하다.
- 아래 예시에서는 onbeforeprint콜백 내부에서 flushSync를 사용하여 React state를 DOM에 즉시 “flush”한다.
- 그런 다음 인쇄 대화 상자가 열릴 때 isPrinting이 “yes”를 표시한다.

> 즉, 비동기로 변경되던 state를 강제로 먼저 실행시켜 버린다.

- flushSync를 사용하지 않으면 인쇄 대화 상자에 isPrinting이 “아니요”로 표시된다.
- 이는 React가 업데이트를 비동기적으로 일괄 처리하고 state가 업데이트되기 전에 인쇄 대화 상자가 표시되기 때문이다.
