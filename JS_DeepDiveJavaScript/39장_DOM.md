# 39장 DOM

앞서 살펴본 바와 같이 `브라우저의 렌더링 엔진`은 HTML 문서를 파싱하여 `DOM`을 생성한다.

> DOM은 HTML 문서의 계층적 구조와 정보를 표현하며 이를 제어할 수 있는 API를 제공하는 트리 자료구조다.

## 39.1 노드

### 39.1.1 HTML 요소와 노드 객체

- HTML 요소는 HTML 문서를 구성하는 개별적인 요소를 의미한다.
- 개별적인 요소들은 객체화되어 DOM을 구성하는 요소 노드 객체로 변환된다.

```html
<div calss="greeting">Hello</div>
```

- `<div></div>` : 요소 노드
- `calss="greeting"` : 속성 노드
- `Hello` : 콘텐츠 노드

이러한 HTML 요소들은 부자 관계를 형성하며 모든 노드 객체들이 트리자료 구조로 구성되며 이 트리자료 구조를 `DOM(DOM 트리)`이라 한다.

### 39.1.2 노드 객체의 타입

- DOM을 구성하는 노드 객체들의 타입

![](https://velog.velcdn.com/images/sarang_daddy/post/70d63fe2-e27d-4128-8480-a35e0d7991ab/image.png)

#### 문서 노드

- 문서 노드는 DOM 트리의 최상위 존재하는 루트 노드로서 document 객체를 가리킨다.
- document 객체는 브라우저가 렌더링한 HTML 문서 전체를 가리키는 객체로서 전역 객체 window의 document 프로퍼티에 바인딩되어 있다.
- 따라서 문서 노드는 window.document 또는 document로 참조할 수 있다.

#### 요소 노드

- 요소 노드는 HTML 요소를 가리키는 객체다.
- 요소 노드는 HTML 요소 간의 중첩에 의해 부자 관계를 가지며, 이 부자 관계를 통해 정보를 구조화한다.

#### 속성 노드

- 어트리뷰트 노드는 HTML 요소의 어트리뷰트를 가리키는 객체다.
- 어트리뷰트 노드는 어트리뷰트가 지정된 HTML 요소의 요소 노드와 연결되어있다.
- 어트리뷰트 노드는 요소 노드에만 연결되어 있다.
- 어트리뷰트 노드에 접근하여 어트리뷰트를 참조하거나 변경하려면 먼저 요소 노드에 접근해야 한다.

#### 텍스트 노드

- 텍스트 노드는 HTML 요소의 텍스트를 가리키는 객체다.
- 요소 노드가 문서의 구조를 표현한다면 텍스트 노드는 문서의 정보를 표현한다고 할 수 있다.
- 텍스트 노드는 요소 노드의 자식 노드이며, 자식 노드를 가질 수 없는 리프 노드다.
- 즉, 텍스트 노드는 DOM 트리의 최종단이다.
- 따라서 텍스트 노드에 접근하려면 먼저 부모 노드인 요소 노드에 접근해야 한다.

### 39.1.3 노드 객체의 상속 구조

> DOM을 구성하는 노드 객체는 자신의 구조와 정보를 제어할 수 있는 `DOM API`를 사용할 수 있다.

- 이를 통해 노드 객체는 자신의 부모, 형제, 자식을 탐색할 수 있다.
- 또, 자신의 어트리뷰트와 텍스트를 조작할 수 있다.
- 노드 객체도 자바스크립트 객체이므로 프로토타입에 의한  
  상속 구조를 갖는다. 노드 객체의 상속구조는 다음과 같다.

![](https://user-images.githubusercontent.com/76567238/222152715-6be40e62-6a5d-4925-9a55-818248ddc231.png)

- 노드 객체들은 상속을 통해 필요한 기능을 사용할 수 있다.

> 즉, 노드 타입에 따라 필요한 프로퍼티와 메서드의 집합인 DOM API를 통해 HTML의 구조나 내용 또는 스타일을 `동적으로 조작`할 수 있다.

## 39.2 요소 노드 취득

- 텍스트 노느는 요소 노드의 자식이고, 속성 노드는 요소노드와 연결되어있다.
- HTML 구조나 내용 또는 스타일 등을 동적으로 조작하려면 `요소노드`를 먼저 취득해야 한다.

### 39.2.1 id를 이용한 요소 노드 취득

- `getElementById` 메서드는 인수로 전달한 id 값을 갖는 요소노드를 탐색하여 반환한다.
- `getElementById` 메서드는 문서 노드의 프로퍼티다.
- 따라서 문서노드인 document를 통해 호출해야 한다.

```js
const node = document.getElementById("apple");
```

### 39.2.2 태그 이름을 이용한 요소 노드 취득

- `getLelmentsByTagName` 메서드는 인수로 전달한 태그 이름을 갖는 `모든` 요소 노드들을 탐색하며 반환한다.
- 반환하는 HTMLCollection 객체는 유사 배열 객체이면서 이터러블이다.
- document에서 반환하면 DOM 전체에서 해당하는 태그 요소 노드를 전부 탐색한다.
- element에서 반환하면 해당 요소 노드의 자손 중에서 탐색하여 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
      <li>Banana</li>
      <li>Orange</li>
    </ul>
    <ul>
      <li>HTML</li>
    </ul>
    <script>
      // DOM 전체에서 태그 이름이 li인 요소 노드를 모두 탐색하여 반환한다.
      const $lisFromDocument = document.getElementsByTagName("li");
      console.log($lisFromDocument); // HTMLCollection(4) [li, li, li, li]

      // #fruits 요소의 자손 노드 중에서 태그 이름이 li인 요소 노드를 모두
      // 탐색하여 반환한다.
      const $fruits = document.getElementById("fruits");
      const $lisFromFruits = $fruits.getElementsByTagName("li");
      console.log($lisFromFruits); // HTMLCollection(3) [li, li, li]
    </script>
  </body>
</html>
```

### 39.2.3 class를 이용한 요소 노드 취득

- `getElementsByClassName` 메서드는 인수로 전달한 class를 가지는 모든 요소 노드들을 탐색하여 반환한다.
- 여러 개의 노드 객체를 갖는 HTMLCollection 객체를 반환한다.
- document에서 사용하면 모든 DOM의 class를 가지는 요소 노드를 반환한다.
- 특정 element에서 사용하면 해당 요소 노드의 자손 노드에서 탐색하여 반환한다.

### 39.2.4 CSS 선택자를 이용한 요소 노드 취득

- CSS 선택자는 스타일을 적용하고자 하는 HTML 요소를 특정할 때 사용하는 문법이다.

```css
/* 전체 선택자: 모든 요소를 선택 */
* {
  ...;
}
/* 태그 선택자: 모든 p 태그 요소를 모두 선택 */
p {
  ...;
}
/* id 선택자: id 값이 'foo'인 요소를 모두 선택 */
#foo {
  ...;
}
/* class 선택자: class 값이 'foo'인 요소를 모두 선택 */
.foo {
  ...;
}
/* 어트리뷰트 선택자: input 요소 중에 type 어트리뷰트 값이 'text'인 요소를 모두 선택 */
input[type="text"] {
  ...;
}
/* 후손 선택자: div 요소의 후손 요소 중 p 요소를 모두 선택 */
div p {
  ...;
}
/* 자식 선택자: div 요소의 자식 요소 중 p 요소를 모두 선택 */
div > p {
  ...;
}
/* 인접 형제 선택자: p 요소의 형제 요소 중에 p 요소 바로 뒤에 위치하는 ul 요소를 선택 */
p + ul {
  ...;
}
/* 일반 형제 선택자: p 요소의 형제 요소 중에 p 요소 뒤에 위치하는 ul 요소를 모두 선택 */
p ~ ul {
  ...;
}
/* 가상 클래스 선택자: hover 상태인 a 요소를 모두 선택 */
a:hover {
  ...;
}
/* 가상 요소 선택자: p 요소의 콘텐츠의 앞에 위치하는 공간을 선택
   일반적으로 content 프로퍼티와 함께 사용된다. */
p::before {
  ...;
}
```

> CSS 선택자 문법을 활용하여 요소 노드를 취득할 수 있다.

- `querySelector` 메서드는 인수로 전달한 CSS 선택자를 만족하는 `하나의 요소 노드`를 탐색하여 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
    <script>
      // class 어트리뷰트 값이 'banana'인 첫 번째 요소 노드를 탐색하여 반환한다.
      const $elem = document.querySelector(".banana");

      // 취득한 요소 노드의 style.color 프로퍼티 값을 변경한다.
      $elem.style.color = "red";
    </script>
  </body>
</html>
```

- `querySelectorAll`메서드는 CSS 선택자를 만족하는 `모든 요소 노드`를 탐색하여 반환한다.
- 반환되는 객체는 DOM 컬렉션 객체인 `NodeList 객체`다.
- NodeList 객체는 유사 배열 객체이면서 이터러블이다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul>
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
    <script>
      // ul 요소의 자식 요소인 li 요소를 모두 탐색하여 반환한다.
      const $elems = document.querySelectorAll("ul > li");
      // 취득한 요소 노드들은 NodeList 객체에 담겨 반환된다.
      console.log($elems); // NodeList(3) [li.apple, li.banana, li.orange]

      // 취득한 모든 요소 노드의 style.color 프로퍼티 값을 변경한다.
      // NodeList는 forEach 메서드를 제공한다.
      $elems.forEach((elem) => {
        elem.style.color = "red";
      });
    </script>
  </body>
</html>
```

### getElement~ VS querySelector~

```js
// 모든 요소 노드를 탐색하여 반환한다.
const $all = document.getElementsByTagName("*");
// -> HTMLCollection(8) [html, head, body, ul, li#apple, li#banana, li#orange, script, apple: li#apple, banana: li#banana, orange: li#orange]

// 모든 요소 노드를 탐색하여 반환한다.
const $all = document.querySelectorAll("*");
// -> NodeList(8) [html, head, body, ul, li#apple, li#banana, li#orange, script]
```

> CSS 선택자 문법을 사용하는 `querySelector~` 메서드는 `getElement~` 메서드보다 다소 느리지만, 구체적인 조건으로 요소 노드를 취득할 수 있고, 일관된 방식으로 요소 노드를 취득할 수 있다. 따라서 id 어트리뷰트가 있는 요소 노드는 `getElement~` 메서드를 사용하고 그 외에는 `querySelector~` 메서드를 권장한다.

### 39.2.5 특정 요소 노드를 취득할 수 있는지 확인

`Element.prototype.matches` 메서드는 인수로 전달한 CSS 선택자를 통해 요소 노드 취득 가능 여부를 확인한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
  </body>
  <script>
    const $apple = document.querySelector(".apple");

    // $apple 노드는 '#fruits > li.apple'로 취득할 수 있다.
    console.log($apple.matches("#fruits > li.apple")); // true

    // $apple 노드는 '#fruits > li.banana'로 취득할 수 없다.
    console.log($apple.matches("#fruits > li.banana")); // false
  </script>
</html>
```

> 이벤트 위임에서 유용하게 사용할 수 있다.

### 39.2.6 HTMLCollection VS NodeList

- HTMLCollection는 `Live Collection` 이다. 즉, DOM이 변경되면 반환된 콜렉션도 자동으로 업데이트 된다.
- NodeList는 `Static Collection` 이다. 즉, DOM이 변경되더라도 반환된 콜렉션은 업데이트되지 않는다.
- `HTMLCollectio`과 `NodeList는` 둘다 유사 배열 객체이면서 이터러블이다. 즉, 스프레드 문법이나 Array.from 메서드로 배열 변환이 가능하다.

> 노드 객체의 상태 변경과 상관없이 DOM 컬렉션을 사용하려면 배열로 변환해서 사용하자.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // childNodes 프로퍼티는 NodeList 객체(live)를 반환한다.
    const { childNodes } = $fruits;

    // 스프레드 문법을 사용하여 NodeList 객체를 배열로 변환한다.
    [...childNodes].forEach((childNode) => {
      $fruits.removeChild(childNode);
    });

    // $fruits 요소의 모든 자식 노드가 모두 삭제되었다.
    console.log(childNodes); // NodeList []
  </script>
</html>
```

## 39.3 노드 탐색

- Node, Element 인터페이스는 트리 탐색 프로퍼티를 제공한다.
- 이를 통해 특정 요소 노드의 부모, 형제, 자식을 탐색할 수 있다.
- 이는 읽기만 가능한 읽기 전용 프로퍼티다.

### 39.3.1 공백 텍스트 노드

- HTML 요소 사이의 스페이스, 탭, 줄바꿈 등의 `공백 문자`는 텍스트 노드를 생성한다.

```html
// 공백 텍스트 노드가 존재하는 Html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="apple">Apple</li>
      <li class="banana">Banana</li>
      <li class="orange">Orange</li>
    </ul>
  </body>
</html>
```

![](https://velog.velcdn.com/images/sarang_daddy/post/a63062a0-ba37-4df4-a575-84f7bbd78610/image.png)

> 노드를 탐색할 때는 공백 텍스트 노드에 주의해야 한다.

### 39.3.2 자식 노드 탐색

| 프로퍼티                              | 설명                                                                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Node.prototype.childNodes`           | 자식 노드를 모두 탐색하여 DOM 컬렉션 객체인 NodeList에 담아 반환한다. **childNodes 프로퍼티가 반환한 NodeList에는 요소 노드뿐만 아니라 텍스트 노드도 포함되어 있을 수 있다.** |
| `Element.prototype.children`          | 자식 노드 중에서 요소 노드만 모두 탐색하여 DOM 컬렉션 객체인 HTMLCollection에 담아 반환한다. **children 프로퍼티가 반환한 HTMLCollection에는 텍스트 노드가 포함되지 않는다.** |
| `Node.prototype.firstChild`           | 첫 번째 자식 노드를 반환한다. firstChild 프로퍼티가 반환한 노드는 텍스트 노드이거나 요소 노드다.                                                                              |
| `Node.prototype.lastchild`            | 마지막 자식 노드를 반환한다. lastchild 프로퍼티가 반환한 노드는 텍스트 노드이거나 요소 노드다.                                                                                |
| `Element.prototype.firstElementChild` | 첫 번재 자식 요소 노드를 반환한다. firstElementChild 프로퍼티는 요소 노드만 반환한다.                                                                                         |
| `Element.prototype.lastElementChild`  | 마지막 자식 요소 노드를 반환한다. lastElementChild 프로퍼티는 요소 노드만 반환한다.                                                                                           |

## 39.4 노드 정보 취득

| 프로퍼티                  | 설명                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Node.prototype.nodeType` | 노드 객체의 종류, 즉 노드 타입을 나타내는 상수를 반환한다. 노드 타입 상수는 Node에 정의되어 있다.<br> - `Node.ELEMENT_NODE`: 요소 노드 타입을 나타내는 상수 1을 반환<br> - `Node.TEXT_NODE`: 텍스트 노드 타입을 나타내는 상수 3을 반환<br> - `Node.DOCUMENT_NODE`: 문서 노드 타입을 나타내는 상수 9를 반환 |
| `Node.prototype.nodeName` | 노드의 이름을 문자열로 반환한다.<br> - 요소 노드: 대문자 문자열로 태그 이름("UL", "LI" 등)을 반환<br> - 텍스트 노드: 문자열 "#text"를 반환<br> - 문서 노드: 문자열 "#document"를 반환                                                                                                                      |

## 39.5 요소 노드의 텍스트 조작

### 39.5.1 nodeValue

- Node.prototype.nodeValue 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티다.
- 따라서 `nodeValue 프로퍼티는 참조와 할당` 모두 가능하다.
- nodeValue는 텍스트 노드만 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello</div>
  </body>
  <script>
    // 문서 노드의 nodeValue 프로퍼티를 참조한다.
    console.log(document.nodeValue); // null

    // 요소 노드의 nodeValue 프로퍼티를 참조한다.
    const $foo = document.getElementById("foo");
    console.log($foo.nodeValue); // null

    // 텍스트 노드의 nodeValue 프로퍼티를 참조한다.
    const $textNode = $foo.firstChild;
    console.log($textNode.nodeValue); // Hello
  </script>
</html>
```

- nodeValue로 텍스트 값을 변경하려면 `텍스트 노드`를 탐색해야 한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello</div>
  </body>
  <script>
    // 1. #foo 요소 노드의 자식 노드인 텍스트 노드를 취득한다.
    const $textNode = document.getElementById("foo").firstChild;

    // 2. nodeValue 프로퍼티를 사용하여 텍스트 노드의 값을 변경한다.
    $textNode.nodeValue = "World";

    console.log($textNode.nodeValue); // World
  </script>
</html>
```

### 39.5.2 textContent

- Node.prototype.textContext 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티다.
- 요소 노드의 텍스트와 모든 `자손 노드의 텍스트`를 모두 취득하거나 변경한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // #foo 요소 노드의 텍스트를 모두 취득한다. 이때 HTML 마크업은 무시된다.
    console.log(document.getElementById("foo").textContent); // Hello world!
  </script>
</html>
```

```
⛔️ 주의사항
요소 노드의 textContent 프로퍼티에 문자열을 할당하면 (내가 문자를 바꾸면)
요소 노드의 모든 자식 노드가 제거되고 문자열이 텍스트로 추가된다.
HTML 마크업도 문자열 취급 되버린다.
```

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // #foo 요소 노드의 모든 자식 노드가 제거되고 할당한 문자열이 텍스트로 추가된다.
    // 이때 HTML 마크업이 파싱되지 않는다.
    document.getElementById("foo").textContent = "Hi <span>there!</span>";
  </script>
</html>
```

```
👀 추가로 알아가기
textContent와 비슷한 innerText 프로퍼티가 있는데,
CSS에 순종적이므로 사용하지말자.
(CSS가 hidden 시켜버리면 텍스트 반환하지 않아버림)
```

## 39.6 DOM 조작

- DOM 조작이란 새로운 노드를 생성하여 DOM에 추가하거나 기존 노드를 삭제 또는 교체하는 것을 말한다.

> DOM 조작으로 새로운 노드가 추가되거나 삭제되면 리플로우와 리페인트가 발생하므로 성능 최적화를 위해 주의해서 다루어야 한다.

### 39.6.1 innerHTML

- innerHTML은 요소 노드의 모든 HTML 마크업을 문자열로 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="foo">Hello <span>world!</span></div>
  </body>
  <script>
    // #foo 요소의 콘텐츠 영역 내의 HTML 마크업을 문자열로 취득한다.
    console.log(document.getElementById("foo").innerHTML);
    // "Hello <span>world!</span>"
  </script>
</html>
```

- textContent는 HTML마크업을 무시하고 텍스트만 반환하지만 innerHTML은 HTML 마크업이 포함된 문자열을 그대로 반환한다.
- **innerHTML은 문자열에 HTML 마크업으로 자식 노드를 DOM에 반영할 수 있다.**

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li class="apple">Apple</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // 노드 추가
    $fruits.innerHTML += '<li class="banana">Banana</li>';

    // 노드 교체
    $fruits.innerHTML = '<li class="orange">Orange</li>';

    // 노드 삭제
    $fruits.innerHTML = "";
  </script>
</html>
```

> 하지만, innerHTML으로 요소를 DOM에 반영하는 것은 `크로스 사이트 스크립팅 공격(XSS)`에 취약하다.

- HTML 새니티제이션은 이러한 `크로스 사이트 스크립팅 공격(XSS)` 위험을 제거하는 기능을 말한다.
- DOMPurify 라이브러리를 통해 사용이 가능하다.

> 그 외에도 모든 자식 노드를 제거하고 새롭게 노드를 만드는 단점과 삽입될 위치를 지정할 수 없다는 단점도 존재한다.

> innerHTML은 복잡하지 않은 요소를 `새롭게 추가`할 때만 사용하는게 좋다.

### 39.6.2 insertAdjacentHTML 메서드

- `insertAdjacentHTML(position, DOMString)` 메서드는 기존 요소를 제거하기 않으면서 위치를 지정해 새로운 요소를 삽입한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <!-- beforebegin -->
    <div id="foo">
      <!-- afterbegin -->
      text
      <!-- beforeend -->
    </div>
    <!-- afterend -->
  </body>
  <script>
    const $foo = document.getElementById("foo");

    $foo.insertAdjacentHTML("beforebegin", "<p>beforebegin</p>");
    $foo.insertAdjacentHTML("afterbegin", "<p>afterbegin</p>");
    $foo.insertAdjacentHTML("beforeend", "<p>beforeend</p>");
    $foo.insertAdjacentHTML("afterend", "<p>afterend</p>");
  </script>
</html>
```

> 기존 요소에는 영향을 주지 않고 새롭게 삽입될 요소만을 추가하므로 innerHTML 프로퍼티보다 효율적이고 빠르다.

### 39.6.3 노드 생성과 추가

- `innerHTML`, `insertAdjacentHTML` 메서드는 HTML 마크업 문자열을 파싱하여 노드를 생성하고 DOM에 반영했다.
- DOM은 노드를 직접 생성/삽입/삭제/치환하는 메서드도 제공한다.

```js
// 1. 요소 노드 생성
const $li = document.createElement("li");

// 2. 텍스트 노드 생성
const textNode = document.createTextNode("Banana");

// 3. 텍스트 노드를 $li 요소 노드의 자식 노드로 추가
$li.appendChild(textNode);

// 4. $li 요소 노드를 #fruits 요소 노드의 마지막 자식 노드로 추가
$fruits.appendChild($li);
```

### 39.6.4 복수의 노드 생성과 추가

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits"></ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    ["Apple", "Banana", "Orange"].forEach((text) => {
      // 1. 요소 노드 생성
      const $li = document.createElement("li");

      // 2. 텍스트 노드 생성
      const textNode = document.createTextNode(text);

      // 3. 텍스트 노드를 $li 요소 노드의 자식 노드로 추가
      $li.appendChild(textNode);

      // 4. $li 요소 노드를 #fruits 요소 노드의 마지막 자식 노드로 추가
      $fruits.appendChild($li);
    });
  </script>
