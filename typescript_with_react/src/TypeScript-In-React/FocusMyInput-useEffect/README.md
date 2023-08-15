## [Focus a field conditionally](https://react-ko.dev/learn/synchronizing-with-effects#what-are-good-alternatives-to-data-fetching-in-effects)

- form을 클릭하면 MyInput 항목이 두개가 나온다.
- MyInput 컴포넌트가 `모두` 자신을 초점으로 맞추면 마지막 항목이 초점을 가져간다.

```jsx
useEffect(() => {
  ref.current.focus();
}, []);
```

- MyInput 컴포넌트가 렌더링되면 자동으로 첫번째 컴포넌트에 focus를 해주고 싶다.
- 첫 번째 MyInput에 초점을 두기 위해서는 props로 초점을 맞추기 위한 컴포넌트를 구분해야 한다.

```jsx
<MyInput
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  shouldFocus={true}
/>

<MyInput
  value={lastName}
  onChange={e => setLastName(e.target.value)}
  shouldFocus={false}
/>
```

- 초점을 받은 컴포넌트를 사이드 이펙트(useEffect)로 focus 해준다.

```jsx
useEffect(() => {
  if (shouldFocus && ref.current) {
    ref.current.focus();
  }
}, [shouldFocus]);
```

<img src="https://velog.velcdn.com/images/sarang_daddy/post/e3cfc875-cc70-4957-b4f8-27dfe04b6627/image.gif">

## MyInput 컴포넌트가 받는 props 타입

```jsx
interface MyInputProps {
  shouldFocus: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```
