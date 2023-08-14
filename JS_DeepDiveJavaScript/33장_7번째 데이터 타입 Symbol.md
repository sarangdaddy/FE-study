# 33장 7번째 데이터 타입 Symbol

## 33.1 심벌이란?

- 심벌은 ES6에 도입된 7번재 데이터 타입으로 변경 불가능한 원시 타입의 값이다.
- 주로 이름의 충돌 위험이 없는 `유일한 프로퍼티 키`를 만들기 위해 사용한다.

## 33.2 심벌 값의 생성

### 33.2.1 Symbol 함수

- 심벌 값은 Symbol 함수를 통해서만 생성이 가능하다.

> 이때 생성된 심벌 값은 외부로 노출되지 않아 확인할 수 없으며, 다른 값과 절대 중복되지 않는 유일무이한 값이다.

- Symbol 값은 new 연산자로 호출하지 않는다.
- 즉, 인스턴스가 생성되지 않는다.

```js
new Symbol(); // TypeError: Symbol is not a constructor
```

- Symbol 함수에는 선택적으로 문자열을 인수로 전달할 수 있다.

> 이 문자열은 Symbol의 설명de-scription으로 디버깅 용도로만 사용된다.

```js
// 심벌 값에 대한 설명이 같더라도 유일무이한 심벌 값을 생성한다.
const mySymbol1 = Symbol("mySymbol");
const mySymbol2 = Symbol("mySymbol");

console.log(mySymbol1 === mySymbol2); // false
```

### 33.2.2 Symbol.for / Symbol.keyFor 메서드

- `Symbol.for 메서드`는 인수로 전달받은 문자열을 키로 사용하여 `전역 심벌 레지스트리`에서 해당 키와 일치하는 심벌 값을 검색한다.

```js
// 전역 심벌 레지스트리에 mySymbol이라는 키로 저장된 심벌 값이 없으면 새로운 심벌 값을 생성
const s1 = Symbol.for("mySymbol");
// 전역 심벌 레지스트리에 mySymbol이라는 키로 저장된 심벌 값이 있으면 해당 심벌 값을 반환
const s2 = Symbol.for("mySymbol");

console.log(s1 === s2); // true
```

- `Symbol.keyFor 메서드`를 사용하면 전역 심벌 레지스트리에 저장된 심벌 값의 키를 추출할 수 있다.

```js
// 전역 심벌 레지스트리에 mySymbol이라는 키로 저장된 심벌 값이 없으면 새로운 심벌 값을 생성
const s1 = Symbol.for("mySymbol");
// 전역 심벌 레지스트리에 저장된 심벌 값의 키를 추출
Symbol.keyFor(s1); // -> mySymbol

// Symbol 함수를 호출하여 생성한 심벌 값은 전역 심벌 레지스트리에 등록되어 관리되지 않는다.
const s2 = Symbol("foo");
// 전역 심벌 레지스트리에 저장된 심벌 값의 키를 추출
Symbol.keyFor(s2); // -> undefined
```

## 33.3 심벌과 상수

- 심벌은 언제 사용할까?

```js
// 위, 아래, 왼쪽, 오른쪽을 나타내는 상수를 정의한다.
// 이때 값 1, 2, 3, 4에는 특별한 의미가 없고 상수 이름에 의미가 있다.
const Direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

// 변수에 상수를 할당
const myDirection = Direction.UP;

if (myDirection === Direction.UP) {
  console.log("You are going UP.");
}
```

- 위 예제에서 상수 값 1, 2, 3, 4는 변경될 수 있으며, 다른 변수 값과 중복될 수도 있다.

> 이 경우 변경/중복될 가능성이 있는 무의미한 상수 대신 중복될 가능성이 없는 유일무이한 심벌 값을 사용할 수 있다.

```js
// 위, 아래, 왼쪽, 오른쪽을 나타내는 상수를 정의한다.
// 중복될 가능성이 없는 심벌 값으로 상수 값을 생성한다.
const Direction = {
  UP: Symbol("up"),
  DOWN: Symbol("down"),
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
};

const myDirection = Direction.UP;

if (myDirection === Direction.UP) {
  console.log("You are going UP.");
}
```

### 💡 enum

- enum은 명명된 숫자 상수의 집합으로 열거형이라고 부른다.
- 자바스크립트는 enum을 지원하지 않지만 `타입스크립트`에서는 enum을 지원한다.
- 자바스크립트에서는 Object.freeze와 심벌로 enum을 만들수 있다.

```js
// JavaScript enum
// Direction 객체는 불변 객체이며 프로퍼티는 유일무이한 값이다.
const Direction = Object.freeze({
  UP: Symbol("up"),
  DOWN: Symbol("down"),
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
});

const myDirection = Direction.UP;

if (myDirection === Direction.UP) {
  console.log("You are going UP.");
}
```

## 33.4 심벌과 프로퍼티 키

- 심벌 값을 프로퍼티 키로 사용하려면 프로퍼티 키로 사용할 심벌 값에 대괄호를 사용해야 한다.

```js
const obj = {
  // 심벌 값으로 프로퍼티 키를 생성
  [Symbol.for("mySymbol")]: 1,
};

obj[Symbol.for("mySymbol")]; // -> 1
```

> 심벌 값은 유일무이한 값으로 심벌 값으로 프로퍼티 키를 만들면 다른 프로퍼키 키와 절대 충돌하지 않는다.

## 33.5 심벌과 프로퍼티 은닉

- 심벌 값을 프로퍼티 키로 사용하여 생성한 프로퍼티는 `for...in 문`이나 `Object.keys`, `Object.getOwnPropertyNames` 메서드로 찾을 수 없다.

```js
const obj = {
  // 심벌 값으로 프로퍼티 키를 생성
  [Symbol("mySymbol")]: 1,
};

for (const key in obj) {
  console.log(key); // 아무것도 출력되지 않는다.
}

console.log(Object.keys(obj)); // []
console.log(Object.getOwnPropertyNames(obj)); // []
```

## 33.6 심벌과 표준 빌트인 객체 확장

- 일반적으로 표준 빌트인 객체에 사용자 정의 메서드를 확장하는 것은 권장하지 않는다.
- 표준 빌트인 객체가 가진 메서드의 이름이 중복될 수 있기 때문이다.
- 하지만, 심벌을 이용하면 중복될 위험이 없기에 가능하다.

```js
// 심벌 값으로 프로퍼티 키를 동적 생성하면 다른 프로퍼티 키와 절대 충돌하지 않아 안전하다.
Array.prototype[Symbol.for("sum")] = function () {
  return this.reduce((acc, cur) => acc + cur, 0);
};

[1, 2][Symbol.for("sum")](); // -> 3
```

## 33.7 Well-known Symbol

- `Well-known Symbol`은 자바스크립트가 기본 제공하는 빌트인 심벌 값이다.
- 이터러블이 아닌 일반 객체를 이터러블처럼 동작하도록 구현하고 싶다면 `Well-known Symbol`를 사용한다.

```js
// 1 ~ 5 범위의 정수로 이루어진 이터러블
const iterable = {
  // Symbol.iterator 메서드를 구현하여 이터러블 프로토콜을 준수
  [Symbol.iterator]() {
    let cur = 1;
    const max = 5;
    // Symbol.iterator 메서드는 next 메서드를 소유한 이터레이터를 반환
    return {
      next() {
        return { value: cur++, done: cur > max + 1 };
      },
    };
  },
};

for (const num of iterable) {
  console.log(num); // 1 2 3 4 5
}
```
