import { MOCK_USERS } from '../../shared/src/test/mockUsers';
import { applicationContext } from './applicationContext';

applicationContext.getCurrentUser = () =>
  MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];

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
