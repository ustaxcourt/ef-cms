import { userDataCanGenerateValidBarNumber } from './userDataCanGenerateValidBarNumber';

describe('userDataCanGenerateValidBarNumber', () => {
  it('should return true when valid first and last names are provided', () => {
    const result = userDataCanGenerateValidBarNumber({
      firstName: 'Johnny',
      lastName: 'Ringo',
    });
    expect(result).toEqual(true);
  });

  it('should return false when an invalid first name is provided', () => {
    const result = userDataCanGenerateValidBarNumber({
      firstName: '123',
      lastName: 'Ringo',
    });
    expect(result).toEqual(false);
  });

  it('should return false when an invalid last name is provided', () => {
    const result = userDataCanGenerateValidBarNumber({
      firstName: 'Johnny',
      lastName: '',
    });
    expect(result).toEqual(false);
  });
});
