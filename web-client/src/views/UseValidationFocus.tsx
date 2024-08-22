import { MutableRefObject, useEffect, useRef } from 'react';
import { collectInputElements } from '@web-client/presenter/computeds/validationHelper';

export const useValidationFocus = (
  validationErrors: Object,
  customFunction?: (
    errorValue: any,
    refs: MutableRefObject<{ [key: string]: HTMLElement }>,
    elementsToFocus: HTMLElement[],
    errorKey: string,
  ) => void,
) => {
  const refs: MutableRefObject<{ [key: string]: HTMLElement }> = useRef({});
  const hasFocusedError = useRef(false);

  useEffect(() => {
    if (!hasFocusedError.current && validationErrors) {
      const elementsToFocus = collectInputElements(
        validationErrors,
        refs,
        customFunction,
      );

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
