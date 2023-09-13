# Lazy

- lazy를 사용하면 처음 렌더링될 때까지 `컴포넌트 코드의 로딩`을 지연시킬 수 있다.

```jsx
import { lazy } from "react";

const SomeComponent = lazy(load);
```

## 매개변수 load

- Promise 또는 thenable를 반환하는 함수.
- React는 반환된 컴포넌트를 렌더링하려고 시도할 때까지 `load`를 호출하지 않는다.
- React가 `load`를 호출한 후에는 resolve까지 기다리고 resolve된 값을 React 컴포넌트로 렌더링한다.
- 반환된 Promise의 resolve된 값은 모두 캐시되므로 React는 `load`를 두번 이상 호출하지 않는다.
- Promise가 reject되면 React는 가장 가까운 Error Boundary에 reject된 이유를 throw한다.

## 반환값

- lazy는 트리에 렌더링할 수 있는 React 컴포넌트를 반환한다.
- 지연 컴포넌트의 코드가 로딩되는 동안 렌더링을 시도하면 일시 중단된다.
- 로딩 동안 로딩 표시기를 보여주려면 `Suspense`를 사용한다.

## 사용법

### Suspense가 있는 지연 로딩 컴포넌트

- 컴포넌트가 처음 렌더링될 때까지 로딩을 지연시키려면 일반적인 정적 import가 아닌 아래 방법을 쓴다.

```jsx
import MarkdownPreview from "./MarkdownPreview.js"; // ❌

import { lazy } from "react";

const MarkdownPreview = lazy(() => import("./MarkdownPreview.js"));
```

- MarkdownPreview 컴포넌트는 필요에 의해서만 로드되므로, 로드되는 동안 표시할 내용을 `Suspense` 지정한다.

```jsx
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

- 아래 예제 코드를 확인하자.

```jsx
import { useState, Suspense, lazy } from "react";
import Loading from "./Loading.js";

const MarkdownPreview = lazy(() =>
  delayForDemo(import("./MarkdownPreview.js"))
);

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState("Hello, **world**!");
  return (
    <>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={showPreview}
          onChange={(e) => setShowPreview(e.target.checked)}
        />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

- 처음 `MarkdownEditor` 컴포넌트 렌더링에서 `MarkdownPreview` 컴포넌트는 로드되지 않는다.
- 사용자가 체크하는 순간 `MarkdownPreview` 컴포넌트가 호출된다.
- `MarkdownPreview` 렌더링 동안에는 Suspense로 로딩화면을 보여준다.
- `MarkdownPreview` 렌더링이 완료되면 화면에 보여준다.

## 💡 사용 이유

> 특정 컴포넌트를 `비동기 적으로` 로드 하기 위함이다.  
> 즉, 처음부터 모든 콘텐츠를 로드하는게 아닌 `사용자가 필요로 할때` 로드한다.

1. 코드 스플리팅 (Code Splitting)
   : 큰 애플리케이션의 경우, 모든 컴포넌트와 모듈을 처음부터 한 번에 로드하면 초기 페이지 로드 시간이 길어질 수 있다.  
    `React.lazy`를 사용하면 필요한 컴포넌트만 비동기적으로 로드하여 초기 페이지 로드 시간을 줄일 수 있다.

2. 성능 향상
   : 사용자가 특정 기능이나 뷰를 사용하지 않는 경우, 해당 부분의 코드는 로드할 필요가 없다.  
    `React.lazy`를 사용하면 사용자가 필요로 할 때만 특정 컴포넌트나 모듈을 로드하여 전반적인 애플리케이션의 성능을 향상시킬 수 있다.

3. 네트워크 사용 최소화  
   : 모든 코드를 처음부터 로드하는 대신 필요한 부분만 로드하면 데이터 사용량을 줄일 수 있다.  
    이는 특히 데이터 전송 비용이 중요한 모바일 환경에서 유용하다.

4. 유연성
   : 어플리케이션의 특정 부분이 실패하거나 오류가 발생할 경우, 해당 부분만 다시 로드하거나 처리할 수 있다.

5. 서드파티 라이브러리 최적화
   : 어플리케이션 내에서 특정 서드파티 라이브러리를 일부 페이지나 뷰에서만 사용하는 경우,  
   해당 라이브러리를 동적으로 로드하여 애플리케이션의 전체 크기를 줄일 수 있다.
