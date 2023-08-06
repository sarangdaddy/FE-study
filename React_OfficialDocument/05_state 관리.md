# state 관리

애플리케이션이 성장함에 따라 state를 구성하는 방법과 컴포넌트 간에 데이터가 흐르는 빙식에 "의도"를 주어야 한다.  
불필요하거나 중복된 state는 버그의 원인이 된다.

이번 장에서는 아래와 같은 state관리에 대해서 알아보자.

- state 변화에 따른 UI 변화를 생각하는 방법
- state를 잘 구조화하는 방법
- 컴포넌트 간에 state를 공유할 수 있도록 “끌어올리는” 방법
- state의 보존 또는 재설정 여부를 제어하는 방법
- 복잡한 state 로직을 함수에 통합하는 방법
- “prop 드릴링” 없이 정보를 전달하는 방법
- 앱이 성장함에 따라 state 관리를 확장하는 방법

# state로 입력에 반응하기

- React는 UI를 조작하는 선언적인 방법을 제공한다.
- UI를 개별적으로 직접 조작하는 대신 `컴포넌트가 있을 수 있는 다향한 상태`를 기술하고 사용자 입력에 반응하여 상태들 사이를 전환한다.

## 선언형 UI와 명령형 UI의 차이점

사용자가 답변을 제출할 수 있는 양식을 예로 생각해 보자.

- 폼에 무언가를 입력하면 “Submit” 버튼이 활성화될 것입니다.
- “제출” 버튼을 누르면 폼과 버튼이 비활성화 되고 스피너가 나타날 것입니다.
- 네트워크 요청이 성공한다면 form은 숨겨질 것이고 “Thank you”메세지가 나타날 것입니다.
- 네트워크 요청이 실패한다면 오류 메세지가 보일 것이고 form은 다시 활성화 될 것입니다.

> `명령형 프로그래밍`에서는 위 내용에서 일어난 일에 따라 `UI를 조작`하기 위한 지침을 주어야 한다.

```jsx
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = "none";
}

function show(el) {
  el.style.display = "";
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == "istanbul") {
        resolve();
      } else {
        reject(new Error("Good guess but a wrong answer. Try again!"));
      }
    }, 1500);
  });
}

let form = document.getElementById("form");
let textarea = document.getElementById("textarea");
let button = document.getElementById("button");
let loadingMessage = document.getElementById("loading");
let errorMessage = document.getElementById("error");
let successMessage = document.getElementById("success");
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

- UI를 직접 조작하는 것은 시스템이 복잡해지면서 관리하기가 어려워진다.
- 새로운 UI요소나 인터렉션을 추가하려면 기존의 모든 코드를 주의 깊게 살펴야 한다.

> React에서는 직접 UI를 조작하지 않는다.

- 표시할 내용을 선언하면 React가 UI를 스스로 업데이트 한다.
- "이렇게 저렇게 해서 어디로 가세요" 가 아닌 "어디로 가주세요"로 명령이 가능하다.

## UI를 선언적인 방식으로 생각하기

그렇다면 `선언적인 명령`은 어떻게 생각해야 할까?

### Step 1 : 컴포넌트의 다양한 시각적 상태 식별하기

`시각적인 상태`에 대한 고민이 필요하다.  
먼저 사용자에게 표시될 수 있는 UI의 다양한 "상태"를 모두 시각화 한다.

- 비어있음: form의 “Submit”버튼은 비활성화되어 있습니다.
- 입력중: form의 “Submit”버튼이 활성화되어 있습니다.
- 제출중: form은 완전히 비활성화되어있고 Spinner가 표시됩니다.
- 성공시: form 대신 “Thank you”메세지가 표시됩니다.
- 실패시: ‘입력중’ 상태와 동일하지만 추가로 오류 메세지가 표시됩니다.

다음은 로직을 추가하기 전에 상태에 대한 "mock up"을 만든다.

```jsx
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = "empty",
}) {
  if (status === "success") {
    return <h1>That's right!</h1>;
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={status === "submitting"} />
        <br />
        <button disabled={status === "empty" || status === "submitting"}>
          Submit
        </button>
        {status === "error" && (
          <p className="Error">Good guess but a wrong answer. Try again!</p>
        )}
      </form>
    </>
  );
}
```

- form의 시각적인 부분만을 위한 목업이다.
- 이 목업은 기본값이 'empty'인 status 라는 `prop으로 제어`된다.

> 컴포넌트에 시각적 상태가 많은 경우 한 페이지에 모두 표시하는 방법이 있다.

```jsx
import Form from "./Form.js";

