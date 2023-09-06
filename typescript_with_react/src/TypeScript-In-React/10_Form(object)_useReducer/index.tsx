import { ChangeEvent, MouseEvent, useReducer } from 'react';

interface State {
  name: string;
  age: number;
}

type Action =
  | { type: 'change_name'; nextName: string }
  | { type: 'incremented_age' };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'change_name':
      return { ...state, name: action.nextName };
    case 'incremented_age':
      return { ...state, age: state.age + 1 };
  }
};

export const FormComponent = () => {
  const [userForm, dispatch] = useReducer(reducer, { name: 'kim', age: 30 });

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'change_name', nextName: e.target.value });
  };

  const handleChangeAge = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: 'incremented_age' });
  };

  return (
    <>
      <input
        type="text"
        value={userForm.name}
        onChange={handleChangeName}
        autoFocus
      />
      <button onClick={handleChangeAge}> age + 1</button>
      <h3>
        Hello, {userForm.name}. You are {userForm.age}.
      </h3>
    </>
  );
};