</html>
```

- 위 예제와 같이 복수의 노드를 생성하여 추가할 수 있다.
- **하지만 DOM 트리에 추가가 3번 일어나기에 리플로우, 리페인팅도 3번 일어난다.**

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits"></ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // DocumentFragment 노드 생성
    const $fragment = document.createDocumentFragment();

    ["Apple", "Banana", "Orange"].forEach((text) => {
      // 1. 요소 노드 생성
      const $li = document.createElement("li");

      // 2. 텍스트 노드 생성
      const textNode = document.createTextNode(text);

      // 3. 텍스트 노드를 $li 요소 노드의 자식 노드로 추가
      $li.appendChild(textNode);

      // 4. $li 요소 노드를 DocumentFragment 노드의 마지막 자식 노드로 추가
      $fragment.appendChild($li);
    });

    // 5. DocumentFragment 노드를 #fruits 요소 노드의 마지막 자식 노드로 추가
    $fruits.appendChild($fragment);
  </script>
</html>
```

```
💡 <중요 포인트>
노드의 생성은 DOM 트리와 별개로 이루어진다. 즉, 렌더링이 일어나지 않는다.
이 점을 활용해서 필요한 모든 노드를 만들어서 하나로 조합 후 DOM 트리에 추가한다.
이는 성능을 최적화 하는데 효율적이다.
```

