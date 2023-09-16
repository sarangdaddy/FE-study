# interface

오직 object 모양으로 타입 명시를 해주는 방식이다.  
class의 사용법과 비슷해서 type보다 사용하기 편리함이 있다.

## type 특징

- TS에서 다양한 타입을 정의할 수 있다.
- type는 모든 타입이 다양한 형태로 사용이 가능하다. (object 모양을 해도 되고 선택적 타입도 되고 등등)
- interface보다 활용도가 많다.

## interface 특징

- 오직 한가지 용도로 사용된다.
- 객체의 모양을 잡아준다.
- react에서 많이 사용된다.
- interface color = string ← 처럼 사용이 불가능하다.
- TS에게 오브젝트의 모양을 설명하기 위한것이다.
- 중복된 interface 이름을 사용해도 괜찮다. (TS가 알아서 축적을 해준다.)

```ts
interface User {
  name: string;
}

interface User {
  lastName: sting;
}

const SD : User = {
    name : 'sarangDaddy'
    lastName : 'KIM'
}
```

- 클래스를 다루는 듯한 느낌이라 사용이 더 편하다. → 더욱 직관적이다.
- 객체지향적인 방식을 가져와서 만들어졌다.
- **extends 사용이 가능하다.**

```ts
// class 구조와 비슷한 interface 사용 예시
interface User {
  name: string;
}

interface Player extends User {}

const me: Player = {
  name: 'kim',
};

// type의 경우 아래와 같은 구조가 된다.
type User = {
  name: string;
};

type Player = User & {};

const me: Player = {
  name: 'kim',
};
```

> Type과 interface 둘 모두 사용 목적이 돌일하고 똑같이 적용된다.  
> 다만, 상속에 있어서 interface 방법이 직관적이다.  
> 객체 모양에서는 type보다 interface 사용을 추천한다.

## interface는 추상 클래스를 대체할 수 있다.

```ts
// 추상클래스 : 다른 클래스가 가져야 하는 청사진
abstract class User {
  constructor(
    protected firstName: string,
    protected lastName: string,
  ) {}

  abstract sayHi(name: string): string;
  abstract fullName(): string;
}

class Player extends User {
  fullName() {
    return `${this.firstName} ${this.fullName}`;
  }

  sayHi(name: string): string {
    return `Hello ${name}. My name is ${this.fullName}`;
  }
}

// interface로 추상클래스 역할을 하도록 할 수 있다.
interface User {
  firstName: string;
  lastName: string;
  sayHi(name: string): string;
  fullName(): string;
}

class Player implements User {
  constructor(
    public firstName: string,
    public lastName: string,
  ) {}

  fullName() {
    return `${this.firstName} ${this.fullName}`;
  }

  sayHi(name: string): string {
    return `Hello ${name}. My name is ${this.fullName}`;
  }
}
```

```ts
// 한개 이상의 interface를 가질수도 있다.
interface User {
  firstName: string;
  lastName: string;
  sayHi(name: string): string;
  fullName(): string;
}

interface Human {
  health: number;
}

class Player implements User, Human {
  constructor(public firstName: string, public lastName: string, public health: number;) {}

  fullName() {
    return `${this.firstName} ${this.fullName}`;
  }

  sayHi(name: string): string {
    return `Hello ${name}. My name is ${this.fullName}`;
  }
}
```

- TS에서 추상클래스를 만들면 컴파일된 JS코드에는 하나의 클래스로 형성된다.
- 하지만, interface는 JS로 컴파일하면 사라지는 코드이기에 더 가볍다.
- 다만, private 프로퍼티를 사용할 수 없다.
