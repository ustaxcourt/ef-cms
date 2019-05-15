import { applicationContext } from '../../src/applicationContext';

export const withAppContextDecorator = f => {
  return get => f(get, applicationContext);
};
