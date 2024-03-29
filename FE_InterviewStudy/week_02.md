# Week_02

## 1. CORS에 대해서 설명해보세요.

- 기본적으로 웹 페이지는 자신과 다른 도메인의 리소스에 접근하는 것을 제한합니다.
- 이것을 동일 출처 정책 SOP(Same-Origin Policy)라고 합니다.
- 하지만 실제 웹 페이지는 다양한 서비스를 통합하면서 다른 출처의 리소스를 요청하는 경우가 많아졌습니다.
- 이를 해결하기 위해 CORS가 등장했습니다.
- Cross-Origin Resource Sharing 교차 출처 정책이라하며
- 서버에서 CORS를 지원하도록 설정하면 다른 도메인이라도 리소스에 접근할 수 있도록 지정할 수 있습니다.
- 다른 도메인의 서버가 응댭 HTTP 헤더에 허용하는 접근 출처에 대한 정보(ACAO)를 명시함으로써,
- 해당 출처의 웹 페이지가 리소스에 대한 요청을 수행할 수 있게 됩니다.

### ACAO (Access-Control-Allow-Origin)

```
// 모든 도메인 허용
Access-Control-Allow-Origin: *

// 특정 도메인 허용
Access-Control-Allow-Origin: http://example.com
// 추가 옵션
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

</br>

## 2. Get과 Post는 어떤 차이점이 있나요?

- 둘의 가장 큰 차이점은 사용 목적이 다릅니다.
- GET은 서버에서 정보를 조회하는데 사용되며 POST는 서버로 데이터를 전송하여 리소스를 생성하거나 변경합니다.
- 특징으로는 GET은 url로 데이터를 전송하고 POST는 요청 본문 body에 데이터를 포함하여 전송합니다.
- 이러한 특징으로 GET은 url로 요청을 보내기에 데이터 크기 제한과 보안에 취약합니다.
- 하지만 리소스를 변경하지 않는다는 부분에서는 안전하다고 볼 수 있습니다.
- POST는 요청 데이터가 본문에 포함되므로 UTL에 노출되지 않습니다.
- 하지만 이 또한 암호화 되지 않으면 확인이 가능하기에 보안에는 취약할 수 있습니다.
- 또한 리소스를 변경하는 요청이므로 안전하지 않은 작업이라고 볼 수 있습니다.

## 꼬리 질문 대응 추가 학습

### 2-1. 데이터 노출로 어떤 위험이 있는지?

- 웹에서 데이터를 전송할 때, 이 데이터는 여러 네트워크 노드들을 거치며 전달됩니다.
- 이 전송 과정 중에 악의적인 의도로 중간에 데이터를 가져갈 수 있습니다.
- 때문에 HTTP가 아닌 HTTPS를 사용해야 합니다.
- HTTPS는 SSL/TLS 프로토콜을 사용하여 데이터를 암호화 합니다.
- 데이터가 암호화 되기에 중간에 데이터를 가로채서 확인하더라도 해석하지 못합니다.

</br>

## 3. 해시맵(해시테이블) 자료구조의 특징에 대해서 알고있나요?

- 해시맵은 키와 값을 저장하는 자료구조 입니다.
- 이 자료구조의 핵심은 `해시함수`로 키를 해시함수에 입력하면, 해당 키에 대한 값을 반환해줍니다.
- 고유한 키를 가지고 있기에 특정 값을 검색하는데 특화된 자료구조입니다.

</br>

## 4. Big-O Notation의 시간복잡도 측정방법에 대해서 설명해보세요.

- Big-O 표기법은 특정 상황에서 어떤 알고리즘이 더 적합한지 결정하는데 사용되는 측정 도구 입니다.
- 기본적으로 어떤 문제를 해결하기 위해 수행해야하는 `연산의 횟수`가 `입력 크기`에 따라 어떻게 증가하는지를 나타냅니다.

</br>

## 5. 리액트 클래스 컴포넌트와 함수형 컴포넌트는 어떤 차이점이 있나요?

- 클래스 컴포넌트는 class를 사용하여 컴포넌트를 구성하는 방식으로 이전에 많이 사용되던 방식입니다.
- 함수형 컴포넌트는 class의 사용없이 간단한 함수로들로 컴포넌트를 구성합니다.
- 특히 React 16.8부터 도입된 Hook을 사용할 수 있습니다.
- Hook의 도입으로 간결하고 이해하기 쉬운 코드 작성이 가능하기에 함수형 컴포넌트를 선호하는 추세입니다.
