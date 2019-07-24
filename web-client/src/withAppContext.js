import { applicationContext } from './applicationContext';

export const withAppContextDecorator = (f, context) => {
  return get => f(get, context || applicationContext);
};