### 39.6.5 지정한 위치에 노드 삽입

- `appendChild` 는 항상 마지막 자식 노드로 삽입된다.
- `insertBefore(newNode, childNode)`로 삽입 위치를 지정할 수 있다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div>test</div>
    <ul id="fruits">
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // 요소 노드 생성
    const $li = document.createElement("li");

    // 텍스트 노드를 $li 요소 노드의 마지막 자식 노드로 추가
    $li.appendChild(document.createTextNode("Orange"));

    // 두 번째 인수로 전달받은 노드는 반드시 #fruits 요소 노드의 자식 노드이어야 한다.
    $fruits.insertBefore($li, document.querySelector("div"));
    // DOMException
  </script>
</html>
```

### 39.6.6 노드 이동

- DOM에 이미 존재하는 노드를 `appendChild`, `insertBefore` 메서드로 DOM에 다시 추가하면 존재하던 노드를 제거하고 새로운 위치에 추가한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
      <li>Banana</li>
      <li>Orange</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // 이미 존재하는 요소 노드를 취득
    const [$apple, $banana] = $fruits.children;

    // 이미 존재하는 $apple 요소 노드를 #fruits 요소 노드의 마지막 노드로 이동
    $fruits.appendChild($apple); // Banana - Orange - Apple

    // 이미 존재하는 $banana 요소 노드를 #fruits 요소의 마지막 자식 노드 앞으로 이동
    $fruits.insertBefore($banana, $fruits.lastElementChild);
    // Orange - Banana - Apple
  </script>
</html>
```

