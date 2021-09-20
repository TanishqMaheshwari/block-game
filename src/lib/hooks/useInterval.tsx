import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay?: number): void => {
  const callbackRef = useRef(callback);

  useEffect(() => (callbackRef.current = callback), [callback]);

  useEffect(() => {
    if (delay === undefined) return;

    const id = setInterval(() => callbackRef.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
