## [Filtering a list](https://react-ko.dev/learn/sharing-state-between-components)

- SearchBar에서 텍스트를 입력한다.
- 입력된 텍스트를 포함하는 목록이 필터링 되도록 하고싶다.

```jsx
const [query, setQuery] = useState('');
const filteredItems = filterItems({ items: foods, query });
```

- 검색값 query를 상태로 가진다.
- 필터링 함수로 필터된 아이템 리스트를 가진다.

```jsx
return (
  <>
    <SearchBar query={query} onChange={handleChange} />
    <List items={filteredItems} />
  </>
);
```

- SearchBar 컴포넌트는 검색값 query를 받는다.
- List 컴포넌트는 필터링된 아이템 리스트를 뿌려준다.

```jsx
export const filterItems = ({ items, query }: FilterItemsProps) => {
  query = query.toLowerCase();

  return items.filter((item) => {
    return item.name.split(' ').some((word) => {
      return word.toLowerCase().startsWith(query);
    });
  });
};
```

- 필터링 함수는 전체 리스트와 사용자 입력값 query를 매개변수로 받는다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/17c8dd3d-f229-4485-baf1-746ca12ddaf0/image.gif">

## 복합 타입 정의

```jsx
interface Item {
  id: number;
  name: string;
  description: string;
}

interface ListProps {
  items: Item[];
}

interface FilterItemsProps {
  items: Item[];
  query: string;
}
```
