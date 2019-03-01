// eslint-disable-next-line no-unused-vars
import { get, sequences, state } from 'cerebral';

export const useCerebralStateFactory = (simpleSetter, value) => (
  bind,
  defaultValue,
) => {
  let getter = value;

  const setter = newValue => {
    return simpleSetter({
      key: bind,
      value: newValue,
    });
  };

  // default value
  if (!getter && defaultValue) {
    setter((getter = defaultValue));
  }

  return [getter, setter];
};

export function decorateWithPostCallback(delegate, postCallbackFn) {
  if (!postCallbackFn) {
    return delegate;
  }

  return (...args) => {
    delegate(...args);
    postCallbackFn(...args);
  };
}

export function decorateWithPreemptiveCallback(delegate, preemptiveCallbackFn) {
  if (!preemptiveCallbackFn) {
    return delegate;
  }

  return (...args) => {
    if (preemptiveCallbackFn(...args)) {
      delegate(...args);
    }
  };
}
