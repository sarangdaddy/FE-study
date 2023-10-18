# createPortal

- createPortal을 사용하면 일부 자식을 DOM의 다른 부분으로 렌더링할 수 있다.

```jsx
import { createPortal } from "react-dom";

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>;
```

- 포털은 DOM 노드의 물리적 배치만 변경한다.
- 다른 모든 면에서 포털에 렌더링하는 JSX는 이를 렌더링하는 React 컴포넌트의 자식 노드 역할을 한다.
- 예를 들어, 자식은 부모 트리가 제공하는 컨텍스트에 접근할 수 있으며, 이벤트는 React 트리에 따라 자식에서 부모로 버블링 된다.

```jsx
createPortal(children, domNode, key?)
```

- children: JSX 조각 (예: `<div />` 나 `<SomeComponent />`), `Fragment (<>...</>)`,  
  문자열이나 숫자, 또는 이들의 배열과 같이 React로 렌더링할 수 있는 모든 것.
- domNode: document.getElementById()가 반환하는 것과 같은 일부 DOM 노드. 노드는 이미 존재하고 있어야 한다.  
  업데이트 중에 다른 DOM 노드를 전달하면 포털 콘텐츠가 다시 생성된다.
- 선택적 key: 포털의 키로 사용할 고유 문자열 또는 숫자

> createPortal은 JSX에 포함되거나 React 컴포넌트에서 반환될 수 있는 React 노드를 반환한다.  
> React가 렌더링 출력물에서 이를 발견하면, 제공된 children을 제공된 domNode 안에 배치한다.

## 사용법

### DOM의 다른 부분으로 렌더링하기

- 포털을 사용하면 컴포넌트가 일부 자식을 DOM의 다른 위치로 렌더링할 수 있다.
- 이를 통해 컴포넌트의 일부가 어떤 컨테이너에 있든 그 컨테이너에서 “탈출”할 수 있다.
- 예를 들어, 컴포넌트는 모달이나 툴팁을 페이지의 나머지 부분 위에, 외부에 표시할 수 있다.

```jsx
import { createPortal } from "react-dom";

export default function MyComponent() {
  return (
    <div style={{ border: "2px solid black" }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

- 두 번째 p는 부모 div가 아닌 body에 배치된다.

### 포털로 모달 렌더링하기

- 모달을 불러오는 컴포넌트가 overflow: hidden 또는 모달을 방해하는 다른 스타일이 있는 컨테이너 안에 있더라도,
- 포털을 사용하여 나머지 페이지 위에 떠 있는 모달을 만들 수 있다.

```jsx
// Modal
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}


// Portal
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

### React 컴포넌트를 비 React 서버 마크업으로 렌더링하기

- 포털은 React 루트가 React로 빌드되지 않은 정적 페이지 또는 서버 렌더링 페이지의 일부일 때 유용할 수 있다.
- 예를 들어, 페이지가 Rails와 같은 서버 프레임워크로 빌드된 경우, 사이드바와 같은 정적 영역 내에 상호작용 가능한 영역을 만들 수 있다.
- 여러 개의 개별 React 루트를 사용하는 것과 비교하여, 포털을 사용하면 **앱의 일부가 DOM의 다른 부분에 렌더링되더라도**  
  앱을 공유 state를 가진 단일 React 트리로 처리할 수 있다.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My app</title>
  </head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```jsx
import { createPortal } from "react-dom";

const sidebarContentEl = document.getElementById("sidebar-content");

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(<SidebarContent />, sidebarContentEl)}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

<img src="https://velog.velcdn.com/images/sarang_daddy/post/c49ab5a7-e730-4399-a635-c7d842a5a0cc/image.png" width="50%">

### React 컴포넌트를 비 React DOM 노드로 렌더링하기

- 포털을 사용해 React 외부에서 관리되는 DOM 노드의 콘텐츠를 관리할 수도 있다.
- 예를 들어, React가 아닌 맵 위젯과 통합하고 팝업 안에 React 콘텐츠를 렌더링하고 싶다고 가정해 보자.
- 이렇게 하려면 렌더링할 DOM 노드를 저장할 popupContainer state 변수를 선언한다.

```jsx
const [popupContainer, setPopupContainer] = useState(null);
```

- 서드파티 위젯을 만들 때 위젯이 반환하는 DOM 노드를 저장하여 렌더링할 수 있도록 한다.

```jsx
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

- 이렇게 하면 createPortal을 사용하여 React 콘텐츠가 사용 가능해지면 popupContainer로 렌더링할 수 있다.

```jsx
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null &&
      createPortal(<p>Hello from React!</p>, popupContainer)}
  </div>
);
```

- 서드 파티 위젯에 React의 요소를 렌더링 할 수 있다.

```jsx
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createMapWidget, addPopupToMapWidget } from "./map-widget.js";

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null &&
        createPortal(<p>Hello from React!</p>, popupContainer)}
    </div>
  );
}
```
