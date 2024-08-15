import { Get } from './utilities/cerebralWrapper';
import { applicationContext } from './applicationContext';

export function withAppContextDecorator<T>(
  f: (get, appContext) => T,
  ctx?: any,
): (get: Get) => T {
  return (get: Get) => {
    return f(get, ctx || applicationContext);
  };
}
