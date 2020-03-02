import { applicationContext } from './applicationContext';

export const withAppContextDecorator = (f, context) => {
  return async get => {
    try {
      return await f(get, context || applicationContext);
    } catch (err) {
      if (process.env.USTC_DEBUG) {
        return null;
      } else {
        throw err;
      }
    }
  };
};
