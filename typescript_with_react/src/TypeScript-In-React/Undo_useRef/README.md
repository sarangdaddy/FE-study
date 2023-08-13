## [Fix a broken chat input](https://react-ko.dev/learn/referencing-values-with-refs)

- 모든 로컬 변수는 리랜더링시 처음으로 초기화 된다.
- setTimeout의 ID값은 기억해두고 clearTimeout에 전달해줘야한다.
- ref로 보존하고 전달한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/ce828a9c-091c-4253-821f-9221d06e510c/image.gif">

## setTimeout의 반환값의 타입

```jsx
  const timeoutID = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = () => {
    setIsSending(true);
    timeoutID.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  };
```