### 39.6.7 노드 복사

- `Node.prototype.cloneNode([deep: true | false])` 메서드는 노드의 사본을 복사한다.
- 매개변수 deep에 true를 인수로 전달하면 `깊은 복사`를 하여 모든 자손 노드가 포함된다.
- 매개변수 deep에 false를 인수로 전달하거나 생략하면 `얕은 복사`를 한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");
    const $apple = $fruits.firstElementChild;

    // $apple 요소를 얕은 복사하여 사본을 생성. 텍스트 노드가 없는 사본이 생성된다.
    const $shallowClone = $apple.cloneNode();
    // 사본 요소 노드에 텍스트 추가
    $shallowClone.textContent = "Banana";
    // 사본 요소 노드를 #fruits 요소 노드의 마지막 노드로 추가
    $fruits.appendChild($shallowClone);

    // #fruits 요소를 깊은 복사하여 모든 자손 노드가 포함된 사본을 생성
    const $deepClone = $fruits.cloneNode(true);
    // 사본 요소 노드를 #fruits 요소 노드의 마지막 노드로 추가
    $fruits.appendChild($deepClone);
  </script>
</html>
```

### 39.6.8 노드 교체

- `Node.prototype.replaceChild(newChild, oldChild)` 메서드는 자신을 호출한 노드의 자식 노드를 다른 노드로 교체한다.
- oldChild는 Node의 자손이어야 한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // 기존 노드와 교체할 요소 노드를 생성
    const $newChild = document.createElement("li");
    $newChild.textContent = "Banana";

    // #fruits 요소 노드의 첫 번째 자식 요소 노드를 $newChild 요소 노드로 교체
    $fruits.replaceChild($newChild, $fruits.firstElementChild);
  </script>
</html>
```

