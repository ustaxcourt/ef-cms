import { MutableRefObject, useEffect, useRef } from 'react';

export const useValidationFocus = (
  validationErrors: Object,
  customFunction?: Function,
) => {
  const refs: MutableRefObject<Object> = useRef({});
  const hasFocusedError = useRef(false);

  const collectInputElements = (errors, prefix = '') => {
    const elementsToFocus: HTMLInputElement[] = [];

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

  useEffect(() => {
    if (!hasFocusedError.current && validationErrors) {
      const elementsToFocus = collectInputElements(validationErrors);

      if (elementsToFocus.length > 0) {
        elementsToFocus.sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        );
        const elementToFocus = elementsToFocus[0];
        elementToFocus.focus();
        elementToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });

        hasFocusedError.current = true;
      }
    }
  }, [validationErrors, customFunction]);

  const registerRef = name => element => {
    refs.current[name] = element;
  };

  const resetFocus = () => {
    hasFocusedError.current = false;
  };

  return { registerRef, resetFocus };
};
