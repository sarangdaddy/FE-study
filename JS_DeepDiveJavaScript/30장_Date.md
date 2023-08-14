# 30장 Date

표준 빌트인 객체인 Date는 날짜와 시간(연, 월, 일, 시, 분, 초, 밀리초)을 위한 메서드를 제공하는 `빌트인 객체`이면서 `생성자 함수`다.

- UTC와 GMT는 국제 표준시를 말한다.
- KST는 한국 표준시를 말한다.
- KST는 UTC보다 9시간 빠르다.

## 30.1 Date 생성자 함수

Data는 생성자 함수로 생성한 Date 객체는 기본적으로 현재 날짜와 시간을 나타내는 정수값을 가진다.

### 30.1.1 new Date()

- Date 생성자 함수를 인수 없이 `new 연산자`와 호출하면 현재 날짜와 시간을 가진 `Date 객체`를 반환한다.
- new 연산자 없이 호출하면 현재 날짜와 시간 정보를 `문자열`로 반환한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/dba1b067-ca56-420a-a9d8-e8948f586319/image.png" width="30%">

### 30.1.2 new Date(milliseconds)

Date 생성자 함수에 숫자 타입의 밀리초를 인수로 전달하면  
 `1970년 1월 1일 00:00:00(UTC)`을 기점으로 인수로 전달된 밀리초만큼 경과한 날짜와 시간을 나타내는 Date 객체를 반환한다.

```js
// 한국 표준시 KST는 협정 세계시 UTC에 9시간을 더한 시간이다.
new Date(0); // -> Thu Jan 01 1970 09:00:00 GMT+0900 (대한민국 표준시)

/*
86400000ms는 1day를 의미한다.
1s = 1,000ms
1m = 60s * 1,000ms = 60,000ms
1h = 60m * 60,000ms = 3,600,000ms
1d = 24h * 3,600,000ms = 86,400,000ms
*/
new Date(86400000); // -> Fri Jan 02 1970 09:00:00 GMT+0900 (대한민국 표준시)
```

### 30.1.3 new Date(dateString)

Date 생성자 함수에 `날짜와 시간을 나타내는 문자열`을 인수로 전달하면 지정된 날짜와 시간을 나타내는 Date 객체를 반환한다.

```js
new Date("May 26, 2020 10:00:00");
// Tue May 26 2020 10:00:00 GMT+0900 (한국 표준시)

new Date("2020/03/26/10:00:00");
// Thu Mar 26 2020 10:00:00 GMT+0900 (한국 표준시)
```

### 30.1.4 new Date(year, month[, day, hour, minute, second, millisecond])

Date 생성자 함수에 연, 월, 일, 시, 분, 초, 밀리초를 의미하는 숫자를 인수로 전달하면 지정된 날자와 시간을 나타내는 Date 객체를 반환한다.

- ❗️ month는 0부터 시작함에 주의 (0 = 1월)

```js
// 월을 나타내는 2는 3월을 의미한다. 2020/3/1/00:00:00:00
new Date(2020, 2);
// -> Sun Mar 01 2020 00:00:00 GMT+0900 (대한민국 표준시)

// 월을 나타내는 2는 3월을 의미한다. 2020/3/26/10:00:00:00
new Date(2020, 2, 26, 10, 00, 00, 0);
// -> Thu Mar 26 2020 10:00:00 GMT+0900 (대한민국 표준시)

// 다음처럼 표현하면 가독성이 훨씬 좋다.
new Date("2020/3/26/10:00:00:00");
// -> Thu Mar 26 2020 10:00:00 GMT+0900 (대한민국 표준시)
```

## 30.2 Date 메서드

### 30.2.1 Date.now

1970년 1월 1일 00:00:00(UTC)을 기점으로 현재 시간까지 경과한 밀리초를 `숫자로 반환`한다.

```js
const now = Date.now(); // -> 1593971539112

// Date 생성자 함수에 숫자 타입의 밀리초를 인수로 전달하면 1970년 1월 1일 00:00:00(UTC)을
// 기점으로 인수로 전달된 밀리초만큼 경과한 날짜와 시간을 나타내는 Date 객체를 반환한다.
// (30.1.2절 "new Date(milliseconds)" 참고)
new Date(now); // -> Mon Jul 06 2020 02:52:19 GMT+0900 (대한민국 표준시)
```

### 30.2.2 Date.parse

1970년 1월 1일 00:00:00(UTC)을 기점으로 인수로 전달된 `지정 시간`(new Date(dateString)의 인수와 동일한 형식)까지의 밀리초를 숫자로 반환한다.

```js
// UTC
Date.parse("Jan 2, 1970 00:00:00 UTC"); // -> 86400000

// KST
Date.parse("Jan 2, 1970 09:00:00"); // -> 86400000

// KST
Date.parse("1970/01/02/09:00:00"); // -> 86400000
```

### 30.2.3 Date.UTC

1970년 1월 1일 00:00:00(UTC)을 기점으로 인수로 전달된 지정 시간까지의 밀리초를 숫자로 반환한다.

```js
Date.UTC(1970, 0, 2); // 86400000
Date.UTC("1970/1/2"); // NaN
```

### 30.2.4 Date.prototype.getFullYear

Date 객체의 연도를 나타내는 정수를 반환한다.

```js
new Date("2020/07/24").getFullYear(); // 2020
```

### 30.2.5 Date.prototype.setFullYear

Date 객체에 연도를 나타내는 정수를 설정한다

```js
const today = new Date();

// 년도 지정
today.setFullYear(2000);
today.getFullYear(); // 2000

// 년도/월/일 지정
today.setFullYear(1900, 0, 1);
today.getFullYear(); // 1900
```

### 30.2.6 Date.prototype.getMonth

Date 객체의 월을 나타내는 0 ~ 11의 정수를 반환한다.

```js
new Date("2020/07/24").getMonth(); // 6
```

### 30.2.7 Date.prototype.setMonth

Date 객체에 월을 나타내는 0 ~ 11 사이의 정수를 설정한다.

```js
const today = new Date();

// 월 지정
today.setMonth(0); // 1월
today.getMonth(); // 0

// 월/일 지정
today.setMonth(11, 1); // 12월 1일
today.getMonth(); // 11
```

### [그외 Date 메서드 참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date)

## 30.3 Date를 활용한 시계예제

```js
(function printNow() {
  const today = new Date();

  const dayNames = [
    "(일요일)",
    "(월요일)",
    "(화요일)",
    "(수요일)",
    "(목요일)",
    "(금요일)",
    "(토요일)",
  ];
  // getDay 메서드는 해당 요일(0 ~ 6)을 나타내는 정수를 반환한다.
  const day = dayNames[today.getDay()];

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  let hour = today.getHours();
  let minute = today.getMinutes();
  let second = today.getSeconds();
  const ampm = hour >= 12 ? "PM" : "AM";

  // 12시간제로 변경
  hour %= 12;
  hour = hour || 12; // hour가 0이면 12를 재할당

  // 10미만인 분과 초를 2자리로 변경
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  const now = `${year}년 ${month}월 ${date}일 ${day} ${hour}:${minute}:${second} ${ampm}`;

  console.log(now);

  // 1초마다 printNow 함수를 재귀 호출한다. 41.2.1절 "setTimeout / clearTimeout" 참고
  setTimeout(printNow, 1000);
})();
```
