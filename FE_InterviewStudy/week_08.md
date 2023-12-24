# Week_08

## 이벤트 버블링에 대해 설명해주세요.

- 이벤트 버블링은 특정 요소에서 이벤트가 발생하면 이 요소에 할당된 핸들러가 동작하고,
- 이어서 부모 요소의 핸들러가 동작합니다. (핸들러가 존재한다면)
- 이는 최상단의 document 요소를 만날 때까지 반복되는 형상입니다.

```html
<form onclick="alert('form')">
  FORM
  <div onclick="alert('div')">
    DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>

<!-- 
<p>에서의 이벤트: "p"라는 알림이 표시됩니다.
이벤트 버블링: 이벤트는 상위 요소로 전파됩니다.
<div>에 도달하면 "div"라는 알림이 표시됩니다.
<form>에 도달하면 "form"이라는 알림이 표시됩니다. 
-->
```

```html
<form>
  FORM
  <div>
    DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>

<!-- 
<p>에서의 이벤트: "p"라는 알림이 표시됩니다.
버블링의 부재: <div>와 <form> 요소에는 이벤트 핸들러가 없으므로, 이벤트는 처리되지 않고 무시됩니다.
여기서 중요한 점은 이벤트 버블링이 여전히 발생한다는 것입니다. 
그러나 상위 요소(<div>, <form>)에 이벤트 핸들러가 없기 때문에, 이벤트에 응답하는 것은 없습니다.
 버블링은 이벤트가 처리되지 않더라도 기본적으로 발생하는 DOM의 특성입니다.
-->
```

- 이벤트 버블링은 거의 모든 이벤트에서 발생되는 효과입니다. (focus, blur, load, unload 등은 제외)
- `event.target`과 `event.currentTarget`으로 이벤트 발생지와 실제 핸들러 요소를 알 수 있습니다.
- `event.target`은 이벤트가 발생한 요소를 가리킵니다.
- `event.currentTarget`은 이벤트 핸들러가 할당된 요소를 가리킵니다.
- 이벤트 버블링은 `event.stopPropagation()`으로 막을 수 있지만, 사용에는 주의해야합니다.
- 이벤트 버블링은 `이벤트 위임`과 같이 이벤트 핸들링의 주요 패턴입니다.

## 이벤트 버블링은 child에서 parent방향인데 반대로 구현하는 방법은?

- 실제 DOM 에서 이벤트 발생시 이벤트 흐름은 세 단계로 구분됩니다.
- `(1). 갭쳐링 단계`, `(2). 타깃 단계`, `(3). 버블링 단계`
- 캡쳐링 단계가 최상위 요소에서 시작하여 이벤트가 실제로 발생한 요소로 내려가는 단계입니다.
- 이 단계에서 이벤트 핸들러는 기본적으로 실행되지 않습니다.
- 이벤트 핸들러는 기본적으로 버블링 단계에서 실행되도록 되어 있습니다.
- 즉, 타깃 단계에서 이벤트 핸들링이 발생후 최상당까지 이벤트 핸들러가 발생합니다.
- 이 방식을 반대로 즉 캡쳐링 단계에서 핸들러가 실행되게 하려면 `addEventListener` 옵션을 설정하면 됩니다.

```js
// 캡쳐링 핸들러
element.addEventListener(
  "click",
  (e) => alert(`캡쳐링: ${elem.tagName}`),
  true
);
// 버블링 핸들러 (기본)
element.addEventListener("click", (e) => alert(`버블링: ${elem.tagName}`));
```

## 이벤트 버블링을 막기 위한 방법은?

- `event.stopPropagation()` 메소드를 사용하면, 현재 요소에서의 이벤트 처리 후
- 이 이벤트가 부모 요소로 전파되는 것을 막을 수 있습니다. (버블링 차단)
- 다만, 현재 요소에 할당된 다른 이벤트 핸들러는 기존대로 동작합니다.
- `event.stopImmediatePropagation()` 메소드를 사용하면 stopPropagation 기능을 포함하며
- 추가적으로 현재 요소에 할당된 다른 모든 이벤트 핸들러의 실행까지 막습니다.

## html이 렌더링 중에 javascript가 실행되면 렌더링이 멈추는데 그 이유는?

- 브라우저 렌더링 과정에서 javascript는 `브라우저 자바스크립트 엔진`이 파싱하기 때문입니다.
- HTML과 CSS는 `브라우러 렌더링 엔진`에서 파싱하고 DOM, CSSOM을 생성합니다.
- 이 과정에서 script(js 파일)을 만나면 `자바스크립트 엔진`에 `제어권`을 넘겨줍니다.
- JS 코드 파싱과 실행이 종료되고나서야 `렌더링 엔진`으로 `제어권`이 돌아옵니다.
- 이 문제를 해결하기 위해 script 태그에 `async`와 `defer` 속성이 추가되었습니다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/efef4ed4-214d-48a5-a0ef-c7a0908f3bbb/image.png" width="500px">
