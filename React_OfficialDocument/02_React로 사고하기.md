# React로 사고하기

1. 사용자 인터페이스를 컴포넌트라는 조작으로 나눈다.
2. 각 컴포넌트의 다양한 시각적 상태들을 정의한다.
3. 컴포넌트들을 연결하여 데이터가 그 사이를 흘러가게 한다.

# React로 검색할 수 있는 상품 테이블을 만들어보자

## 1. UI를 컴포넌트 계층으로 쪼개기

배경에 따라 디자인을 컴포넌트로 나누는 방법에 대한 관점이 달라질 수 있다.

- Programming  
  : 새로운 함수나 객체를 만드는 방식과 같은 방법  
  이 중 `단일책임 원칙`을 반영하고자 한다면 컴포넌트는 이상적으로는 한 번에 한 가지 일만 해야 한다.  
  만약 컴포넌트가 점점 커진다면 작은 하위 컴포넌트로 쪼개져야 한다.
- CSS  
  : class 선택자를 무엇으로 만들지 생각해 봅시다. (실제 컴포넌트들은 약간 좀 더 세분되어 있습니다.)
- Design  
  : 디자인 계층을 어떤 식으로 구성할 지 생각해 봅시다.

<img src=https://velog.velcdn.com/images/sarang_daddy/post/b5c2270f-5fac-4bb2-a3f5-f40aa2230211/image.png width="50%">

</br>

- FilterableProductTable
  - SearchBar
  - ProductTable
    - ProductCategoryRow
    - ProductRow

## 2. React호 정적인 버번을 먼저 구현하기

앱을 만들 때 계층 구조에 따라 상층부에 있는 컴포넌트부터 `하향식(top-down)`으로 만들거나  
하층부에 있는 컴포넌트부터 `상향식(bottom-up)`으로 만들 수 있다.  
간단한 예시에서는 하향식이 쉽지만, 프로젝트가 커지면 상향식으로 만들고 테스트를 작성하면서 개발하는 방식이 쉽다.

```jsx
// 상향식 예제

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

- 2단계까지는 state를 사용하지말고 정적인 뷰에만 집중하자.

## 3. 최소한의 데이터만 이용해서 완벽하게 UI state 표현하기

UI를 `상호작용(interactive)`하게 만들려면 사용자가 기반 데이터 모델을 변경할 수 있게 해야 한다.  
React는 `state`를 통해 기반 데이터 모델을 변경할 수 있게 한다.

> state는 앱이 기억해야 하는, 변경할 수 있는 데이터의 최소 집합이다.  
> 특히 state구조화에는 `중복배제원칙`을 지켜야 한다.  
> 앱이 필요로 하는 가장 최소한의 state를 파악해야 한다.

### ❗️ state를 결정하는 포인트

- **시간이 지나도 변하지 않는가?** → state가 아니다.
- **부모로부터 props를 통해 전달** 되었는가? → state가 아니다.
- 컴포넌트 내의 다른 state나 props로 **계산이 되는가?** → state가 아니다.

### Props vs State

React는 props와 state라는 두 개의 데이터 "모델"이 존재한다.

#### Props

- 함수를 통해 전달되는 인자 같은 성격을 가진다.
- 부모로부터 데이터를 받아서 외관을 커스터마이징 한다.

#### State

- 컴포넌트의 메모리 같은 성격을 가진다.
- 컴포넌트가 정보를 계속 따라가고 변화하면 상호작용 하도록 해준다.

> state는 보통 부모 컴포넌트에 저장한다. (부모 컴포넌트는 state를 변경할 수 있다.)  
> 부모 컴포넌트는 state를 자식에서 props로 전달한다.  
> 자식 컴포넌트는 props를 통해 받은 state로 외관을 꾸민다.

## 4. State가 어디에 있어야 할 지 정하기

앱에서 최소한으로 필요한 state를 결정했으면 **어떤 컴포넌트가 이 state를 소유하고, 변경할지** 정해야 한다.

1. 해당 state를 기반으로 렌더링하는 모든 컴포넌트를 찾는다.
2. 그들의 가장 가까운 공통 부모 컴포넌트를 찾는다. (계층에서 모두를 포괄하는 상위 컴포넌트)
3. state가 어디에 위치 돼야 하는지 결정한다.

- 보통, 공통 부모가 state를 가진다.
- 공통 부모의 상위 컴포넌트가 가져도 된다.
- **적절한 부모 컴포넌트가 없다면, state를 소유할 컴포넌트를 새로 만들어 준다.**

```jsx
import { useState } from "react";

// 부모 컴포넌트에서 state 관리
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

// 자식 컴포넌트에게 props로 전달
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input type="text" value={filterText} placeholder="Search..." />
      <label>
        <input type="checkbox" checked={inStockOnly} /> Only show products in
        stock
      </label>
    </form>
  );
}
```

## 5. 역 데이터 흐름 추가하기

사용자의 입력에 따라 state를 변경하려면 반대 방향의 데이터 흐름을 만들어야 한다.  
즉, 자식 컴포넌트가 부모 컴포넌트의 state를 업데이트 해줘야 한다.

Q : `ProductTable`, `SearchBar`가 `FilterableProductTable`의 state를 업데이트 해야한다.  
A : `FilterableProductTable`가 가지고 있는 `setFilterText`와 `setInStockOnly`를 호출한다.

```jsx
// 자식에게 state를 변경하는 setFilterText, setInStockOnly를 props로 전달
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

```jsx
// 자식 컴포넌트 SearchBar에서 onChange 이벤트 핸들러로 부모 state를 변경한다.
<input
  type="text"
  value={filterText}
  placeholder="Search..."
  onChange={(e) => onFilterTextChange(e.target.value)}
/>
```

## 완성된 코드

```jsx
import { useState } from "react";

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```
