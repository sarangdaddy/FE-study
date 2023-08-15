import { useEffect, useRef } from 'react';

interface MyInputProps {
  shouldFocus: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MyInput = ({ shouldFocus, value, onChange }: MyInputProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return <input ref={ref} value={value} onChange={onChange} />;
};