### 39.6.9 노드 삭제

- `Node.prototype.removeChild(child)` 메서드는 child 매개변수에 인수로 전달한 노드를 DOM에서 삭제한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul id="fruits">
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </body>
  <script>
    const $fruits = document.getElementById("fruits");

    // #fruits 요소 노드의 마지막 요소를 DOM에서 삭제
    $fruits.removeChild($fruits.lastElementChild);
  </script>
</html>
```

## 39.7 어트리뷰트

### 39.7.1 어트리뷰트 노드와 attributes 프로퍼티

- HTML 요소는 여러개의 어트리뷰트(속성)을 가질 수 있다.
- 속성은 HTML 요소의 동작을 제어하기 위한 정보를 제공한다.
- 속성은 모든 요소에 사용할 수 있는 속성과 특정 요소에만 사용가능한 속성으로 구성된다.
- Element.prototype.attributes 프로퍼티로 요소 노드의 속성 노드의 참조가 담긴 NamedNodeMap 객체를 반환한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      // 요소 노드의 attribute 프로퍼티는 요소 노드의 모든 어트리뷰트 노드의 참조가 담긴 NamedNodeMap 객체를 반환한다.
      const { attributes } = document.getElementById("user");
      console.log(attributes);
      // NamedNodeMap {0: id, 1: type, 2: value, id: id, type: type, value: value, length: 3}

      // 어트리뷰트 값 취득
      console.log(attributes.id.value); // user
      console.log(attributes.type.value); // text
      console.log(attributes.value.value); // ungmo2
    </script>
  </body>
</html>
```

