# 22장 this

## 22.1 this 키워드

"객체지향 프로그래밍"에서 객체는 `상태를 나타내는 프로퍼티`와 `동작을 나타내는 메서드`를 하나의 논리적인 단위로 묶은 복합적인 자료구조다.

여기서 `동작을 나타내는 메서드`는 자신이 속한 객체의 상태 즉 프로퍼티를 참조하고 변경할 수 있어야 한다.  
이때 메서드가 프로퍼티를 참조하려면 `자신이 속한 객체를 가리키는 식별자`를 참조할 수 있어야 한다.

this라는 식별자가 없다고 생각해보자.

```js
// Circle 생성자 함수
function Circle(radius) {
    // 생성자 함수가 생성할 인스턴스를 가리키는 식별자를 알 수 없다.
    ????.radius = radius;
}

// Circle에 getDiameter 메서드 추가
Circle.prototype.getDiameter = function () {
    // 생성자 함수가 생성할 인스턴스를 가리키는 식별자를 알 수 없다.
    return 2 * ????.radius
}
```

- 생성자 함수로 인스턴스를 생성하려면 먼저 생성자 함수가 존재해야 한다.
- 하지만, 생성자 함수를 정의하는 시점에는 아직 인스턴스를 생성하지 않아서 생성자 함수가 생성할 인스턴스 식별자를 알 수 없다.
- 이를 위해 자바스크립트는 this라는 특수한 식별자를 제공한다.

> this는 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 자기 참조 변수다.  
> this를 통해 자신이 속한 객체 또는 자신이 생성할 인스턴스의 프로퍼티나 메서드를 참조할 수 있다.

함수 내부에서 this는 지역변수처럼 사용할 수 있다. 단, this가 가리키는 값, 즉 this 바인등은 함수 호출 방식에 의해 `동적`으로 결정된다.

```js
// Circle 생성자 함수
function Circle(radius) {
  // this는 생성자 함수가 생설할 인스턴스를 가리킨다.
  this.radius = radius;
}

// Circle에 getDiameter 메서드 추가
Circle.prototype.getDiameter = function () {
  // this는 생성자 함수가 생설할 인스턴스를 가리킨다.
  return 2 * this.radius;
};

// 인스턴스 circle
const circle = new Circle(5);
```

> this 바인딩 이란?  
> 바인딩이란 **식별자와 값을 연결**하는 과정을 의미한다.  
> 변수 선언은 변수 이름(식별자)와 확보된 메모리 공간의 주소를 바인딩하는 것이다.  
> this 바인딩은 this가 가리킬 객체를 바인딩하는 것이다.

```js
// this는 어디서든지 참조 가능하다.
// 전역에서 this는 전역 객체 window를 가리킨다.
console.log(this); // window

function square(number) {
  // 일반 함수 내부에서 this는 전역 객체 window를 가리킨다.
  console.log(this); // window
  return number * number;
}
square(2);

const person = {
  name: "Lee",
  getName() {
    // 메서드 내부에서 this는 메서드를 호출한 객체를 가리킨다.
    console.log(this); // {name: "Lee", getName: ƒ}
    return this.name;
  },
};
console.log(person.getName()); // Lee

function Person(name) {
  this.name = name;
  // 생성자 함수 내부에서 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
  console.log(this); // Person {name: "Lee"}
}

const me = new Person("Lee");
```

</br>

## 22.2 함수 호출 방식과 this 바인딩

중요한 포인트는 this는 동적으로 결정된다는 것이다.

> 즉, "어떤 놈이 this를 호출했어?" 에 따라 this에 바인딩 될 값이 결정된다.

#### 렉시컬 스코프와 this 바인딩은 결정 시기가 다르다.

함수의 상위 스코프를 결정하는 방식인 렉시컬 스코프는 함수 정의가 평가되어 함수 객체가 `생성`되는 시점에 결정된다.  
하지만, this 바인딩은 함수 `호출` 시점에 결정된다.

```js
const person = {
  name: "KIM",
  age: 24,
  printThis: function () {
    console.log(this); // 메소드에서 this 호출
  },
};

// 1️⃣
person.printThis(); // person이 호출한 놈이다. 즉 this는 person 객체를 뜻한다.

const printThis = person.printThis;
// 2️⃣
printThis(); // 호눌한 놈은 생략된 'window'다. 즉 this는 window가 된다.
```

