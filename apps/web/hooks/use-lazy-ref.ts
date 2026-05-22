import * as React from "react";

export function useLazyRef<T>(init: () => T) {
  const ref = React.useRef<T | null>(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref as React.MutableRefObject<T>;
}

