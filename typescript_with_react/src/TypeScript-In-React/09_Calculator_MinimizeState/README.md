# Calculator에 필요한 상태를 최소화 해보자

## Step.1 시각적 상태 모아보기

```jsx
const [operation, setOperation] = React.useState('');
const [firstInputValue, setFirstInputValue] = React.useState(0);
const [secondInputValue, setSecondInputValue] = React.useState(0);
const [finalValue, setFinalValue] = React.useState(0);
const [isCalculated, setIsCalculated] = React.useState(false);
```

- 사용자가 선택하는 계산 방법
- 사용자가 입력하는 첫번째 숫자
- 사용자가 입력하는 두번째 숫자
- 두 숫자와 계산 방법으로 계산된 결과값
- 사용자가 계산 버튼을 클릭하면 결과값 호출

## Step.2 state로 관리되어야 하는지 판단하기

- 시간이 지나도 변하지 않는가? 그렇다면 state가 아니다.
- 부모로부터 props를 통해 전달는가? 그렇다면 state가 아나다.
- 컴포넌트의 기존 state 또는 props를 가지고 계산할 수 있는가? 그렇다면 state가 아니다.

```tsx
const [operation, setOperation] = React.useState('');
const [firstInputValue, setFirstInputValue] = React.useState(0);
const [secondInputValue, setSecondInputValue] = React.useState(0);
const [isCalculated, setIsCalculated] = React.useState(false);
```

> 결과값은 다른 state로 계산되는 값이므로 state로서 필요가 없다.

## Step.3 관련된 state들을 하나로 그룹화 하기

```tsx
const [userInputValues, setUserInputValues] = React.useState({
  operation: '',
  firstValue: 0,
  secondValue: 0,
});
const [isCalculated, setIsCalculated] = React.useState(false);
```

- 관련이 깊은 상태들을 객체로 관리해주면 하나의 상태로 관리가 가능하다.
- 상태 관리의 편의성은 좋아지지만, 객체를 복사함을 주의해야 한다.

![](https://velog.velcdn.com/images/sarang_daddy/post/b21f8976-e226-4792-acb5-29a07187b82f/image.gif)

---

## 추론된 타입

```tsx
interface UserInputValues {
  operation: string;
  firstValue: number;
  secondValue: number;
}

const [isCalculated, setIsCalculated] = useState<boolean>(false);

let result: number | string = '';

const onClick: () => void = () => {
  setIsCalculated(true);
};
```