- 1️⃣, 2️⃣ 모두 같은 printThis 함수를 호출했지만, this가 가리키는 객체를 다르게 나온다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/ba0785e4-a4b7-4d0e-afb5-7503c84b1ef6/image.png">

</br>

주의할 것은 동일한 함수도 다양한 방식으로 호출할 수 있다는 것이다.  
함수 호출 방식에 따라 this 바인딩이 어떻게 결정되는지 알아보자.

### 22.2.1 일반 함수 호출

기본적으로 this에는 전역 객체가 바인딩된다.

```js
function foo() {
  console.log("foo's this: ", this); // window
  function bar() {
    console.log("bar's this: ", this); // window
  }
  bar();
}
foo();
```

- 전역함수는 물론이고 일반 함수로 호출하면 함수 내부의 this에는 전역 객체가 바인딩된다.
- this는 객체의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수이므로 일반적으로 `객체의 메서드 내부` 또는 `생성자 함수 내부`에서만 의미가 있다.
- 일반 함수 내부에서의 this는 의미가 없다.

메서드 내에서 정의한 `중첩함수`와 `콜백함수`도 일반함수로 호출하면 내부의 this에는 전역 객체가 바인딩 된다.

```js
// var 키워드로 선언한 전역 변수 value는 전역 객체의 프로퍼티다.
var value = 1;
// const 키워드로 선언한 전역 변수 value는 전역 객체의 프로퍼티가 아니다.
// const value = 1;

const obj = {
  value: 100,
  foo() {
    console.log("foo's this: ", this); // {value: 100, foo: ƒ}
    console.log("foo's this.value: ", this.value); // 100

    // 메서드 내에서 정의한 중첩 함수
    function bar() {
      console.log("bar's this: ", this); // window
      console.log("bar's this.value: ", this.value); // 1
    }

    // 콜백 함수 내부의 this에는 전역 객체가 바인딩된다.
    setTimeout(function () {
      console.log("callback's this: ", this); // window
      console.log("callback's this.value: ", this.value); // 1
    }, 100);

    // 메서드 내에서 정의한 중첩 함수도 일반 함수로 호출되면 중첩 함수 내부의 this에는
    // 전역 객체가 바인딩된다.
    bar();
  },
};

obj.foo();
```

- 메서드 내에서 정의한 `중첩함수` 또는 메서드에게 전달한 `콜백함수`의 this가 전역 객체를 바인딩 하는 것은 문제가 된다.
- 둘다 헬퍼 함수의 역할을 해야하는데 this가 전역이 되면 헬퍼 함수로의 동작이 어렵다.
- 이를 해결하기 위해 중첩함수나 콜백함수의 this 바인딩을 메서드의 this 바인딩과 일치시키는 방법이 존재한다.
- `apply`, `call`, `bind`, `화살표 함수`가 그 방법이다.

### 22.2.2 메서드 호출

메서드 내부의 this에는 메서드를 호출한 객체, 즉 메서드를 호출할 때 메서드 이름 앞의 마침표(.) 연산자 앞에 기술한 객체가 바인딩된다.  
주의할 것은 메서드 내부의 this는 메서드를 소유한 객체가 아닌 메서드를 호출한 객체에 바인딩된다는 것이다.

```js
const person = {
  name: "Lee",
  getName() {
    // 메서드 내부의 this는 메서드를 호출한 객체에 바인딩된다.
    return this.name;
  },
};

// 메서드 getName을 호출한 객체는 person이다.
console.log(person.getName()); // Lee

const anotherPerson = {
  name: "Kim",
};
// getName 메서드를 anotherPerson 객체의 메서드로 할당
anotherPerson.getName = person.getName;

// getName 메서드를 호출한 객체는 anotherPerson이다.
console.log(anotherPerson.getName()); // Kim

// getName 메서드를 변수에 할당
const getName = person.getName;

// getName 메서드를 일반 함수로 호출
console.log(getName()); // ''
// 일반 함수로 호출된 getName 함수 내부의 this.name은 브라우저 환경에서 window.name과 같다.
```

### 22.2.3 생성자 함수 호출

생성자 함수 내부의 this에는 생성자 함수가 (미래에) 생성할 인스턴스가 바인딩된다.

