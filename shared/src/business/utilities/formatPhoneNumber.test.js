import { formatPhoneNumber } from './formatPhoneNumber';

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

  for (let stringTest of originalStringTests) {
    it(`should return the original string if ${stringTest.description}`, () => {
      const result = formatPhoneNumber(stringTest.phone);

      expect(result).toEqual(stringTest.phone);
    });
  }

  it('should return undefined if nothing is passed in', () => {
    const result = formatPhoneNumber();

    expect(result).toBeUndefined();
  });
});
