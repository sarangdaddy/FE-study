# StrictMode

- StrictMode를 사용하여 내부의 컴포넌트 트리에 대한 추가 개발 동작 및 경고를 활성화할 수 있다.

## 활용

- 불완전한 렌더링으로 인한 버그를 찾기 위해 한 번 더 렌더링한다.
- Effect 클린업이 누락되어 발생한 버그를 찾기위해 Effect를 한 번 더 실행한다.
- 지원 중단된 API의 사용 여부를 확인한다.

# Profiler

- `<Profiler>`를 사용하면 프로그램적으로 React 트리의 렌더링 성능을 측정할 수 있다.

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

- 특정 컴포넌트 렌더링 성능 측정이 가능하다.

```jsx
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

- id: 측정 중인 UI 부분을 식별하는 문자열.
- 프로파일링된 트리 내의 컴포넌트가 업데이트될 때마다 React가 호출하는 onRender 콜백. 이 콜백은 렌더링된 내용과 소요된 시간에 대한 정보를 받는다.

> 프로파일링은 약간의 오버헤드를 추가하므로 상용 빌드에서는 기본적으로 비활성화되어 있다.  
> 상용 프로파일링을 사용하려면 프로파일링이 활성화된 특수 상용 빌드를 사용하도록 설정해야 한다.
