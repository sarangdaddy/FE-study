import { useEffect, useState, useRef, ChangeEvent } from 'react';
import './styles.css';

interface Quotes {
  USD: {
    price: number;
  };
}

interface coin {
  id: string;
  name: string;
  quotes: Quotes;
}

export const CoinCalculator = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [myMoney, setMyMoney] =
    useState<string>('구매가능한 금액을 입력하세요');
  const [coins, setCoins] = useState<coin[]>([]);

  const handleChangeMyMoney = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setMyMoney(inputValue);
  };

  useEffect(() => {
    let ignore = false;

    fetch('https://api.coinpaprika.com/v1/tickers?limit=10')
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          setCoins(json);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.select();
    }
  }, [isLoading]);

  return (
    <div>
      <h2>구매하고 싶은 금액을 입력하세요.</h2>
      {isLoading ? (
        <strong>로딩중...</strong>
      ) : (
        <>
          <div className="InputContainer">
            <input
              className="InputPrice"
              ref={inputRef}
              autoFocus
              value={myMoney}
              type="text"
              onChange={handleChangeMyMoney}
              min={0}
            />
            <span>USD</span>
          </div>
          <div>
            <h2>당신이 구매 가능한 코인 개수 입니다.</h2>
            <ul>
              {coins.map((item) => (
                <li key={item.id}>
                  {item.name} :{' '}
                  <span className="CoinNumber">
                    {(isNaN(Number(myMoney)) ? 0 : Number(myMoney)) /
                      item.quotes.USD.price}
                  </span>
                  개
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