let statuses = ["empty", "typing", "submitting", "success", "error"];

export default function App() {
  return (
    <>
      {statuses.map((status) => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

- 이런 페이지를 보통 'living styleguide` `storybook` 이라 한다.

### Step 2 : 상태 변경을 촉발하는 요인 파악하기

상태 변경을 촉발하는 요인으로는 두 가지가 있다.  
두 가지 모두 state 변수를 설정해야 UI를 업데이트 할 수 있다.

- 사람의 입력 : 버튼 클릭, 필드 입력, 링크 이공 등
- 컴퓨터의 입력 : 네트워크에서 응답 도착, 시간 초과, 이미지 로딩 등

  - text 입력을 변경(사람)하면 text box가 비어있는지 여부에 따라 비어있음 state에서 입력중 state로, 또는 그 반대로 전환해야합니다.
  - 제출 버튼을 클릭(사람)하면 제출중 state로 전환해야합니다.
  - 네트워크 응답 성공(컴퓨터)시 성공 state로 전환해야 합니다.
  - 네트워크 요청 실패(컴퓨터)시 일치하는 오류 메세지와 함께 오류 state로 전환해야 합니다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/d88da415-ca68-4138-a036-c910bdfe09c6/image.png" width="50%">

### Step 3 : 메모리의 상태를 useState로 표현하기

다음으로 메모리에서 컴포넌트의 시작적 상태를 `useState`로 표현한다.  
각 상태는 "움직이는 조각"이며 가능한 적은 수의 "움직이는 조각"을 만든다.

```jsx
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null);
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

### Step 4 : 비필수적인 state 변수 제거하기

state는 적을 수록 좋기 때문에 필요없는 state를 생각해본다.

- state가 모순을 야기하는가?  
  isTyping 과 isSubmitting은 동시에 true일 수 없습니다. 이러한 모순은 일반적으로 state가 충분히 제약되지 않았음을 의미합니다.  
  두 boolean의 조합은 네 가지가 가능하지만 유효한 state는 세 가지뿐입니다.  
  “불가능한” state를 제거하려면 세 가지 값을 하나의 status로 결합하면 됩니다: 'typing', 'submitting', 'success'.
- 다른 state 변수에 이미 같은정보가 있는가?  
  isEmpty와 isTyping은 동시에 true가 될 수 없습니다. 이를 각 state 변수로 분리하면 동기화되지 않아 버그가 발생할 위험이 있습니다.  
  다행히 isEmpty를 제거하고 대신 answer.length === 0으로 확인할 수 있습니다.
- 다른 state 변수를 뒤집으면 동일한 정보를 얻을 수 있는가?  
  isError는 error !== null을 대신 확인할 수 있기 때문에 필요하지 않습니다.

```jsx
const [answer, setAnswer] = useState("");
const [error, setError] = useState(null);
const [status, setStatus] = useState("typing"); // 'typing', 'submitting', or 'success'
```

### Step 5 : 이벤트 핸들러를 연결하여 state 설정하기

마지막으로 state 변수를 설정하는 이벤트 핸들러를 생성한다.

```jsx
import { useState } from "react";

export default function Form() {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("typing");

  if (status === "success") {
    return <h1>That's right!</h1>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitForm(answer);
      setStatus("success");
    } catch (err) {
      setStatus("typing");
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === "submitting"}
        />
        <br />
        <button disabled={answer.length === 0 || status === "submitting"}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== "lima";
      if (shouldError) {
        reject(new Error("Good guess but a wrong answer. Try again!"));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

- 명령형 UI 보다 길지만 덜 취약하다.
- 모든 상호작용을 state 변화로 표현하면 새로운 시각적 상태를 도입할 수 있다.
- 인터렉션 자체의 로직을 변경하지 않고도 각 state에 표시되어야 하는 항목을 변경할 수 있다.

# state 구조 선택

state를 잘 구조화하면 수정과 디버깅이 편한 컴포넌트와 버그가 끊임업이 발생하는 컴포넌트의 차이를 만들 수 있다.

## state 구조화 원칙

state를 보유하는 컴포넌트를 작성할 때 얼마나 많은 state 변수를 사용할지, 데이터의 모양은 어떻게 할지 아래 원칙을 고려해보자.

- 관련 state를 그룹화한다. 항상 두 개 이상의 state 변수를 동시에 업데이트하는 경우 단일 state 변수로 병합하는 것이 좋다.
- state의 모순을 피한다. 여러 state 조각이 서로 모순되거나 ‘불일치’할 수 있는 방식으로 state를 구성하면 실수가 발생 한다.
- 불필요한 state를 피한다. 렌더링 중에 컴포넌트의 props나 기존 `state 변수에서 일부 정보를 계산`할 수 있다면 해당 정보를 해당 컴포넌트의 state에 넣지 않아야 한다.
- state 중복을 피한다. 동일한 데이터가 여러 state 변수 간에 또는 중첩된 객체 내에 중복되면 동기화 state를 유지하기가 어렵다.
- 깊게 중첩된 state는 피한다. 깊게 계층화된 state는 업데이트하기 쉽지 않다. 가능하면 state를 평평한 방식으로 구성하는 것이 좋다.

## 관련 state 그룹화 하기

```jsx
// 1
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// 2
const [position, setPosition] = useState({ x: 0, y: 0 });
```

- 두 가지 모두 사용이 가능하다.
- 다만, 두 개의 state 변수가 항상 함께 변경된다면, 하나의 state로 통합하는 것이 좋다.
- 또한, 필요한 state의 조각 수를 모를때는 객체나 배열로 그룹화 하는 것이 유용하다.

## state 모순 피하기

```jsx
import { useState } from "react";

export default function FeedbackForm() {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}
```

- 위 예제에서는 불가능한 state 설정을 허용하고 있다.
- `setIsSent`와 `setIsSending` 중 어느 하나만 호출해도 isSending과 isSent가 동시에 true가 발생할 수 있다.
- 동시에 true가 되는 경우를 제외하면 4가지의 경우의 수 중 3가지가 된다.
- 이를 하나의 state 변수로 대체하는 것이 좋다.
- `status` : typing, sending, sent

```jsx
import { useState } from "react";

export default function FeedbackForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("typing");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    await sendMessage(text);
    setStatus("sent");
  }

  const isSending = status === "sending";
  const isSent = status === "sent";

  if (isSent) {
    return <h1>Thanks for feedback!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button disabled={isSending} type="submit">
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Pretend to send a message.
function sendMessage(text) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}
```

## 불필요한 state 피하기

렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있는 경우 state가 되면 안된다.

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }
```

- fullName은 렌더링 중에 lastName과 firstName으로 계산이 가능하다. -> state에서 제거한다.

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");

const fullName = firstName + " " + lastName;
```

### props를 state에 그대로 미러링 하면 안된다

```jsx
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

- messageColor은 state의 초기값이 된다.
- 하지만, 부모 컴포넌트에서 messageColor이 변경되더라고 Message에서는 변경이 안된다.

```jsx
function Message({ messageColor }) {
  const color = messageColor;
```

- prop를 변수로 할당하여 사용하는 방법으로 변경한다.

> props를 state로 '미러링' 하는 것은 특정 prop에 대한 모든 업데이트를 무시하는 경우만 의미가 있다.

```jsx
function Message({ initialColor }) {
  // The `color` state variable holds the *first* value of `initialColor`.
  // Further changes to the `initialColor` prop are ignored.
  const [color, setColor] = useState(initialColor);
```

## state 중복을 피하라

```jsx
import { useState } from "react";

const initialItems = [
  { title: "pretzels", id: 0 },
  { title: "crispy seaweed", id: 1 },
  { title: "granola bar", id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(items[0]);

  function handleItemChange(id, e) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={(e) => {
                handleItemChange(item.id, e);
              }}
            />{" "}
            <button
              onClick={() => {
                setSelectedItem(item);
              }}
            >
              Choose
            </button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

- 위 예제는 items와 selectedItem의 state가 중복되어있다.
- 같은 state가 한 화면에서 다른 값을 가지게 될수 있다.

```jsx
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(0);

const selectedItem = items.find((item) => item.id === selectedId);
```

- selectedItem은 items와 selectedId로 계산 가능하다.

## 깊게 중첩된 state는 피한다

state가 너무 깊게 중첩되어 업데이트 하기 어려운 경우 'flat'하게 만드는 것을 고려한다.

아래처럼 여러 객체가 중첩된 항목이 있다고 생각해보자.

```jsx
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
```

- Egypt를 삭제하고 싶다면, root까지 복사하고 Egypt만 삭제해야한다.
- 변경마다 최상위 부터 복사를 해서 적용하기에는 코드가 장황할 수 있다.

```jsx
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 27, 35]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  },
```

- 상위 객체가 가지고 있는 하위 객체들을 배열로 id만 가지게 변경할 수 있다.
- 이제 전체 데이터는 'flat' 해졌기에 업데이트가 쉬워진다.

```jsx
import { useState } from "react";
import { initialTravelPlan } from "./places.js";

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Create a new version of the parent place
    // that doesn't include this child ID.
    const nextParent = {
      ...parent,
      childIds: parent.childIds.filter((id) => id !== childId),
    };
    // Update the root state object...
    setPlan({
      ...plan,
      // ...so that it has the updated parent.
      [parentId]: nextParent,
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map((id) => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button
        onClick={() => {
          onComplete(parentId, id);
        }}
      >
        Complete
      </button>
      {childIds.length > 0 && (
        <ol>
          {childIds.map((childId) => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      )}
    </li>
  );
}
```

# 컴포넌트 간의 state 공유

두 컴포넌트의 state가 항상 함께 변경되기를 원할 때가 있다.  
그럴때는 두 컴포넌트에서 state를 제거하고 가까운 부모로 이동한 다음 props를 통해 전달한다.  
이를 state 끌어올리기하고 한다.

## 예제로 알아보는 state 끌어올리기

- Accordion (부모 컴포넌트)가 두 개의 Panel(자식 컴포넌트)를 렌더링한다고 생각해보자.
- 각 Panel 컴포넌트는 표시 여부를 결정하는 불리언 타입 isActive state를 가진다.

```jsx
import { useState } from "react";

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>Show</button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

- 자식 Panel은 각자의 state로 반응하기에 서로에게 영향을 주지 않는다.

> 하지만, 서로의 상태를 공유하고 하나의 Panel이 열리면 다른 Panel이 닫히게 하고 싶으면 어떻게 해야할까?  
> 여기서 `state 끌어올리기`가 필요하다.

### Step 1. 자식 컴포넌트에서 state 제거

- 부모 컴포넌트에 Panel의 isActive를 제어할 수 있는 권한을 준다.
- 부모 컴포넌트에서 자식이 가질 상태를 props로 전달한다.
- Panel은 부모 컴포넌트로부터 받은 상태를 가지고 보여준다.

### Step 2. 공통 부모에 하드 코딩된 데이터 전달하기

```jsx
// 부모 컴포넌트
export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

### Step 3. 공통 부모에 state 추가

- 부모 컴포넌트는 특정 상황에 자식들에게 주는 상태를 변경할 수 있어야한다.
- 특정 상황을 판단하는 state를 부모 컴포넌트에게 만들어준다.
- 0인 경우 0번 Panel의 상태값을 변경 (특정상황)
- 1인 경우 1번 Panel의 상태값을 변경 (특정상황)

```jsx
const [activeIndex, setActiveIndex] = useState(0);
```

- 특정상황은 자식 컴포넌트에서 알려주어야 한다.
- 상태를 변경하는 제어권은 부모에게 있지만 특정 상황의 유무를 자식에서 발생한다.
- 자식에게 상태를 변경하는 이벤트 핸들러를 prop으로 전달해서 알려주도록 한다.

```jsx
<>
  <Panel isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
    ...
  </Panel>
  <Panel isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
    ...
  </Panel>
</>
```

> state 끌어올리기를 콩해 state를 공통 부모 컴포넌트에서 조정할 수 있게 된다.  
> 자식은 부모로 부터 보여줘야하는 상태를 전달 받고 그 상태 변경을 이벤트 핸들러를 통해 부모에게 알려준다.  
> 즉, 자식이 부모의 state를 변경할 수 있다.

### 비제어 컴포넌트 vs 제어 컴포넌트

- 위 예제의 부모 컴포넌트처럼 로컬 state를 가진 컴포넌트를 `비제어 컴포넌트`라고 부른다.
- 반대로 자식 컴포넌트처럼 컴포넌트의 중요한 정보가 로컬 state가 아닌 props에 의해 구동되는 경우 `제어 컴포넌트`라고 부른다.

### 각 state의 단일 진실 공급원(SSOT)

- state는 여러 위치에 존재한다.
- 각 고유한 state들에 대해 해당 state를 소유하는 컴포넌트를 선택하게 된다.
- 모든 state가 한 곳에 있는것이 아니라 각 state마다 해당 정보를 소유하는 특정 컴포넌트가 있다는 뜻이다.
- 컴포넌트 간에 공유하는 state를 복제하는 대신 공통으로 공유하는 부모로 끌어올려서 자식에게 전달한다.
- 즉, 앱은 작업하면서 각 state의 위치를 파악하는 동안 state를 아래로 이동하거나 백업하는 것이다.

# state 보존 및 재설정

- state는 컴포넌트 간에 격리된다.
- React는 UI트리에서 어떤 컴포넌트가 어떤 state에 속하는지를 추적한다.
- state를 언제 보존하고 언제 초기화할지를 제어할 수 있다.

## UI 트리

- 브라우저는 UI를 모델링하기 위해 DOM(HTML), CSSOM(CSS), 접근성 트리를 사용한다.
- React 또한 크리 구조를 사용하여 UI를 모댈링하고 관리한다.
- React는 JSX로부터 UI트리를 만들고, React DOM은 해당 UI트리와 일치하도록 브라우저 DOM을 업데이트 한다.

## state는 트리의 한 위치에 묶인다.

- 컴포넌트에 state를 부여할 때, state가 컴포넌트 내부에 "존재"하는 것이 아닌 "유지" 된다.
- React는 UI 트리에서 해당 컴포넌트가 어디에 위치하는지에 따라 보유하고 있는 각 state를 올바른 컴포넌트와 연결한다.

```jsx
import { useState } from "react";

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
```

- 위 예제에서 <Counter> 컴포넌트는 JSX 태그가 하나지만 두 개의 다른 위치에서 렌더링 된다.
- <Counter> 컴포넌트에서 사용된 state 또한 각 컴포넌트에 분리되어 유지 된다.
- **즉, 각 컴포넌트는 독립적인 score, hover state를 갖게 된다.**

> 각 컴포넌트의 state는 `UI트리의 해당 위치`에서 렌더링이 유지되는한 고유의 state를 유지한다.  
> 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링 되면 state를 삭제한다.

## 동일한 위치의 동일한 컴포넌트는 state를 유지한다.

```jsx
import { useState } from "react";

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? <Counter isFancy={true} /> : <Counter isFancy={false} />}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={(e) => {
            setIsFancy(e.target.checked);
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = "counter";
  if (hover) {
    className += " hover";
  }
  if (isFancy) {
    className += " fancy";
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>Add one</button>
    </div>
  );
}
```

- 위 예제에서 두 개의 <Counter> 태그가 존재하지만 UI 트리에서 같은 위치에 존재한다.
- 때문에 isFancy로 렌더링 <Counter>가 변해도 div의 첫 번째 자식으로 존재한다.
- 이런 경우에는 state값이 유지된다.

### 함정 ❗️

> React에서는 JSX 마크업이 아니라 UI 트리에서의 위치가 중요하다!

- JSX 태그에서 조건에 따라 동일 컴포넌트가 제거되고 다시 생성되어도 같은 위치에 렌더링된다면 state는 유지된다.
- React는 함수에서 조던을 어디에 배치했는지 알지 못한다. 반환하는 트리만 볼 수 있을 뿐이다.

이런 함점에 빠진 예시가 있는지 ❓

## 동일한 위치의 다른 컴포넌트는 state를 초기화 한다.

```jsx
{
  isPaused ? <p>See you later!</p> : <Counter />;
}
```

- 위 예제 처럼 조건에 따라 같은 위치라도 `다른` 컴포넌트가 렌더링된다면 state는 초기화 된다.

```jsx
{
  isFancy ? (
    <div>
      <Counter isFancy={true} />
    </div>
  ) : (
    <section>
      <Counter isFancy={false} />
    </section>
  );
}
```

- 동일 컴포넌트라도 부모 태그가 다르면 `다른` 컴포넌트로 인식하고 state는 초기화 된다.

> 리렌더링 사이에 state를 유지하려면 트리의 구조가 `일치` 해야 한다.  
> 그렇기 때문에 컴포넌트 함수 정의를 중첩해서는 안된다.

## 동일한 위치에서 state 재설정하기

```jsx
{
  isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />;
}
```

- 위에서 확인한 것 처럼 React는 동일한 위치의 컴포넌트 state는 유지한다.
- 만약 동일한 위치의 컴포넌트의 state를 재설정 하고 싶으면 어떻게 할까?

### Option 1. 컴포넌트를 다른 위치에 렌더링하기

```jsx
{
  isPlayerA && <Counter person="Taylor" />;
}
{
  !isPlayerA && <Counter person="Sarah" />;
}
```

- 각 Counter의 state는 DOM에서 제거될 때마다 소멸된다.

### Option 2. key로 state 재설정하기

```jsx
{
  isPlayerA ? (
    <Counter key="Taylor" person="Taylor" />
  ) : (
    <Counter key="Sarah" person="Sarah" />
  );
}
```

- 목록을 렌더링 할때 key를 사용했는데, key는 목록에만 사용되는 것이 아니다.
- key를 사용해 React가 컴포넌트를 구분하도록 할 수 있다.
- key를 사용하면 부모 내의 순서로 위치를 판단하던 React에게 위치가 아닌 key로 구분하게 할 수 있다.

### 키로 form 재설정하기

- key로 state를 재설하는 것은 form을 다룰 때 유용하다.

```jsx
import { useState } from "react";
import Chat from "./Chat.js";
import ContactList from "./ContactList.js";

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  );
}

const contacts = [
  { id: 0, name: "Taylor", email: "taylor@mail.com" },
  { id: 1, name: "Alice", email: "alice@mail.com" },
  { id: 2, name: "Bob", email: "bob@mail.com" },
];
```

- 위 예제에서 <Chat>은 동일한 위치에 존재하기 때문에 부모 state `to`가 바뀌어도 내부 state 값은 유지된다.
- 사용자의 입장에서 변경이 되는 것이 좋을 수 있다.

```jsx
import { useState } from "react";
import Chat from "./Chat.js";
import ContactList from "./ContactList.js";

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  );
}
```

- 위 예제처럼 <Chat>에게 key값을 부여하면 동일 위치라도 내부 state값이 초기화 된다.

### 제거된 컴포넌트에 대한 state 보존

컴포넌트는 제거되었지만, 제거되기 전에 가지고 있던 state를 (입력 내용의 복구 등) 재사용하고 싶은 경우가 있다.

- 부모 컴포넌트에게 state를 끌어올려서 보관한다.
- localStorage등 React state 외의 방법을 사용한다.

# state 로직을 reducer로 추출하기

`여러 개의 state 업데이트`가 `여러 이벤트 핸들어`에 `분산`되어 있는 컴포넌트는 과부하가 걸릴 수 있다.  
이러한 경우, `reducer`라고 하는 단일 함수를 통해 컴포넌트 외부의 모든 state 업데이트 로직을 `통합`할 수 있다.

이번 학습을 통해 아래 내용을 알아보자.

- reducer 함수란 무엇인가
- useState를 useReducer로 리팩토링 하는 방법
- reducer를 사용해야 하는 경우
- reducer를 잘 작성하는 방법

## reducer로 state 로직 통합하기

컴포넌트가 복잡해지면 컴포넌트의 state가 업데이트되는 다양한 경우를 한번에 파악하기 어렵다.

```jsx
import { useState } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];
```

- TaskApp 컴포넌트는 state에 tasks 배열을 보유한다.
- 세 가지의 이벤트 핸들러는 task를 추가, 제거, 수정 한다.
- 각 이벤트 핸들러는 state 업데이트를 위해 setTasks를 호출한다.

> 컴포넌트가 커질수록 state를 변경하는 로직도 늘어난다.  
> 이러한 `모든 로직을 한곳에 모으기` 위해 외부의 `reducer라고 하는 단일 함수`로 옯길 수 있다.

### Reducer는 state를 관리하는 다른 방법이다.

1. state를 설정하는 것에서 action들을 전달하는 것으로 변경하기
2. reducer 함수 작성하기
3. 컴포넌트에서 reducer 사용하기

### Step 1. : state 설정을 action들의 전달로 바꾸기

- 모든 state 설정 로직을 제거한다.
- 이벤트 핸들러만 남긴다.
  - 사용자가 “Add”를 누르면 handleAddTask(text)가 호출된다.
  - 사용자가 task를 토글하거나 “Save”를 누르면 handleChangeTask (task)가 호출된다.
  - 사용자가 “Delete”를 누르면 handleDeleteTask(taskId)가 호출된다.

> reducer를 사용한 state 관리는 state를 직접 설정하는 것이 아니다.  
> 이벤트 핸들어에서 `action`을 전달하여 `사용자가 방금 한 일`을 지정한다.

- state 업데이트 로직은 이벤트 핸들러가 아닌 다른 곳에 존재한다.
- 이벤트 핸들러는 `tasks를 설정해`가 아닌 `task를 추가/변경/삭제 해`라는 `action`을 전달한다.

```jsx
// 변경된 이벤트 핸들러 로직
function handleAddTask(text) {
  dispatch({
    type: "added",
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: "changed",
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: "deleted",
    id: taskId,
  });
}
```

> dispatch 함수에 넣어둔 객체가 action이다.  
> 여기에는 무슨 일이 일어났는지에 대한 최소한의 정보를 포함한다.

### Step 2. : reducer 함수 작성하기

- reducer 함수에 state 로직을 포함한다.
- reducer 함수는 두 개의 매개변수를 가지는데, 하나는 `현재 state`이고 다른 하나는 `action 객체`다.
- reducer 함수의 반홥값이 다음 state가 된다.

```jsx
function yourReducer(state, action) {
  // return next state for React to set
}
```

- 이벤트 핸들어에 있던 state 설정 로직을 reducer 함수로 옮긴다.
  - 현재의 state(tasks)를 첫 번째 매개변수로 선언한다.
  - action 객체를 두 번째 매개변수로 선언한다.
  - 다음 state를 reducer함수에서 반환한다.

```jsx
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
```

> reducer 함수는 state(tasks)를 매개변수로 갖기 때문에 `컴포넌트 밖에서 reducer 함수를 선언`할 수 있다.

### Step 3. : 컴포넌트에서 reducer 사용하기

- 마지막으로 컴포넌트에 tasksReducer를 연결한다.

```jsx
import { useReducer } from "react";

// 기존 useState 코드
const [tasks, setTasks] = useState(initialTasks);

// reducer로 변경괸 코드
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

- useReducer Hook은 두 개의 인자를 받는다.

  - reducer 함수
  - 초기 state

- useReduce는 아래 내용을 반환한다.

  - state값
  - dispatch 함수

```jsx
import { useReducer } from "react";
import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: "added",
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: "changed",
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: "deleted",
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: "Visit Kafka Museum", done: true },
  { id: 1, text: "Watch a puppet show", done: false },
  { id: 2, text: "Lennon Wall pic", done: false },
];
```

> 이벤트 핸들러는 action을 전달하여 무슨 일이 있어났는지만 지정한다.  
> reducer 함수는 action에 대한 응답으로 state가 어떻게 변경되는지 결정한다.

### useState vs useReducer

- 코드 크기: 일반적으로 useState를 사용하면 미리 작성해야 하는 코드가 줄어듭니다. useReducer를 사용하면 reducer 함수 와 action을 전달하는 부분 모두 작성해야 합니다. 하지만 **많은 이벤트 핸들러가 비슷한 방식으로 state를 업데이트하는 경우** useReducer를 사용하면 코드를 줄이는 데 도움이 될 수 있습니다.

- 가독성: useState로 간단한 state를 업데이트 하는 경우 가독성이 좋습니다. 그렇지만 state의 구조가 더욱 복잡해지면, 컴포넌트의 코드의 양이 부풀어 오르고 한눈에 읽기 어려워질 수 있습니다. 이 경우 **useReducer를 사용하면 업데이트 로직이 어떻게 동작 하는지와 이벤트 핸들러를 통해 무엇이 일어났는지 를 깔끔하게 분리**할 수 있습니다.

- 디버깅: useState에 버그가 있는 경우, state가 어디서 잘못 설정되었는지, 그리고 왜 그런지 알기 어려울 수 있습니다. useReducer를 사용하면, **reducer에 콘솔 로그를 추가하여 모든 state 업데이트와 왜 (어떤 action으로 인해) 버그가 발생했는지 확인할 수 있습니다.** 각 action이 정확하다면, 버그가 reducer 로직 자체에 있다는 것을 알 수 있습니다. 하지만 useState를 사용할 때보다 더 많은 코드를 살펴봐야 합니다.

- 테스팅: **reducer는 컴포넌트에 의존하지 않는 순수한 함수**입니다. 즉, 별도로 분리해서 내보내거나 테스트할 수 있습니다. 일반적으로 보다 현실적인 환경에서 컴포넌트를 테스트하는 것이 가장 좋지만, 복잡한 state 업데이트 로직의 경우 reducer가 특정 초기 state와 action에 대해 특정 state를 반환한다고 단언하는 것이 유용할 수 있습니다.

- 개인 취향: 어떤 사람은 reducer를 좋아하고 어떤 사람은 싫어합니다. 괜찮습니다. 취향의 문제니까요. useState 와 useReducer는 언제든지 앞뒤로 변환할 수 있으며, 서로 동등합니다!

> 일부 컴포넌트에서 잘못된 state 업데이트로 인해 버그가 자주 발생하고 더 많은 구조가 필요하다면 reducer를 사용하자.

### reducer 작성 팁

- reducer는 반드시 순수해야 한다.
- action에는 여러 데이터가 변경되더라고 하나의 사용자 상호작용을 설명해야 한다.

#### dispatch

- state 개념에서는 설정자함수와 같다.
- action 이라고 하는 객체를 `전달`하는 역할

#### action

- `type`이라고 하는, reducer에서 분기 처리를 할 때 필요한 문자열정보를 포함한다.
- reducer에서 해당 명령 수행에 필요한 추가정보들을 담은 일반 객체다.

#### reducer

- action.type에 따라 분기를 나눈다.
- action 객체에 담겨이는 여러 정보를 활용해서 새로운 state를 반환한다.
- 순수함수

# context로 데이터 깊숙이 전달하기

React는 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 props를 전달한다.  
하지만, 중간에 여러 컴포넌트를 거쳐야 한다면 props를 장황하고 불편하게 전달해야한다.  
context는 부모 컴포넌트에서 명시적으로 props를 전달하지 않고도 아래 트리의 컴포넌트에서 사용가능하다.

## prop drilling

트리 깊숙이 prop를 전달해야 한다면 prop를 필요로하는 자식 컴포넌트가 부모와 멀리 떨어지게 된다.

## Context:props 전달의 대안

context는 멀리 떨어져 있는 상위 트리라도 그 안에 있는 전체 트리에 일부 데이터를 제공할 수 있다.

<img src="https://velog.velcdn.com/images/sarang_daddy/post/54d95c99-d3ec-417c-99fe-3a418191b3d6/image.png" width="50%">

## Step 1. : Context 만들기

```jsx
import { createContext } from "react";

export const LevelContext = createContext(1);
```

## Step 2. : context 사용하기

```jsx
import { useContext } from "react";
import { LevelContext } from "./LevelContext.js";

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

## Step 3. : context 제공하기

```jsx
import { LevelContext } from "./LevelContext.js";

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>{children}</LevelContext.Provider>
    </section>
  );
}
```

- `<Section>` 안에 있는 컴포넌트가 LevelContext를 요청하면 이 level을 제공하라.”고 지시한다.
- 컴포넌트는 그 위에 있는 UI 트리에서 가장 가까운 `<LevelContext.Provider>`의 값을 사용한다.