### 39.7.2 HTML 어트리뷰트 조작

- `Element.prototype.getAttribute` 메서드로 요소 노드에서 HTML 어트리뷰트 값을 취득할 수 있다.
- `Element.prototype.getAttribute` 메서드로 요소 노드의 HTML 어트리뷰트 값을 변경할 수 있다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      const $input = document.getElementById("user");

      // value 어트리뷰트 값을 취득
      const inputValue = $input.getAttribute("value");
      console.log(inputValue); // ungmo2

      // value 어트리뷰트 값을 변경
      $input.setAttribute("value", "foo");
      console.log($input.getAttribute("value")); // foo
    </script>
  </body>
</html>
```

- `Element.prototype.hasAttribute`메서드로 속성 보유 여부를 확인할 수 있다.
- `Element.prototype.removeAttribute`메서드로 속성을 삭제할 수 있다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      const $input = document.getElementById("user");

      // value 어트리뷰트의 존재 확인
      if ($input.hasAttribute("value")) {
        // value 어트리뷰트 삭제
        $input.removeAttribute("value");
      }

      // value 어트리뷰트가 삭제되었다.
      console.log($input.hasAttribute("value")); // false
    </script>
  </body>
</html>
```

### 39.7.3 HTML 어트리뷰트 vs DOM 프로퍼티

