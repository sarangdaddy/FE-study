# 32장 String

표준 빌트인 객체인 String은 원시 타입인 문자열을 다룰 때 유요한 프로퍼티와 메서드를 제공한다.

## 32.1 String 생성자 함수

- 표준 빌트인 객체인 String 객체는 생성자 함수 객체다. 즉, 인스턴트 생성이 가능하다.
- 생성된 인스턴스는 String을 가지는 `래퍼 객체`다.
- String 래퍼 객체는 유사 배열 객체이면서 이터러블이다. -> **배열과 유사하게 인덱스를 사용하여 각 요소에 접근이 가능하다.**
- 단, 문자열은 원시 값이므로 변경할 수 없다.

```js
// 문자열은 원시값이므로 변경할 수 없다. 이때 에러가 발생하지 않는다.
strObj[0] = "S";
console.log(strObj); // 'Lee'
```

- String 생성자 함수에 문자열이 아닌 값을 전달하면 문자열로 강제한다.

```js
// 숫자 타입 => 문자열 타입
String(1); // -> "1"
String(NaN); // -> "NaN"
String(Infinity); // -> "Infinity"

// 불리언 타입 => 문자열 타입
String(true); // -> "true"
String(false); // -> "false"
```

## 32.3 length 프로퍼티

String 래퍼 객체는 유사 배열 객체이므로 배열처럼 length를 가진다.

## 32.3 String 메서드

문자열은 원시 값이기 때문에 String 래퍼 객체도 읽기 전용 객체다.  
즉, **원본 String 래퍼객체를 직접 변경하는 메서드는 존재하지 않는다.**

### indexOf

- 대상 문자열(메서드를 호출한 문자열)에서 인수로 전달받은 문자열을 검색하여 첫 번째 인덱스 반환
- 검색에 실패하면 -1 반환

```js
const str = "Hello World";

// 문자열 str에서 'l'을 검색하여 첫 번째 인덱스를 반환한다.
str.indexOf("l"); // -> 2

// 문자열 str에서 'or'을 검색하여 첫 번째 인덱스를 반환한다.
str.indexOf("or"); // -> 7

// 문자열 str에서 'x'를 검색하여 첫 번째 인덱스를 반환한다. 검색에 실패하면 -1을 반환한다.
str.indexOf("x"); // -> -1
```

- 문자열에서 특정 str을 찾는데 유용하다.

```js
if (str.indexOf("Hello") !== -1) {
  // 문자열 str에 'Hello'가 포함되어 있는 경우에 처리할 내용
}

if (str.includes("Hello")) {
  // 문자열 str에 'Hello'가 포함되어 있는 경우에 처리할 내용
}
```

### search

인수로 전달받은 정규 표현식과 매치하는 문자열을 검색하여 인덱스를 반환한다.

```js
const str = "Hello world";

// 문자열 str에서 정규 표현식과 매치하는 문자열을 검색하여 일치하는 문자열의 인덱스를 반환한다.
str.search(/o/); // -> 4
str.search(/x/); // -> -1
```

### includes

인수로 전달받은 문자열이 `포함`되어 있는지 확인하여 그 결과를 true, false로 반환한다.

```js
const str = "Hello world";

str.includes("Hello"); // -> true
str.includes(""); // -> true
str.includes("x"); // -> false
str.includes(); // -> false
```

### startsWith

인수로 전달받은 문자열로 `시작`하는지 확인하여 그 결과를 true, false로 반환한다.

```js
const str = "Hello world";

// 문자열 str이 'He'로 시작하는지 확인
str.startsWith("He"); // -> true
// 문자열 str이 'x'로 시작하는지 확인
str.startsWith("x"); // -> false

// 문자열 str의 인덱스 5부터 시작하는 문자열이 ' '로 시작하는지 확인
str.startsWith(" ", 5); // -> true
```

### endsWith

인수로 전달받은 문자열로 끝나는지 확인하여 그 결과를 true, false로 반환한다.

```js
const str = "Hello world";

// 문자열 str이 'ld'로 끝나는지 확인
str.endsWith("ld"); // -> true
// 문자열 str이 'x'로 끝나는지 확인
str.endsWith("x"); // -> false

// 문자열 str의 처음부터 5자리까지('Hello')가 'lo'로 끝나는지 확인
str.endsWith("lo", 5); // -> true
```

