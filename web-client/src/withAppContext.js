import { applicationContext } from './applicationContext';

export const withAppContextDecorator = (f, context) => {
  return get => {
    try {
      return f(get, context || applicationContext);
    } catch (err) {
      if (process.env.USTC_DEBUG) {
        return null;
      } else {
        throw err;
      }
    }
  };
};
