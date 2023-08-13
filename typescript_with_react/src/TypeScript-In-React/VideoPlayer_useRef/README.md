## [Play and pause the video](https://react-ko.dev/learn/manipulating-the-dom-with-refs)

- 브라우저에서 동영상을 재생하고 정지하기 위해서는 `<video>`에 대한 DOM 요소에서 play()와 pause()를 호출해야 한다.
- DOM 요소에 접근하기 위해 ref를 사용한다.
- 브라우저 빌트인 컨트롤 처리를 위해 `<video>`요소에 핸들러를 추가한다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/0401cbf9-50e3-4de0-a3b6-4055abc08976/image.gif">

## `<video>`의 타입

- 비디오 엘리먼트에 대한 타입은 `HTMLVideoElement`다.

```jsx
const [isPlaying, setIsPlaying] = useState(false);
// prettier-ignore
const ref = useRef<HTMLVideoElement | null>(null);

function handleClick() {
  const nextIsPlaying = !isPlaying;
  setIsPlaying(nextIsPlaying);

  if (ref.current) {
    nextIsPlaying ? ref.current.play() : ref.current.pause();
  }
}
```
