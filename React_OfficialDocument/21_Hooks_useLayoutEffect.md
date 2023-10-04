# useLayoutEffect

- useLayoutEffect는 브라우저가 화면을 다시 채우기 전에 실행되는 버전의 useEffect다.
- useLayoutEffect의 목적은 컴포넌트가 렌더링에 레이아웃 정보를 사용하도록 하는 것이다.

```jsx
useLayoutEffect(setup, dependencies?)
```

- setup  
  : Effect의 로직이 포함된 함수. 컴포넌트가 DOM에 추가되기 전에 React는 셋업 함수를 실행한다.  
   변경된 의존성으로 다시 렌더링할 때마다 React는 (클린업 함수를 정의한 경우) 먼저 이전 값으로 클린업 함수를 실행한 다음,  
   새 값으로 셋업 함수를 실행합니다. 컴포넌트가 DOM에서 제거되기 전에 React는 클린업 함수를 한 번 더 실행한다.

- 선택적 dependencies  
  : setup 코드 내에서 참조된 모든 반응형 값의 목록.  
  반응형 값에는 props, state, 컴포넌트 본문 내부에서 직접 선언된 모든 변수와 함수가 포함된다.  
  이 인수를 생략하면 컴포넌트를 다시 렌더링할 때마다 Effect가 다시 실행됩니다.

## 사용법

### 브라우저에서 화면을 다시 그리기 전 레이아웃 측정하기

- 일반적으로 컴포넌트는 렌더링하기 전에 화면에서의 위치와 크기를 미리 알 필요가 없다.
- JSX를 반환하고 레이아웃을 계산하고 그린다.
- 하지만 툴팁과 같이 그려진 레이아웃에 추가로 나온다면?
- 자신의 위치와 크기를 고려해서 그려져야 한다.

> 툴팁과 같은 경우 나오기 전에 자신이 나오는 위치와 크기를 고려하게 하고 싶다.

```jsx
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet
  // 아직 실제 height 값을 모릅니다.

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
    // 실제 높이를 알았으니 이제 리렌더링 합니다.
  }, []);

  // ...use tooltipHeight in the rendering logic below...
  // ...아래에 작성될 렌더링 로직에 tooltipHeight를 사용합니다...

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

- Tooltip은 초기 tooltipHeight = 0으로 렌더링된다. (따라서 툴팁의 위치가 잘못 지정될 수 있음).
- React는 이를 DOM에 배치하고 useLayoutEffect에서 코드를 실행한다.
- useLayoutEffect는 툴팁 콘텐츠의 높이를 측정하고 즉시 다시 렌더링을 촉발한다.
- Tooltip이 실제 tooltipHeight로 다시 렌더링된다.(따라서 툴팁이 올바르게 배치된다).
- React가 DOM에서 이를 업데이트하면 브라우저에 툴팁이 최종적으로 표시된다.