### charAt

인수로 전달받은 인덱스에 위치한 문자를 검색하여 반환한다.

```js
const str = "Hello";

for (let i = 0; i < str.length; i++) {
  console.log(str.charAt(i)); // H e l l o
}
```

### substring

첫 번째 인수로 전달받은 인덱스에 위치하는 문자부터 두 번째 인수로 전달받은 인덱스에 위치하는 문자의 바로 이전 문자까지의 부분 문자열을 반환한다.

```js
const str = "Hello World";

// 인덱스 1부터 인덱스 4 이전까지의 부분 문자열을 반환한다.
str.substring(1, 4); // -> ell
```

두번째 인수가 없거나 첫 번째 인수보다 작아도 정해진 로직으로 정상 작동한다.

- 첫 번재 인수 > 두 번째 인수인 경우 두 인수는 교환된다.
- 인수 < 0 또는 NaN인 경우 0으로 취급된다.
- 인수 > 문자열의 길이인 경우 인수는 문자열의 길이로 취급된다.

```js
const str = "Hello World";

// 인덱스 1부터 마지막 문자까지 부분 문자열을 반환한다.
str.substring(1); // -> 'ello World'

// 첫 번째 인수 > 두 번째 인수인 경우 두 인수는 교환된다.
str.substring(4, 1); // -> 'ell'

// 인수 < 0 또는 NaN인 경우 0으로 취급된다.
str.substring(-2); // -> 'Hello World'

// 인수 > 문자열의 길이(str.length)인 경우 인수는 문자열의 길이(str.length)으로 취급된다.
str.substring(1, 100); // -> 'ello World'
str.substring(20); // -> ''
```

> indexOf와 함께 사용하여 특정 문자열을 기준으로 앞뒤에 위치한 부분 문자열을 취득할 수 있다.

```js
const str = "Hello World";

// 스페이스를 기준으로 앞에 있는 부분 문자열 취득
str.substring(0, str.indexOf(" ")); // -> 'Hello'

// 스페이스를 기준으로 뒤에 있는 부분 문자열 취득
str.substring(str.indexOf(" ") + 1, str.length); // -> 'World'
```

### slice

- substring와 동일하게 동작한다.
- 다만, 인수로 `음수`를 전달 할 수 있다.
- `음수`를 전달하면 뒤에서부터 문자열을 잘라내어 반환한다.

```js
const str = "hello world";

// substring과 slice 메서드는 동일하게 동작한다.
// 0번째부터 5번째 이전 문자까지 잘라내어 반환
str.substring(0, 5); // -> 'hello'
str.slice(0, 5); // -> 'hello'

// 인덱스가 2인 문자부터 마지막 문자까지 잘라내어 반환
str.substring(2); // -> 'llo world'
str.slice(2); // -> 'llo world'

// 인수 < 0 또는 NaN인 경우 0으로 취급된다.
str.substring(-5); // -> 'hello world'
// slice 메서드는 음수인 인수를 전달할 수 있다. 뒤에서 5자리를 잘라내어 반환한다.
str.slice(-5); // ⟶ 'world'
```

### toUpperCase

문자열을 `대문자`로 반환한다.

```js
const str = "Hello World!";

str.toUpperCase(); // -> 'HELLO WORLD!'
```

### toLowerCase

문자열을 `소문자`로 반환한다.

```js
const str = "Hello World!";

str.toLowerCase(); // -> 'hello world!'
```

### trim

문자열의 앞뒤에 `공백 문자`가 있을 경우 이를 제거한 문자열을 반환한다.

```js
const str = "   foo  ";

str.trim(); // -> 'foo'
```

```js
const str = "   foo  ";

// String.prototype.{trimStart,trimEnd} : Proposal stage 4
str.trimStart(); // -> 'foo  '
str.trimEnd(); // -> '   foo'
```

### repeat

대상 문자열을 인수로 전달받은 정수만큼 `반복`해 연결한 새로운 문자열을 반환한다.

