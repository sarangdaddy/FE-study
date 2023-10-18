# useSyncExternalStore

- useSyncExternalStore는 외부 스토어를 구독할 수 있는 React 훅이다.

```jsx
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

- subscribe 함수는 스토어를 구독해야 하고, 구독 취소 함수를 반환해야 한다.
- getSnapshot 함수는 스토어에서 데이터의 스냅샷을 읽어야 한다.
- getServerSnapshot 함수는 스토어에 있는 데이터의 초기 스냅샷을 반환하는 함수다.
  - 오직 서버에서 렌더링할 때와 이를 클라이언트에서 hydrate하는 동안에만 사용된다.
  - 서버 스냅샷은 클라이언트와 서버 간에 동일해야 하며, 일반적으로 서버에서 직렬화하여 클라이언트로 전달한다.
  - 이 함수가 제공되지 않으면 서버에서 컴포넌트를 렌더링할 때 오류가 발생한다.

## 사용법

- 대부분의 React 컴포넌트는 props, state, context에서만 데이터를 읽는다.
- 하지만 때로는 컴포넌트가 시간이 지남에 따라 변경되는 React 외부의 저장소에서 데이터를 읽어야 하는 경우도 있다.
  - React 외부에 state를 보관하는 서드파티 상태 관리 라이브러리.
  - 변이 가능한 값을 노출하는 브라우저 API와 그 변이 사항을 구독하는 이벤트.

```jsx
// App
import { useSyncExternalStore } from "react";
import { todosStore } from "./todoStore.js";

export default function TodosApp() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot
  );
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

// todoStore
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: "Todo #1" }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: "Todo #" + nextId }];
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  },
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

> 가능하면 React 빌트인 state를 useState 및 useReducer와 함께 사용하는 것이 좋다.  
> useSyncExternalStore API는 주로 기존의 비 React 코드와 통합해야 할 때 유용하다.

### 브라우저 API 구독하기

- 컴포넌트에 네트워크 연결이 활성화되어 있는지 여부를 표시하고 싶은 경우 useSyncExternalStore를 사용한다.
- navigator.onLine이라는 속성을 통해 이 정보를 노출한다.
- 이 값은 시간이 지남에 따라 React가 알지 못하는 사이에 변경될 수 있으므로 useSyncExternalStore로 값을 읽어야 한다.

```jsx
import { useSyncExternalStore } from "react";

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? "✅ Online" : "❌ Disconnected"}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
```

- 이제 React는 외부 navigator.onLine API에서 값을 읽는 방법과 그 변경 사항을 구독하는 방법을 알고 있다.
- 네트워크에서 디바이스의 연결을 끊어보면 컴포넌트가 다시 렌더링되는 것을 확인할 수 있다.

### 위 기능을 훅으로 추출하기

```jsx
import { useSyncExternalStore } from "react";

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
```

- 다른 컴포넌트에서 사용할 수 있다.

```jsx
import { useOnlineStatus } from "./useOnlineStatus.js";

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? "✅ Online" : "❌ Disconnected"}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log("✅ Progress saved");
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? "Save progress" : "Reconnecting..."}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

### 서버 렌더링의 지원 추가하기

- React 앱이 서버 렌더링을 사용하는 경우, React 컴포넌트는 브라우저 환경 외부에서도 실행되어 초기 HTML을 생성한다.
- 이로 인해 외부 스토어에 연결할 때 몇 가지 문제가 발생한다.
  - 브라우저 전용 API에 연결하는 경우 서버에 해당 API가 존재하지 않으므로 작동하지 않는다.
  - 타사 데이터 저장소에 연결하는 경우 서버와 클라이언트 간에 일치하는 데이터가 필요하다.
- 이러한 문제를 해결하려면 getServerSnapshot 함수를 useSyncExternalStore의 세 번째 인수로 전달한다.

```jsx
import { useSyncExternalStore } from "react";

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

- getServerSnapshot 함수는 getSnapshot과 유사하지만 오직 두 가지 상황에서만 실행된다.
  - HTML을 생성할 때 서버에서 실행
  - hydration중, 즉,React가 서버 HTML을 가져와서 인터랙티브하게 만들 때 클라이언트에서 실행

> 이를 통해 앱이 상호작용하기 전에 사용될 초기 스냅샷 값을 제공할 수 있다.  
> 서버 렌더링에 의미 있는 초기값이 없다면 컴포넌트가 클라이언트에서만 렌더링되도록 강제 설정할 수 있다.
