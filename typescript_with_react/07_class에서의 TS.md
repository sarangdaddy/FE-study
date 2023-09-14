# class에서 사용하는 TypeScript

- JavaScript에서는 제공되지 않았던 class의 몇가지 기능을 TypeScript를 사용함으로써 가능하게 해준다.

## Private

```ts
// TS
class Player {
  constructor(
    private firstName: string,
    private lastName: string,
    public nickName: string,
  ) {}
}

const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.firstName); // 'firstName' 속성은 private이며 'Player' 클래스 내에서만 액세스할 수 있습니다.
console.log(sarangDaddy.nickName); // SD
```

- TypeScript에서는 JavaScript에서 사용할 수 없는 `private`사용이 가능하다.
- 즉, `sarangDaddy.fistName` // private 값을 읽어올 수 없도록 막아주는 기능이 추가된다.

## 추상클래스 (abstract class)

- 추상클래스란 다른 클래스가 상속받을 수 있는 클래스다.
- 추상클래스는 상속 받을 수 만 있고, 직접적으로 인스턴스를 만들지는 못한다.

> 추상클래스는 특정 작업을 수행하는데 필요한 기본적인 구조와 기능을 제공하며,  
> 구체적인 구현은 하위 클래스에서 제공한다.  
> 이를 통해 코드의 재사용성을 높이고, 유연성을 갖출 수 있다.

```ts
// 추상클래스 선언
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    public nickName: string,
  ) {}
}

// 추상클래스 상속
class Player extends User {}
const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.nickName); // SD
console.log(sarangDaddy.firstName); // 'firstName' 속성은 private이며 'User' 클래스 내에서만 액세스할 수 있습니다.
```

### 구체 메서드 (추상클래스 안의 메서드)

- 구체 메서드는 구체적인 구현을 포함한다.
- 즉, 구체 메서드는 추상 메서드가 아니다.
- **추상 메서드는 구현없이 선언만 존재한다.**

```ts
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private nickName: string,
  ) {}

  // 추상클래스 안의 메서드
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Player extends User {}
const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.getFullName()); // sarangDaddy Kim
```

- `sarangDaddy.getFullName()`는 `firstName`, `lastName`가 private임에도 문제 없이 실행된다.
- 메서드 또한 private하게 만들고 싶으면 private 선언을 해야한다.

```ts
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private nickName: string,
  ) {}

  // 추상클래스 안의 메서드에 private 선언
  private getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Player extends User {}
const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.getFullName()); // 'getFullName' 속성은 private이며 'User' 클래스 내에서만 액세스할 수 있습니다.
```

- 위 방식으로 `getFullName`메서드는 `User`클래스 외부에서는 호출할 수 없다.
- **하지만 이 방식은 하위 클래스인 `Player`에서도 해당 메서드를 사용할 수 없게 된다.**

> `private getFullName()`메서드를 `User`클래스 내부와 그 하위 클래스에서만 사용하려면 `protected` 키워드를 사용해야 한다.

```ts
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private nickName: string,
  ) {}

  // 추상클래스 안의 메서드에 protected 선언
  protected getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Player extends User {}
const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.getFullName()); // 'getFullName' 속성은 보호된 속성이며 'User' 클래스 및 해당 하위 클래스 내에서만 액세스할 수 있습니다.
```

- `User`클래스 내부와 그 하위 클래스 `Player` 내부에서의 사용은 허용되었다.
- 하지만 getFullName 메서드를 사용하는것은 Player의 인스턴스 sarangDaddy다.
- Player의 인스턴스에게 사용을 주기위해서는 Plater 내부에서 접근해야 한다.

```ts
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private nickName: string,
  ) {}

  // 추상클래스 안의 메서드에 private 선언
  protected getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Player extends User {
  // Player 메서드
  showFullName() {
    // 추상 클래스의 구체 메서드 접근
    return this.getFullName();
  }
}
const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');

console.log(sarangDaddy.showFullName()); // sarangDaddy Kim
```

> `showFullName()`와 같은 하위 클래스의 메서드를 강제하고 싶을때 추상 메서드를 사용한다.

### 추상 메서드

- 추상 메서드는 추상 클래스를 상속받는 `하위 클래스에 메서드를 강제` 하고자 할때 사용한다.
- 즉, 추상 메서드를 가지는 추상 클래스를 상속받은 하위 클래스는 반드시 추상 메서드를 구체화 해야한다.

```ts
abstract class User {
  constructor(
    private firstName: string,
    private lastName: string,
    private nickName: string,
  ) {}

  // 추상 메서드 선언
  abstract getNickName(): void; // Call Signatures로 선언
}

class Player extends User {
  // 반드시 구현되어야 하는 하위 클래스 메서드
  getNickName() {
    return this.nickName;
  }
}

const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');
console.log(sarangDaddy.getNickName()); // 'nickName' 속성은 private이며 'User' 클래스 내에서만 액세스할 수 있습니다.
```

- private는 해당 클래스 내에서만 사용이 가능하다.
- **상속받은 클래스에서도 사용이 가능하게 하기 위해서는 protected를 사용한다.**

```ts
abstract class User {
  constructor(
    protected firstName: string,
    protected lastName: string,
    protected nickName: string,
  ) {}

  // 추상 메서드 선언
  abstract getNickName(): void; // Call Signatures로 선언
}

class Player extends User {
  // 반드시 구현되어야 하는 하위 클래스 메서드
  getNickName() {
    return this.nickName;
  }
}

const sarangDaddy = new Player('sarangDaddy', 'Kim', 'SD');
console.log(sarangDaddy.getNickName()); // SD
```
