import { useState } from 'react';

interface Letter {
  id: number;
  subject: string;
  isStarred: boolean;
}

const letters: Letter[] = [
  {
    id: 0,
    subject: 'Ready for adventure?',
    isStarred: true,
  },
  {
    id: 1,
    subject: 'Time to check in!',
    isStarred: false,
  },
  {
    id: 2,
    subject: 'Festival Begins in Just SEVEN Days!',
    isStarred: false,
  },
];

export const MultiSelection = () => {
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

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map((letter: Letter) => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={selectedIds.has(letter.id)}
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>You selected {selectedCount} letters</b>
        </p>
      </ul>
    </>
  );
};

interface LetterProps {
  letter: Letter;
  onToggle: (toggledId: number) => void;
  isSelected: boolean;
}

const Letter = ({ letter, onToggle, isSelected }: LetterProps) => {
  return (
    <li className={isSelected ? 'selected' : ''}>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  );
};
