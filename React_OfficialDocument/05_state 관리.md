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
