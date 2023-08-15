## [Fix fetching inside an Effect](https://react-ko.dev/learn/synchronizing-with-effects#what-are-good-alternatives-to-data-fetching-in-effects)

- 마운트 시 비동기 함수 `fetchBio(person)`을 호출하여 `person`이 변경될 때마다 약력을 로드한다.
- 패칭이 완료되면 비동기 함수는 문자열을 resolve하는 Promise를 반환하고 setBio로 상태를 변경한다.

```jsx
useEffect(() => {
  setBio(null);
  fetchBio(person).then((result) => {
    setBio(result);
  });
}, [person]);
```

> 여기에는 심각한 버그가 존재한다.

- 'A'를 선택하면 fetchBio('A')가 발동된다.
- fetchBio('A')가 완료되기전에 'B'를 선택하면 fetchBio('B')도 발동된다.
- fetchBio('B')가 완료되면 'B'가 렌더링된다.
- fetchBio('A')가 이어서 완료되면서 'A'가 렌더링된다.

> 이처럼 두 개의 비동기 연산이 서로 '경쟁'해서 예기치 않은 순서로 도착할 수 있는 버그를 `조건 경합`이라 한다.

- `조건 경합`을 수정하려면 `클립업 함수`를 추가해야 한다.

```jsx
useEffect(() => {
  let ignore = false;
  setBio(null);
  fetchBio(person).then((result) => {
    if (!ignore) {
      setBio(result);
    }
  });
  return () => {
    ignore = true;
  };
}, [person]);
```

- 'A'를 선택하면 fetchBio('A')가 발동된다.
- fetchBio('A')가 완료되기전에 'B'를 선택하면 fetchBio('B')가 발동되고 **fetchBio('A')의 Effect가 클린업(취소) 된다.**
- fetchBio('B')가 완료되면 'B'가 렌더링된다.
- fetchBio('A')가 이어서 완료되지만 Effect ignore 플래그가 'true'이기 때문에 아무 작업도 수행하지 않는다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/2c6018c8-a336-417c-8ca6-42a1b5e21393/image.gif">

## fetch함수의 Promise 반환 타입

```jsx
export async function fetchBio(person: string): Promise<string> {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  });
}
```
