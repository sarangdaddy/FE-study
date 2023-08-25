import { ChangeEvent, useState } from 'react';

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

interface SearchBarProps {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FilteringList = () => {
  const [query, setQuery] = useState('');
  const filteredItems = filterItems({ items: foods, query });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <SearchBar query={query} onChange={handleChange} />
      <List items={filteredItems} />
    </>
  );
};

export const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <label>
      Search :<input value={query} onChange={onChange} />
    </label>
  );
};

export const List = ({ items }: ListProps) => {
  return (
    <table>
      <tbody>
        {items.map((food) => (
          <tr key={food.name}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const filterItems = ({ items, query }: FilterItemsProps) => {
  query = query.toLowerCase();

  return items.filter((item) => {
    return item.name.split(' ').some((word) => {
      return word.toLowerCase().startsWith(query);
    });
  });
};

export const foods = [
  {
    id: 0,
    name: 'Sushi',
    description:
      'Sushi is a traditional Japanese dish of prepared vinegared rice',
  },
  {
    id: 1,
    name: 'Dal',
    description:
      'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added',
  },
  {
    id: 2,
    name: 'Pierogi',
    description:
      'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water',
  },
  {
    id: 3,
    name: 'Shish kebab',
    description:
      'Shish kebab is a popular meal of skewered and grilled cubes of meat.',
  },
  {
    id: 4,
    name: 'Dim sum',
    description:
      'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch',
  },
];
