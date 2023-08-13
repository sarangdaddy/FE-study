import { useState, useRef } from 'react';

export const Chat = () => {
  const [text, setText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const timeoutID = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = () => {
    setIsSending(true);
    timeoutID.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  };

  const handleUndo = () => {
    setIsSending(false);
    if (timeoutID.current !== null) clearTimeout(timeoutID.current);
  };

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={isSending} onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending && <button onClick={handleUndo}>Undo</button>}
    </>
  );
};
