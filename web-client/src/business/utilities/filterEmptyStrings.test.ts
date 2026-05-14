import { filterEmptyStrings } from './filterEmptyStrings';

describe('filterEmptyStrings', () => {
  it('filters empty strings out of an object', () => {
    const objectToFilter = {
      baz: '',
      foo: 'bar',
    };

    const result = filterEmptyStrings(objectToFilter);

    expect(result).toEqual({
      foo: 'bar',
    });
  });

  it('recursively filters empty strings out of an object', () => {
    const objectToFilter = {
      bar: {
        bar: {
          bob: '',
          ronnie: 'van zant',
        },
        foo: '',
        guy: 'fieri',
      },
      baz: '',
      foo: 'bar',
    };

    const result = filterEmptyStrings(objectToFilter);

    expect(result).toEqual({
      bar: {
        bar: {
          ronnie: 'van zant',
        },
        guy: 'fieri',
      },
      foo: 'bar',
    });
  });

  it('does not filter an already-filtered object', () => {
    const objectToFilter = {
      foo: 'bar',
      guy: 'fieri',
    };

    const result = filterEmptyStrings(objectToFilter);

    expect(result).toEqual({
      foo: 'bar',
      guy: 'fieri',
    });
  });

  it('does not filter if nothing is passed in', () => {
    const objectToFilter = null;

    const result = filterEmptyStrings(objectToFilter);

    expect(result).toEqual(objectToFilter);
  });
});
