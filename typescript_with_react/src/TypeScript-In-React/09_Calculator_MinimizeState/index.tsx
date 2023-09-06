import { useState } from 'react';

export const Calculator = () => {
  const [userInputValues, setUserInputValues] = useState({
    operation: '',
    firstValue: 0,
    secondValue: 0,
  });
  const [isCalculated, setIsCalculated] = useState(false);

  let result;

  if (isCalculated) {
    const first = userInputValues.firstValue;
    const second = userInputValues.secondValue;
    switch (userInputValues.operation) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '/':
        result = first / second;
        break;
      case '*':
        result = first * second;
        break;
      default:
        result = '연산을 선택하고 숫자를 입력해주세요';
    }
  }

  const onClick = () => {
    setIsCalculated(true);
  };

  return (
    <>
      <div className="container">
        <h1>🔥 Calculator 🔥</h1>
      </div>
      <input
        type="number"
        placeholder="write first-number"
        onChange={(e) => {
          setIsCalculated(false);
          setUserInputValues({
            ...userInputValues,
            firstValue: Number(e.target.value),
          });
        }}
      />
      <input
        type="number"
        placeholder="write second-number"
        onChange={(e) => {
          setIsCalculated(false);
          setUserInputValues({
            ...userInputValues,
            secondValue: Number(e.target.value),
          });
        }}
      />
      <select
        onChange={(e) => {
          setIsCalculated(false);
          setUserInputValues({
            ...userInputValues,
            operation: e.target.value,
          });
        }}
      >
        <option value="">Select Operation</option>
        <option value="+">더하기</option>
        <option value="-">빼기</option>
        <option value="/">나누기</option>
        <option value="*">곱하기</option>
      </select>
      <button onClick={onClick}>Run Calculator</button>
      {isCalculated && <h2> 결과값은 : {result}</h2>}
    </>
  );
};
