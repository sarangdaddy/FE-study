# startTransition

- startTransition은 UI를 차단하지 않고 state를 업데이트할 수 있다.
- 컴포넌트에서 state 업데이트 함수에 startTransition을 사용한다.

```jsx
startTransition(scope);
```

- scope : set 함수를 호출하여 state를 업데이트 하는 함수.

```jsx
import { startTransition } from "react";

function TabContainer() {
  const [tab, setTab] = useState("about");

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

- selectTab 함수가 호출되면, startTransition은 setTab(nextTab) 상태 업데이트를 비동기적으로 수행한다.
- 이것은 즉각적인 업데이트가 아니라, React의 스케줄러에 따라 적절한 시점에 수행된다.
- 만약 사용자가 selectTab 함수 호출 직후에 다른 상호작용 (예: 버튼 클릭)을 수행한다면,
- React는 그 상호작용에 우선하여 즉각적으로 반응한다.
- startTransition으로 감싸진 setTab 업데이트는 다른 중요한 작업에 방해받지 않도록 지연될 수 있다.
- 이러한 방식으로, 앱은 탭 전환과 같은 덜 중요한 작업과 사용자의 직접적인 상호작용 사이의 균형을 찾을 수 있다.
- 결과적으로 사용자는 앱이 더 반응적이라고 느낄 수 있다.

> 즉, startTransition을 사용하면 setTab 상태 업데이트가 앱의 다른 중요한 작업에 방해되지 않도록 비동기적으로 처리된다. 이로 인해 앱의 반응성이 향상된다.

```
startTransition은 사용자 인터페이스의 반응성을 향상시키기 위해 만들어진 API다.
이 API는 사용자에게 중요한 상호 작용(예: 버튼 클릭이나 스크롤)을 빠르게 반응하게 하면서,
그로 인해 발생할 수 있는 덜 중요한 작업들(예: 데이터 패치 후의 UI 업데이트)을 지연시킬 수 있게 해준다.
```

## startTransition의 주요 특징

- 반응성 향상: 사용자에게 빠른 응답을 제공하며, 덜 중요한 업데이트는 나중에 수행된다.
- 비동기 업데이트: startTransition 내부에서 상태를 설정하면, 해당 상태 업데이트는 비동기적으로 처리된다.
- 전환 지연: 기본적으로 React는 startTransition 내부의 업데이트를 최대 3초 동안 지연시킬 수 있다.

## 주의사항

- Pending 상태 추적: startTransition은 트랜지션이 진행 중인지(pending)를 직접 추적하는 방법을 제공하지 않는다. 이를 위해서는 useTransition 훅을 사용해야 한다.
- 업데이트 감싸기: startTransition으로 업데이트를 감쌀 수 있는 경우는 해당 상태의 set 함수에 접근할 수 있을 때다.  
  prop이나 커스텀 훅의 반환값에 반응하여 트랜지션을 시작하려면 useDeferredValue를 사용해야 한다.
- 동기식 함수: startTransition에 전달하는 함수는 동기적이어야 한다. 이 함수 내에서 발생하는 상태 업데이트만 트랜지션으로 처리된다.  
   함수 외부에서 발생하는 상태 업데이트는 트랜지션으로 처리되지 않는다.
- 트랜지션 업데이트의 중단: 다른 상태 업데이트에 의해 트랜지션으로 표시된 상태 업데이트가 중단될 수 있다.
- 텍스트 입력 제어 불가: 트랜지션 업데이트로 텍스트 입력을 제어할 수 없다.
- 일괄 처리된 트랜지션: 현재 React는 동시에 여러 트랜지션이 진행 중일 경우 이를 일괄 처리한다. 이는 향후 릴리스에서 변경될 수 있다.
