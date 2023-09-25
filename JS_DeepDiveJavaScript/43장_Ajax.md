# 43장 Ajax

## 43.1 Ajax란? (Asynchronous JavaScript and XML)

Ajax란 자바스크립트를 사용하여 브라우저가 서버에게 비동기 방식으로 테이더를 요청하고,  
서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식을 말한다.

Ajax는 브라우저에서 제공하는 Web API인 XMLHttpRequest 객체를 기반으로 동작한다.  
XMLHttpRequest는 HTTP 비동기 통신을 위한 메서드와 프로퍼티를 제공한다.

과거 웹피이지는 html태그로 시작하여 html태그로 끝나는 HTML 전체를 렌더링 하는 방식이었다.  
이는 화면이 전환되면 서버로부터 새로운 HTML을 전송받아 처음부터 다시 렌더링 하기에 단점이 있었다.

- 변경이 필요 없는 부분까지 다시 서버로부터 전송받기에 불필요한 데이터 통신 발생.
- 전체를 다시 렌더링하기에 화면 전환 순간 깜빡이는 현상 발생.
- 클라이언트와 서버와의 통신이 동기 방식으로 동작하기에 서버로부터 응답이 있을 때까지 블로킹 발생.

> Ajax의 등장은 `변경이 필요한 부분만` 비동기 방식으로 전송받아 위 같은 단점을 보완했다.

<br/>

## 43.2 JSON (JavaScript Object Notation)

: 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다.  
: 객체 리터럴와 유사하게 키와 값으로 구성된 순수한 텍스트다.(키와 문자열은 "" 사용 ''사용 불가)

### 43.2.2 JSON.stringfy

클라이언트가 사버로 객체를 전송하려면 객체를 문자열(직렬화)해야하는데 이를 해주는게 JSON.strinigfy() 메서드다.

```js
const obj = {
  name: "lee",
  age: 20,
  hobby: ["bicyle", "swimming"],
};

const json = JSON.stringify(obj);
console.log(typeof json, json);
// string {"name":"lee","age":20,"hobby":["bicyle","swimming"]}

const prettyJson = JSON.stringify(obj, null, 2);
console.log(typeof prettyJson, prettyJson);
/* 
string {
    "name": "lee",
    "age": 20,
    "hobby": [
      "bicyle",
      "swimming"
    ]
  }
*/

// 배열에도 적용 가능하다.
```

### 43.2.3 JSON.parse

반대로 서버로 부터 전송된 JSON데이터는 문자열이다.  
이를 객체로 변환(역직렬화) 해주는 메서드가 JSON.parse()다.

```js
const parsed = JSON.parse(json);
console.log(parsed);
// { name: 'lee', age: 20, hobby: [ 'bicyle', 'swimming' ] }
```

</br>

## 43.3 XMLHttpRequest

브라우저는 주소창이나 HTML의 `from` or `a` 태그를 통해 HTTP 요청이 가능하다.  
그리고 자바스크립트를 사용하여 HTTP 요청을 전송하려면 XMLHttpRequest 객체를 사용해야한다.  
XMLHttpRequest는 Web API이므로 브라우저 환경에서만 실행된다.

```js
// XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();
```

### 43.3.2 XMLHttpRequest 객체의 프로퍼티와 메서드

| 프로토타입 프로퍼티 |                           설명                            |
| :-----------------: | :-------------------------------------------------------: |
|       status        |     HTTP 요청에 대한 응답상태를 나타내는 정수 ex)200      |
|    responseType     | HTTP 응답 타입 ex)document, json, text, blob, arraybuffer |

</br>

| 이벤트 핸들러 프로퍼티 |                설명                 |
| :--------------------: | :---------------------------------: |
|   onreadystatechange   | readyState프로퍼티 값이 변경된 경우 |
|        onerror         |   HTTP 요청에 에러가 발생한 경우    |
|         onload         | HTTP 요청이 성공적으로 완료한 경우  |

</br>

|      메서드      |              설명               |
| :--------------: | :-----------------------------: |
|       open       |        HTTP 요청 초기화         |
|       send       |         HTTP 요청 전송          |
|      abort       |      전송된 HTTP 요청 중단      |
| setRequestHeader | 특정 HTTP 요청 헤더의 값을 설정 |

</br>

|  정적 프로퍼티   | 값  |                 설명                  |
| :--------------: | :-: | :-----------------------------------: |
|      UPSENT      |  0  |         open 메서드 호출 이전         |
|      OPENED      |  1  |         open 메서드 호출 이후         |
| HEADERS_RECEIVED |  2  |         send 메서드 호출 이후         |
|     LOADING      |  3  | 서버 응답 중(응담 데이터 미완성 상태) |
|       DONE       |  4  |            서버 응답 완료             |

</br>

### 43.3.3 HTTP 요청 전송

- HTTP 요청을 전송하는 경우 다음 순서를 따른다.

```js
// XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

// 1. HTTP 요청 초기화
xhr.open("GET", "/users");

// 3. HTTP 요청 헤더 설정 (필요에 따라)
// 클라이언트가 서버로 전송할 데이터의 MIME 타입 지정 : json
xhr.setRequestHeader("content-type", "application/json");

// 2. HTTP 요청 전송
xhr.send();
```

> [MIME 타입](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)이란 클라이언트에게 전송된 문서의 다양성을 알려주기 위한 메커니즘이다.  
>  웹에서 파일의 확장자는 별 의미가 없다. 그러므로, 각 문서와 함께 올바른 MIME 타입을 전송하도록,  
>  서버가 정확히 설정하는 것이 중요하다.  
>  브라우저들은 리소스를 내려받았을 때 해야 할 기본 동작이 무엇인지를 결정하기 위해 대게 MIME 타입을 사용한다.

