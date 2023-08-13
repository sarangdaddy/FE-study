## [Scrolling an image carousel](https://react-ko.dev/learn/referencing-values-with-refs)

- Next 버튼을 클리하면 이미지를 하나씩 넘어간다.
- 이미지가 넘어가면 해당 이미지가 가운데로 오도록 `브라우저를 스크롤` 해주고 싶다.
- 해당 기능을 구현하려면 [scrollIntoView()](https://developer.mozilla.org/ko/docs/Web/API/Element/scrollIntoView)를 호출해야 한다.
- 현재 선택된 이미지(Node)가 무엇인지 알아야 한다.
- 선택된 이미지 Node를 ref에 할당한다.

```jsx
<li key={cat.id} ref={index === i ? selectedRef : null}>
```

- 해당 Node(ref)를 가운데로 오도록 스크롤 한다.

```jsx
selectedRef.current.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center',
});
```

- `flushSync`로 스크롤 전에 DOM을 업데이트 하도록 강제한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/42381aa6-f52e-4db9-be5f-cc99c0a3513b/image.gif">

## ref에 할당되는 `<li> 엘리먼트` 타입

```jsx
// prettier-ignore
const selectedRef = useRef<HTMLLIElement | null>(null);
```
