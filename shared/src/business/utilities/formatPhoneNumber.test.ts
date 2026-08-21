import {
  formatPhoneNumber,
  formatTrialNoticePhoneNumber,
} from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  it('should return a formatted string with hyphens if the original string has 10 digits', () => {
    const result = formatPhoneNumber('1234567890');

    expect(result).toEqual('123-456-7890');
  });

  const originalStringTests = [
    {
      description: 'the original string already contains hyphens',
      phone: '123-4567-890',
    },
    {
      description:
        'the original string is formatted with parentheses and hyphens',
      phone: '(123)456-7890',
    },
    {
      description: 'the original string is more than 10 digits',
      phone: '11234567890',
    },
    {
      description: 'the original string is less than 10 digits',
      phone: '123456789',
    },
  ];

  for (const stringTest of originalStringTests) {
    it(`should return the original string if ${stringTest.description}`, () => {
      const result = formatPhoneNumber(stringTest.phone);

      expect(result).toEqual(stringTest.phone);
    });
  }

  it('should return undefined if nothing is passed in', () => {
    // @ts-expect-error
    const result = formatPhoneNumber();

    expect(result).toBeUndefined();
  });
});

describe('formatTrialNoticePhoneNumber', () => {
  it('should return a formatted string with parentheses for 10 digits', () => {
    const result = formatTrialNoticePhoneNumber('4444444444');

    expect(result).toEqual('(444) 444-4444');
  });

  it('should reformat a hyphenated 10-digit phone number', () => {
    const result = formatTrialNoticePhoneNumber('444-444-4444');

    expect(result).toEqual('(444) 444-4444');
  });

  it('should return the original string if it is not 10 digits', () => {
    const result = formatTrialNoticePhoneNumber('3333');

    expect(result).toEqual('3333');
  });

  it('should return undefined if nothing is passed in', () => {
    const result = formatTrialNoticePhoneNumber();

    expect(result).toBeUndefined();
  });
});
