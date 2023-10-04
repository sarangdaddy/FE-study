# useEffect

## useEffect 사용의 주의사항

- 외부 시스템과 동기화하려는 목적이 아니라면 Effect가 필요하지 않을지도 모른다.
- 의존성 중 일부가 컴포넌트 내부에 정의된 `객체` 또는 `함수`인 경우 Effect가 필요 이상으로 자주 다시 실행될 위험이 있다.

> - Effect가 상호작용(예: 클릭)으로 인한 것이 아니라면, React는 브라우저가 Effect를 실행하기 전에 업데이트된 화면을 먼저 그린다.
> - Effect가 시각적인 작업(예: 툴팁 위치 지정)을 하고 있고, 지연이 눈에 띄는 경우(예: 깜박임), useEffect를 `useLayoutEffect`로 대체해야 한다.

> - 상호작용(예:클릭)으로 인해 Effect가 발생한 경우에도, 브라우저는 Effect 내부의 state 업데이트를 처리하기 전에 화면을 다시 그릴 수 있다.
> - 만약 브라우저가 화면을 다시 칠하지 못하도록 차단해야 하는 경우라면 useEffect를 `useLayoutEffect`로 바꿔야 한다.

- Effects는 클라이언트에서만 실행된다. 서버 렌더링 중에는 실행되지 않는다.

## [커스텀 훅으로 Effect 감싸기](https://react-ko.dev/reference/react/useEffect#examples-custom-hooks)

- Effect를 수동으로 작성해야 하는 경우가 자주 발생한다면 이는 컴포넌트가 의존하는 일반적인 동작에 대한 커스텀 훅을 추출해야 한다는 신호다.

```jsx
// useChatRoom 커스텀훅
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId,
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

- Effect를 선언적인 API 뒤에 숨긴다.

```jsx
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

- 컴포넌트에서는 effect를 숨기고 선언적으로 사용이 가능하다.

## React가 아닌 위젝 제어하기

- 외부 시스템을 컴포넌트의 특정 prop이나 state와 동기화 하고자 하는 경우가 있다.
- 예를 들어 React 없이 작성된 타사 맵 위젝이나 비디오 플레이어 컴포넌트가 있는 경우,
- Effect를 사용하여 해당 state를 React 컴포넌트의 현재 state와 일치시키는 메서드를 호출할 수 있다.

```jsx
import { useRef, useEffect } from "react";
import { MapWidget } from "./map-widget.js";

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return <div style={{ width: 200, height: 200 }} ref={containerRef} />;
}
```

- Map 컴포넌트의 zoomLevel prop을 변경하면 Effect는 클래스 인스턴스에서 setZoom()을 호출하여 동기화 상태를 유지한다.

## [Effect에서 데이터 페칭함에 주의할 점](https://react-ko.dev/reference/react/useEffect#what-are-good-alternatives-to-data-fetching-in-effects)

- 이펙트는 서버에서 실행되지 않는다.  
  : 서버에서 렌더링되는 초기 HTML에는 데이터가 없는 로딩 state만 포함되기에 효율적이지 않다.

- Effect에서 직접 페칭하면 “네트워크 워터폴”을 만들기 쉽다.  
  : 네트워크가 매우 빠르지 않는 한 모든 데이터를 병렬로 페칭하는 것보다 훨씬 느리다.

- Effects에서 직접 페칭한다는 것은 일반적으로 데이터를 데이터를 미리 로드하거나 캐시하지 않는다는 의미다.  
  : 컴포넌트가 마운트를 해제했다가 다시 마운트하면 데이터를 다시 가져와야 한다.

> [frameworks](https://react-ko.dev/learn/start-a-new-react-project#production-grade-react-frameworks) 사용으로 해결
> 오픈 소스 솔루션 React Query, useSWR, React Router 6.4+ 등으로 client-side 캐시를 사용한다.