```js
const str = "abc";

str.repeat(); // -> ''
str.repeat(0); // -> ''
str.repeat(1); // -> 'abc'
str.repeat(2); // -> 'abcabc'
str.repeat(2.5); // -> 'abcabc' (2.5 → 2)
str.repeat(-1); // -> RangeError: Invalid count value
```

### replace (문자열 교체)

첫 번쨰 인수로 전달받은 문자열 또는 정규표현식을 검색하여 두 번째 인수로 전달한 문자열로 반환한다.

```js
const str = "Hello world";

// str에서 첫 번째 인수 'world'를 검색하여 두 번째 인수 'Lee'로 치환한다.
str.replace("world", "Lee"); // -> 'Hello Lee'
```

> replace는 특수한 교체 패턴을 사용해서 문자열을 교체할 수 있다.

```js
const str = "Hello world";
// 특수한 교체 패턴을 사용할 수 있다. ($& => 검색된 문자열)
str.replace("world", "<strong>$&</strong>");

const str = "Hello Hello";
// 'hello'를 대소문자를 구별하지 않고 전역 검색한다.
str.replace(/hello/gi, "Lee"); // -> 'Lee Lee'
```

- 두 번째 인수로 `치홤 함수`를 전달 할 수있다.

```js
// 카멜 케이스를 스네이크 케이스로 변환하는 함수
function camelToSnake(camelCase) {
  // /.[A-Z]/g는 임의의 한 문자와 대문자로 이루어진 문자열에 매치한다.
  // 치환 함수의 인수로 매치 결과가 전달되고, 치환 함수가 반환한 결과와 매치 결과를 치환한다.
  return camelCase.replace(/.[A-Z]/g, (match) => {
    console.log(match); // 'oW'
    return match[0] + "_" + match[1].toLowerCase();
  });
}

const camelCase = "helloWorld";
camelToSnake(camelCase); // -> 'hello_world'

// 스네이크 케이스를 카멜 케이스로 변환하는 함수
function snakeToCamel(snakeCase) {
  // /_[a-z]/g는 _와 소문자로 이루어진 문자열에 매치한다.
  // 치환 함수의 인수로 매치 결과가 전달되고, 치환 함수가 반환한 결과와 매치 결과를 치환한다.
  return snakeCase.replace(/_[a-z]]/g, (match) => {
    console.log(match); // '_w'
    return match[1].toUpperCase();
  });
}

const snakeCase = "hello_world";
snakeToCamel(snakeCase); // -> 'helloWorld'
```

### split

문자열에서 첫 번째 인수로 전달한 문자열 또는 정규 표현식을 검색하여 문자열을 구분한 후 `분리된` **각 문자열로 이루어진 배열**을 반환한다.

```js
const str = "How are you doing?";

// 공백으로 구분(단어로 구분)하여 배열로 반환한다.
str.split(" "); // -> ["How", "are", "you", "doing?"]

// \s는 여러 가지 공백 문자(스페이스, 탭 등)를 의미한다. 즉, [\t\r\n\v\f]와 같은 의미다.
str.split(/\s/); // -> ["How", "are", "you", "doing?"]

// 인수로 빈 문자열을 전달하면 각 문자를 모두 분리한다.
str.split(""); // -> ["H", "o", "w", " ", "a", "r", "e", " ", "y", "o", "u", " ", "d", "o", "i", "n", "g", "?"]

// 인수를 생략하면 대상 문자열 전체를 단일 요소로 하는 배열을 반환한다.
str.split(); // -> ["How are you doing?"]
```

두 번째 인수로 배열의 길이를 지정할 수 있다.

```js
// 공백으로 구분하여 배열로 반환한다. 단, 배열의 길이는 3이다
str.split(" ", 3); // -> ["How", "are", "you"]
```

split 메서드는 `배열`을 반환하므로 `Array.prototype.reverse`, `Array.prototype.join` 메서드와 함께 사용하면 문자열을 역순으로 뒤집을 수 있다.

```js
// 인수로 전달받은 문자열을 역순으로 뒤집는다.
function reverseString(str) {
  return str.split("").reverse().join("");
}

reverseString("Hello world!"); // -> '!dlrow olleH'
```
