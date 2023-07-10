# 20장 strict mode

## 20.1 strict mode란?

아래 코드의 실행 결과는 무엇일까?

```js
function foo() {
  x = 10;
}
foo();

console.log(x);
```

결과는 10으로 잘 나온다.  
하지만, 개발자의 의도로는 에러가 나와야 정상이다.

변수 x는 함수 내에서 선언되지 않았으며, 함수 밖에서도 선언되지 않았다.  
JS엔진이 암묵적으로 전역 객체에 x 프로퍼티를 동적 생성했기에 에러 없이 10이라는 값이 호출된다.  
이러한 현상을 `암묵적 전역(implicit global)`이라 한다.

> 암묵적 전역은 개발자의 의도와는 상관없이 발생하기에 오류를 발생시키는 원인이 될 가능성이 크다.  
> 변수는 반드시 let, const로 선언한 다음 사용해야 한다.

하지만 오타나 문법 지식의 미비로 인한 실수는 언제나 발생한다.  
때문에 안정적인 코드를 생산 하기 위해 ES5부터 `strict mode`모드가 추가되었다.

strict mode는 개발 환경을 엄격하게 만들어서 코드에 대해 명시적인 에러를 발생시켜준다.

> `ESlint`같은 린트 도구를 사용해도 strict mode와 같은 효과를 얻을 수 있다.  
> 더욱이 엄격 모드와 더불어 코딩 컨벤션을 설정 파일 형태로 정의하고 강제 할 수 있기에  
> **strict mode보다 린트 도구의 사용이 더 좋다.**

</br>

## 20.2 strict mode의 적용

전역의 선두 또는 함수 몸체의 선두에 'use strict';를 추가하여 strict mode를 적용할 수 있다.

```js
// 전역의 선두에 적용

"use strict";

function foo() {
  x = 10; // ReferenceError: x is not defined
}
foo();
```

```js
// 함수 몸체의 선두에 적용

function foo() {
  "use strict";
  x = 10; // ReferenceError: x is not defined
}
foo();
```

</br>

## 20.3 전역에 strict mode를 적용하는 것은 피하자

```html
<html>
  <body>
    <script>
      "use strict";
      y = 1; // ReferenceError console.log(y);
    </script>
    <script>
      x = 10;
    </script>
    <script>
      console.log(x); // 10
    </script>
  </body>
</html>
```

- 위 처럼 스크립트 단위로만 strict mode가 적용된다.
- strict mode 스크립트와 non-strict mode 스크립트를 혼용하는 것은 오류를 발생시킬 수 있다.
- 특히 외부 서드파티 라이브러리를 사용하는 경우 라이브러리가 non-strict mode인 경우도 있다.

</br>

## 20.4 함수 단위로 strict mode를 적용하는 것도 피하자

- 어떤 함수는 strict mode를 적용하고 어떤 함수는 적용하지 않는 것은 바람직 하지 않다.
- 모든 함수에 일일이 strict mode를 적용하는 것도 번거롭다.
- strict mode가 적용된 함수가 strict mode 적용되지 않은 외부 컨텍스트를 사용하는 것도 문제가 발생한다.

```js
(function () {
  // non-strict mode
  var let = 10; // 에러가 발생하지 않는다.

  function foo() {
    // "use strict";

    let = 20; // SyntaxError : Unexpected strict mode reserved word
    // 엄격 모드에서 let은 예약어임을 잡아주고 있다.
  }
  foo();
})();
```

> strict mode를 사용한다면 스크립트 단위로 전체를 감싸서 즉시 실행 함수로 사용해줌이 바람직하다.

</br>

## 20.5 strict mode가 발생시키는 에러

strict mode를 적용했을 때 발견할 수 있는 에러에 대해서 알아보자.

### 20.5.1 암묵적 전역

```js
(function () {
  "use strict";

  x = 1;
  console.log(x); // ReferenceError : x is not defined
})();
```

- 선언하지 않은 변수를 참조하면 에러가 발생한다.

### 20.5.2 변수, 함수, 매개변수의 삭제

```js
(function () {
  "use strict";

  var x = 1;
  delete x; // SyntaxError : Delete of an unqualified identifier in strict mode

  function foo(a) {
    delete a; // SyntaxError : Delete of an unqualified identifier in strict mode
  }
  delete foo; // SyntaxError : Delete of an unqualified identifier in strict mode
})();
```

- delete 연산자로 변수, 함수, 매개변수를 삭제하면 SyntaxError가 발생한다.

### 20.5.3 매개변수 이름의 중복

```js
(function () {
  "use strict";

  // SyntaxError : Duplicate parameter name not allowed in this context
  function foo(x, x) {
    return x + x;
  }
  console.log(foo(1, 2));
})();
```

- 중복된 매개변수 이름을 사용하면 SyntaxError가 발생한다.

### 20.5.4 with 문의 사용

```js
(function () {
  "use strict";

  // SyntaxError : Strict mode code may not include a with statement
  with ({ x: 1 }) {
    console.log(x);
  }
})();
```

- with 문을 사용하면 SyntaxError가 발생한다.  
  with 문은 전달된 객체를 스코프 체인에 추가한다. 그리고 동일한 객체의 프로퍼티를 반복해서 사용할 때  
  객체 이름을 생략할 수 있어서 코드가 간단해지는 효과가 있지만 성능과 가독성이 나빠지는 문제가 있다.  
  따라서 with 문은 사용하지 않는 것이 좋다.

</br>

## 20.6 strict mode 적용에 의한 변화

### 20.6.1 일반 함수의 this

- strict mode에서 함수를 일반 함수로서 호출하면 this에 undefined가 바인딩 된다.
- **생성자 함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문이다.**

```js
(function () {
  "use strict";

  function foo() {
    console.log(this); // undefined
  }
  // 일반 함수 호출
  foo();

  function Foo() {
    console.log(this); // Foo
  }
  // 생성자 함수 호출
  new Foo();
})();
```

- **strict mode 적용없이 일반 함수를 호출하면 this는 window가 된다.**

```js
(function () {
  function foo() {
    console.log(this); // Window
  }
  // 일반 함수 호출
  foo();
})();
```

### 20.6.2 arguments 객체

- strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경해도 arguments 객체에 반영되지 않는다.

```js
(function (a) {
  "use strict";

  // 매개변수에 전달된 인수를 재할당하여 변경
  a = 2;

  // 변경된 인수가 arguments 객체에 반영되지 않는다.
  console.log(arguments); // { 0: 1, length: 1}
})(1);
```