- 요소 노드 객체에는 HTML 어트리뷰트에 대응하는 프로퍼티인 DOM 프로퍼티가 존재한다.
- DOM 프로퍼티들은 HTML 어트리뷰트 값을 초기값으로 가진다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      const $input = document.getElementById("user");

      // attributes 프로퍼티에 저장된 value 어트리뷰트 값
      console.log($input.getAttribute("value")); // ungmo2

      // 요소 노드의 value 프로퍼티에 저장된 value 어트리뷰트 값
      console.log($input.value); // ungmo2
    </script>
  </body>
</html>
```

- 사용자 입력으로 변하는 상태는 DOM 프로퍼티 값이 변경된 것이다.

```html
<!DOCTYPE html>
<html>
  <body>
    <input id="user" type="text" value="ungmo2" />
    <script>
      const $input = document.getElementById("user");

      // 사용자가 input 요소의 입력 필드에 값을 입력할 때마다 input 요소 노드의
      // value 프로퍼티 값, 즉 최신 상태 값을 취득한다. value 프로퍼티 값은 사용자의 입력에
      // 의해 동적으로 변경된다.
      $input.oninput = () => {
        console.log("value 프로퍼티 값", $input.value);
      };

      // getAttribute 메서드로 취득한 HTML 어트리뷰트 값, 즉 초기 상태 값은 변하지 않고 유지된다.
      console.log("value 어트리뷰트 값", $input.getAttribute("value"));
    </script>
  </body>
</html>
```

> 요소 노드는 2개의 상태. 초기 상태와 최신 상태를 관리해야 한다.  
> 초기 상태는 어트리뷰트 노드가 관리하고 최신 상태는 DOM 프로퍼티가 관리한다.

```
📝 HTML 어트리뷰트와 DOM 프로퍼티
어트리뷰트(Attributes): HTML 마크업에서 요소에 정의되는 초기 상태를 나타낸다.
예를 들어, <input type="text" value="initial">에서 type과 value는 어트리뷰트다.

DOM 프로퍼티(Properties): 브라우저가 HTML을 파싱한 후에 생성되는 DOM 객체에서 해당 요소의 상태를 나타낸다.
이 프로퍼티는 JavaScript를 통해 변경될 수 있다.
```

```jsx
const [toDo, setToDo] = useState("초기값");
const onChange = (e) => setToDo(e.target.value);

// input 요소에서 value가 초기값을 가질수 있는 이유
<input onChange={onChange} value={toDo} type="text"></input>;
```

### 39.7.4 data 어트리뷰트와 dataset 프로퍼티

- data 어트리뷰트와 dataset 프로퍼티를 사용하면 HTML 요소의 어트리뷰트와 자바스크립트 간에 데이터틀 교환할 수 있다.

```html
<!DOCTYPE html>
<html>
  <body>
    <ul class="users">
      <li id="1" data-user-id="7621" data-role="admin">Lee</li>
      <li id="2" data-user-id="9524" data-role="subscriber">Kim</li>
    </ul>
    <script>
      const users = [...document.querySelector(".users").children];

      // user-id가 '7621'인 요소 노드를 취득한다.
      const user = users.find((user) => user.dataset.userId === "7621");
      // user-id가 '7621'인 요소 노드에서 data-role의 값을 취득한다.
      console.log(user.dataset.role); // "admin"

      // user-id가 '7621'인 요소 노드의 data-role 값을 변경한다.
      user.dataset.role = "subscriber";
      // dataset 프로퍼티는 DOMStringMap 객체를 반환한다.
      console.log(user.dataset); // DOMStringMap {userId: "7621", role: "subscriber"}
    </script>
  </body>
