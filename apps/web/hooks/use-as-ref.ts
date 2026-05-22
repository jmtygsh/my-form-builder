import * as React from "react";

export function useAsRef<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

