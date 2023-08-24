## [Implement multiple selection](https://react-ko.dev/learn/choosing-the-state-structure)

- 박스 안에는 여러 선택항목이 있다.
- 항목들은 `다중선택`이 가능해야한다.
- 체크박스를 다시 클릭하면 선택에서 제외된다.
- 총 선택된 항목의 개수를 아래 푸터에 표시한다.
- 항목들을 다중으로 관리하려면 `state를 배열`로 관리 할 수 있다.

```jsx
const [selectedIds, setSelectedIds] = useState([]);

function handleToggle(toggledId) {
  if (selectedIds.includes(toggledId)) {
    setSelectedIds(selectedIds.filter((id) => id !== toggledId));
  } else {
    setSelectedIds([...selectedIds, toggledId]);
  }
}
```

- 선택된 항목의 아이디 리스트를 배열로 가지는 state
- Letter 컴포넌트의 onChange 이벤트 핸들러를 통해 state를 변경해준다.

> 배열로의 구현 방법도 가능하지만, includes()를 통한 탐색은 배열이 커지면 성능 문제가 될 수 있다.  
> 배열 대신 state에 `Set`을 사용하여 `has()`를 통해 탐색이 가능하다.

```jsx
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const selectedCount = selectedIds.size;

  const handleToggle = (toggledId: number) => {
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  };
```

- ❗️ state 객체를 변경하면 안되는 것처럼 Set도 복사 후 업데이트를 하도록 하자.

```jsx
const nextIds = new Set(selectedIds);
```

<img src="https://velog.velcdn.com/images/sarang_daddy/post/b5aeeedd-3978-4ce3-b616-b28d3b5e5fc3/image.gif">

## Set 타입

```jsx
// prettier-ignore
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
```

## props로 전달된 함수 타입

```jsx
// 부모에서 함수 전달
<Letter onToggle={handleToggle}/>

// 자식 컴포넌트
interface LetterProps {
  onToggle: (toggledId: number) => void;
}

const Letter = ({ onToggle }: LetterProps) => {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          onChange={() => {
            onToggle(letter.id);
          }}
        />
      </label>
    </li>
  );
};
```
