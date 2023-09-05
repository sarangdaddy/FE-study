# 코인 계산기 (Fetching Data 클린업, Ref)

## fetch하는 useEffect에 클린업 함수 적용하기

- useEffect로 데이터를 fecth하는 과정에서 두 번 호출 될 수 있다.
- 이 경우에는 첫 번째 요청의 응답값은 무시해야 한다.

```tsx
useEffect(() => {
  let ignore = false;

  fetch('https://api.coinpaprika.com/v1/tickers?limit=10')
    .then((res) => res.json())
    .then((json) => {
      if (!ignore) {
        setCoins(json);
        setIsLoading(false);
      }
    });

  return () => {
    ignore = true;
  };
}, []);
```

- 두 번째 요청 `ignore = true`의 응답값만 처리한다.

## 로딩 후 입력창에 포커싱과 내용 선택 자동으로 주기

- input 엘리먼트 속성에 `autoFocus`을 주어 페이지 로딩시 자동으로 포커싱을 준다.

```tsx
<input
  className="InputPrice"
  ref={inputRef}
  autoFocus
  value={myMoney}
  type="text"
  onChange={handleChangeMyMoney}
  min={0}
/>
```

- useRef를 사용하여 참조 `inputRef`를 생성한다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

- 참조 `inputRef`를 input 엘리먼트와 연결한다.

```tsx
<input
  className="InputPrice"
  ref={inputRef}
  autoFocus
  value={myMoney}
  type="text"
  onChange={handleChangeMyMoney}
  min={0}
/>
```

- 로딩 후 useEffect를 사용하여 참조 중인 엘리먼트를 `select()`되게 한다.

```tsx
useEffect(() => {
  if (!isLoading && inputRef.current) {
    inputRef.current.select();
  }
}, [isLoading]);
```

![](https://velog.velcdn.com/images/sarang_daddy/post/385ed3a1-6cae-46be-9411-84a179815882/image.gif)

</hr>

## input 엘리먼트를 참조하는 ref 타입

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

## input 엘리먼트에 사용되는 onChangeEvert 타입

```tsx
const handleChangeMyMoney = (event: ChangeEvent<HTMLInputElement>) => {
  const inputValue = event.target.value;

  setMyMoney(inputValue);
};
```