```js
// 생성자 함수
function Circle(radius) {
  // 생성자 함수 내부의 this에는 생성자 함수가 생성할 인스턴스를 가리킨다.
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

// 반지름이 5인 Circle 객체 생성
const circle1 = new Circle(5);
// 반지름이 10인 Circle 객체 생성
const circle2 = new Circle(10);

console.log(circle1.getDiameter()); // 10
console.log(circle2.getDiameter()); // 20
```

### 22.2.4 Function.prototype.apply/call/bind 메서드에 의한 간접 호출

`apply`, `call`, `bind`는 Function.prototype의 메서드다. 즉, 모든 함수가 상속받아 사용할 수 있다.

- `apply`, `call` 메서드는 this로 사용할 객체와 인수 리스트를 인수로 전달받아 함수를 호출한다.

```js
function getThisBinding() {
  console.log(arguments);
  return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

console.log(getThisBinding()); // window

// getThisBinding 함수를 호출하면서 인수로 전달할 객체를 getThisBinding 함수의 this에 바인딩한다.
// apply 메서드는 호출할 함수의 인수를 배열로 묶어 전달한다.
console.log(getThisBinding.apply(thisArg, [1, 2, 3]));
// Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}

// call 메서드는 호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달한다.
console.log(getThisBinding.call(thisArg, 1, 2, 3));
// Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
// {a: 1}
```

- apply와 call 메서드의 대표적인 용도는 arguments 객체와 같은 유사 배열 객체에 배열 메서드를 사용하는 경우다.
- arguments 객체는 배열이 아니기 때문에 Array.prototype.slice 같은 배열의 메서드를 사용할 수 없으나 apply와 call 메서드를 이용하면 가능하다.

```js
function convertArgsToArray() {
  console.log(arguments);

  // arguments 객체를 배열로 변환
  // Array.prototype.slice를 인수 없이 호출하면 배열의 복사본을 생성한다.
  const arr = Array.prototype.slice.call(arguments);
  // const arr = Array.prototype.slice.apply(arguments);
  console.log(arr);

  return arr;
}

convertArgsToArray(1, 2, 3); // [1, 2, 3]
```

- `bind`` 메서드는 apply와 call 메서드와 달리 함수를 호출하지 않는다.  
   다만 첫 번째 인수로 전달한 값으로 this 바인딩이 교체된 함수를 새롭게 생성해 반환한다.

```js
function getThisBinding() {
  return this;
}

// this로 사용할 객체
const thisArg = { a: 1 };

console.log(getThisBinding.bind(thisArg)); // getThisBinding
// bind 메서드는 함수를 호출하지 않으므로 명시적으로 호출해야 한다.
console.log(getThisBinding.bind(thisArg)()); // {a: 1}
```

> bind 메서드는 메서드의 this와 메서드 내부의 `중첩함수` 또는 `콜백함수`의 this가 불일치하는 문제를 해결하기 위해 유용하게 사용된다.

```js
const person = {
  name: "Lee",
  foo(callback) {
    // bind 메서드로 callback 함수 내부의 this 바인딩을 전달
    setTimeout(callback.bind(this), 100);
    // setTimeout(callback, 100); 으로 작성하면
    // 아래의 일반 함수로 호출된 콜백 함수 내부의 this.name은 window.name과 같다.
    // 따라서 Hi! my name is .로 출력된다.
    // 콜백 함수 내부의 this를 외부 함수 내부의 this와 일치시키기 위해 bind 메서드를 사용해야 한다.
  },
};

person.foo(function () {
  console.log(`Hi! my name is ${this.name}.`); // Hi! my name is Lee.
});
```

### 함수 호출 방식에 따라 this 바인딩이 어떻게 동적으로 결정되는지 요약

| 함수 호출 방식                                | this 바인딩                                               |
| --------------------------------------------- | --------------------------------------------------------- |
| 일반 함수 호출                                | 전역 객체                                                 |
| 메서드 호출                                   | 메서드를 호출한 객체                                      |
| 생성자 함수 호출                              | 생성자 함수가 (미래에) 생성할 인스턴스                    |
| `apply`,`call`,`bind` 메서드에 의한 간접 호출 | `apply`,`call`,`bind` 메서드에 첫 번째 인수로 전달한 객체 |