#### 1. HTTP 요청 메서드 (XMLHttpRequest.prototype.open)

: 클라이언트가 서버에게 요청의 종류와 목적(리소스 행위)을 알리는 방법이다.

- xhr.open(method, url[, async])

| 매서드 |      종류      |         목적          | 페이로드 |
| :----: | :------------: | :-------------------: | :------: |
|  GET   | index/retrieve | 모든/특정 리로스 취득 |    X     |
|  POST  |     create     |      리소스 생성      |    O     |
|  PUT   |    replace     |   리소스 전체 교체    |    O     |
| PATCH  |     modify     |   리소스 일부 수정    |    O     |
| DELETE |     delete     | 모든/특정 리소스 삭제 |    X     |

> [페이로드(payload)](<https://ko.wikipedia.org/wiki/%ED%8E%98%EC%9D%B4%EB%A1%9C%EB%93%9C_(%EC%BB%B4%ED%93%A8%ED%8C%85)>)는 사용에 있어서 전송되는 데이터를 뜻한다.  
> 페이로드는 전송의 근본적인 목적이 되는 데이터의 일부분으로  
> 그 데이터와 함께 전송되는 헤더와 메타데이터와 같은 데이터는 제외한다.

```js
{
    "status":"OK",
    "data": {
        "message":"Hello, world!"
    }
}
// 여기서 "Hello, world!"가 클라이언트가 관심을 가지는 페이로드이다.
// 나머지 부분은, 중요하긴 하지만, 프로토콜 오버헤드이다.
```

#### 2. HTTP 요청 전송 메서드 (XMLHttpRequest.prototype.send)

: send 메서드는 open 메서드로 초기화된 HTTP 요청을 서버에 전송한다.

- GET 요청 메서드의 경우 데이터를 URL의 일부분인 쿼리 문자열로 서버에 전송한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/af5cc25c-719a-41a9-a294-a597ba8d65cf/image.png" width="50%">

- POST 요청 메서드의 경우 데이터(페이로드)를 요청 몸체(request body)에 담아 전송한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/2712e344-d65d-4738-9c81-eb339b96f9ea/image.png" width="50%">

> send 메서드에는 요청 몸체에 담아 전송할 데이터(페이로드)를 인수로 전달할 수있다.  
> 페이로드가 객체인 경우는 JSON.stringify 메서드를 사용하여 직렬화 해야한다.  
> **HTTP 요청 메서드가 GET인 경우** send 메서드에 페이로드로 전달한 인수는 무시되고 요청 몸체는 null로 설정된다.

#### 3. HTTP 요청 헤더 설정 (XMLHttpRequest.prototype.setRequestHeader)

: setRequestHeader 메서드는 특정 HTTP 요청의 헤더 값을 설정한다.  
 : setRequestHeader 메서드는 반드시 open 메서드를 호출한 이후에 호출해햐 한다.

```js
// XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

// HTTP 요청 초기화
xhr.open("GET", "/users");

// HTTP 요청 헤더 설정 (필요에 따라)
// 클라이언트가 서버로 전송할 데이터의 MIME 타입 지정 : json
xhr.setRequestHeader("content-type", "application/json");

// 서버가 응답할 데이터의 MIME 타입 지정 : json
xhr.setRequestHeader("accept", "application/json");

// HTTP 요청 전송
xhr.send(JSON.stringify({ id: 1, content: "HTML", completed: false }));
```

|  MIME 타입  |                      서브타입                      |
| :---------: | :------------------------------------------------: |
|    text     |  text/plain, text/html, text/css, text/javascript  |
| application | application/json, application/x-www-form-urlencode |
|  multipart  |                mulipart/formed-data                |

<br/>

### 43.3.4 HTTP 응답처리

: 서버가 전송한 응답을 처리하려면 XMLHttpRequest 객체가 발생시키는 이벤트를 캐치해야 한다.  
: 이벤트 개치로는 readystatechange를 통해 readyState 프로퍼티를 확인하는 방법과  
: load 이벤트로 요청이 성공적으로 발생했는지 확인 하는 방법이 있다.

```js
const xhr = new XMLHttpRequest();

// Fake REST API 제공 서비스 https://jsonplaceholder.typicode.com/todos/1
xhr.open("GET", "https://jsonplaceholder.typicode.com/todos/1");

xhr.send();

// load 이벤트는 HTTP 요청이 성공적으로 완료된 경우 발생한다.
xhr.onload = () => {
  // status 프로퍼티는 응답 상태 코드를 나타낸다.
  // status 프로터티 값이 200이면 정상적으로 응답한 상태이고
  // status 프로퍼티 값이 200이 아니면 에러 발생 상태다.
  // 정상적으로 응답된 상태라면 response 프로퍼티에 서버의 응답 결과가 담긴다.
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response));
  } else {
    console.error("Error", xhr.status, xhr.statusText);
  }
};
```

</br>

## ⭐️ 주요 HTTP 상태 코드

| 상태 |         응답          |         의미         |
| :--: | :-------------------: | :------------------: |
| 200  |          OK           |    정상적인 처리     |
| 302  |       See Other       | 주로 리다이렉트 용도 |
| 404  |       Not Found       |    리소스가 없다     |
| 403  |       Forbidden       |      권한 없음       |
| 500  | Internal Server Error |    서버 내부 오류    |
| 502  |      Bad Gateway      |    중간 계층 오류    |
| 503  |  Service Unavailable  |   서비스 제공불가    |
