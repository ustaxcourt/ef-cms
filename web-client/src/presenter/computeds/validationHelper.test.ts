import { collectInputElements } from '@web-client/presenter/computeds/validationHelper';

describe('validationHelper', () => {
  const element1 = (window.document.createElement('input').id =
    'test-element') as unknown as HTMLElement;
  const element2 = (window.document.createElement('input').id =
    'test-element2') as unknown as HTMLElement;
  const element3 = (window.document.createElement('input').id =
    'test-element3') as unknown as HTMLElement;

  it('should return an array of elements needing focus due to errors', () => {
    const errors = {
      test1: 'This is error 1',
      test2: 'This is error 2',
    };
    const refs = {
      current: {
        test1: element1,
        test2: element2,
        test3: element3,
      },
    };
    const elements = collectInputElements(errors, refs);
    expect(elements).toEqual(['test-element', 'test-element2']);
  });

  it('should return an array of elements needing focus due to nested errors', () => {
    const nestedErrors = {
      nested: {
        test2: 'This is another test error',
      },
      test1: 'This is a test error',
      test3: 'This is error 3',
    };

    const nestedRefs = {
      current: {
        'nested.test2': element2,
        test1: element1,
        test3: element3,
      },
    };

    const nestedElements = collectInputElements(nestedErrors, nestedRefs);
    expect(nestedElements).toEqual([
      'test-element2',
      'test-element',
      'test-element3',
    ]);
  });

  it('should return an array of elements needing focus with a specific custom function', () => {
    const specificCustomFunction = (
      errorValue,
      refs,
      elementsToFocus,
      errorKey,
    ) => {
      if (
        errorValue === 'Specific error' &&
        refs.current[errorKey.slice(0, -1)]
      ) {
        elementsToFocus.push(refs.current[errorKey.slice(0, -1)]);
      }
    };

    const errors = {
      test1: 'Specific error',
      test2: 'Another error',
      test3: 'Specific error',
    };

    const refs = {
      current: {
        test1: element1,
        test2: element2,
        test3: element3,
      },
    };

    const elements = collectInputElements(errors, refs, specificCustomFunction);
    expect(elements).toEqual([element1, element3]);
  });
});
