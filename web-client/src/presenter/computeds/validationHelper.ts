import { MutableRefObject } from 'react';

export const collectInputElements = (
  errors: object,
  refs: MutableRefObject<{ [key: string]: HTMLElement }>,
  customFunction?: (
    errorValue: any,
    customRefs: MutableRefObject<{ [key: string]: HTMLElement }>,
    elementsToFocus: HTMLElement[],
    errorKey: string,
  ) => void,
  prefix: string = '',
) => {
  const elementsToFocus: HTMLElement[] = [];

  const formatErrors = (err, pre = '') => {
    if (typeof err === 'object' && err !== null) {
      for (const key in err) {
        if (customFunction)
          customFunction(err[key], refs, elementsToFocus, `${pre}${key}.`);
        else if (typeof err[key] === 'object' && err[key] !== null) {
          formatErrors(err[key], `${pre}${key}.`);
        } else if (err[key] && refs.current[`${pre}${key}`]) {
          elementsToFocus.push(refs.current[`${pre}${key}`]);
        }
      }
    }
  };
  formatErrors(errors, prefix);
  return elementsToFocus;
};
