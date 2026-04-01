import { useEffect, useRef } from "react";

type EffectCallback = () => void;

export function useDebouncedEffect(
  callback: EffectCallback,
  delay: number,
  dependencies: ReadonlyArray<unknown>,
) {
  const latestCallback = useRef(callback);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      latestCallback.current();
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, ...dependencies]);
}
