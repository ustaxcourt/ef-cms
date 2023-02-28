import { applicationContext } from './applicationContext';

export const withAppContextDecorator = (f, ctx) => {
  return get => {
    try {
      return f(get, ctx || applicationContext);
    } catch (err) {
      if (process.env.USTC_DEBUG) {
        return null;
      } else {
        throw err;
      }
    }
  };
};