</html>
```

## 39.8 스타일

### 39.8.1 인라인 스타일 조작

- `HTMLElement.prototype.style` 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티로서 요소 노드의 **인라인 스타일**을 취득하거나 추가 또는 변경한다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div style="color: red">Hello World</div>
    <script>
      const $div = document.querySelector("div");

      // 인라인 스타일 취득
      console.log($div.style); // CSSStyleDeclaration { 0: "color", ... }

      // 인라인 스타일 변경
      $div.style.color = "blue";

      // 인라인 스타일 추가
      $div.style.width = "100px";
      $div.style.height = "100px";
      $div.style.backgroundColor = "yellow";
    </script>
  </body>
</html>
```

### 39.8.2 클래스 조작

- `.`으로 시작하는 클래스 선택자를 사용하여 class 어트리뷰트 값을 변경하여 HTML 요소의 스타일을 변경할 수 있다.

#### className을 사용하여 스타일 변경

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box {
        width: 100px;
        height: 100px;
        background-color: antiquewhite;
      }
      .red {
        color: red;
      }
      .blue {
        color: blue;
      }
    </style>
  </head>
  <body>
    <div class="box red">Hello World</div>
    <script>
      const $box = document.querySelector(".box");

      // .box 요소의 class 어트리뷰트 값을 취득
      console.log($box.className); // 'box red'

      // .box 요소의 class 어트리뷰트 값 중에서 'red'만 'blue'로 변경
      $box.className = $box.className.replace("red", "blue");
    </script>
  </body>
</html>
```

- className 프로퍼티는 문자열을 반환하므로 공백으로 구분된 여러 개의 클래스를 반환하는 경우 다루기가 불편하다.

#### classList을 사용하여 스타일 변경

- `Element.prototype.classList` 프로퍼티는 class 어트리뷰트의 정보를 담은 DOMTokenList 객체를 반환한다.
- DOMTokenList 객체는 유요한 메서드를 제공한다.

1. add(...className)

- add 메서드는 인수로 전달한 1개 이상의 문자열을 class 어트리뷰트 값으로 추가한다.

2. remove(...className)

- remove 메서드는 인수로 전달한 1개 이상의 문자열과 일치하는 클래스를 class 어트리뷰트에서 삭제한다.

3. item(index)

- item 메서드는 인수로 전달한 index에 해당하는 클래스를 class 어트리뷰트에서 반환한다.

4. contains(className)

- contains 메서드는 인수로 전달한 문자열과 일치하는 클래스가 class 어트리뷰트에 포함되어 있는지 확인한다.

5. replace(oldClassName, newClassName)

- replace 메서드는 class 어트리뷰트에서 첫 번째 인수로 전달한 문자열을 두 번째 인수로 전달한 문자열로 변경한다.

6. toggle(className[, force])

- toggle 메서드는 class 어트리뷰트에 인수로 전달한 문자열과 일치하는 클래스가 존재하면 제거하고, 존재하지 않으면 추가한다.

### 39.8.3 요소에 적용되어 있는 CSS 스타일 참조

- 앞서 확인한 style 프로퍼티는 인라인 스타일만 반환한다.
- 때문에 클래스를 적용한 스타일이나 상속을 통해 적용된 스타일은 style 프로퍼티로 참조할 수 없다.
- HTML 요소에 적용되어 있는 모든 CSS 스타일을 참조해야 할 경우 `getComputedStyle`메서드를 사용한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        color: red;
      }
      .box {
        width: 100px;
        height: 50px;
        background-color: cornsilk;
        border: 1px solid black;
      }
    </style>
  </head>
  <body>
    <div class="box">Box</div>
    <script>
      const $box = document.querySelector(".box");

      // .box 요소에 적용된 모든 CSS 스타일을 담고 있는 CSSStyleDeclaration 객체를 취득
      const computedStyle = window.getComputedStyle($box);
      console.log(computedStyle); // CSSStyleDeclaration

      // 임베딩 스타일
      console.log(computedStyle.width); // 100px
      console.log(computedStyle.height); // 50px
      console.log(computedStyle.backgroundColor); // rgb(255, 248, 220)
      console.log(computedStyle.border); // 1px solid rgb(0, 0, 0)

      // 상속 스타일(body -> .box)
      console.log(computedStyle.color); // rgb(255, 0, 0)

      // 기본 스타일
      console.log(computedStyle.display); // block
    </script>
  </body>
</html>
```

- `getComputedStyle`메서드의 두 번째 인수로 `:after`, `:before`같은 의사 요소를 지정하는 문자열을 전달할 수 있다.

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box:before {
        content: "Hello";
      }
    </style>
  </head>
  <body>
    <div class="box">Box</div>
    <script>
      const $box = document.querySelector(".box");

      // 의사 요소 :before의 스타일을 취득한다.
      const computedStyle = window.getComputedStyle($box, ":before");
      console.log(computedStyle.content); // "Hello"
    </script>
  </body>
</html>
```
