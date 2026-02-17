import { sortUndefined } from './getFormattedCaseDetail';

describe('sortUndefined', () => {
  it('should return -1 if first arg has createdAtFormatted and the second does not', () => {
    const result = sortUndefined({ createdAtFormatted: '2019-07-08' }, {});

    expect(result).toEqual(-1);
  });

  it('should return 1 if second arg has createdAtFormatted and the first does not', () => {
    const result = sortUndefined({}, { createdAtFormatted: '2019-07-08' });

    expect(result).toEqual(1);
  });
});
