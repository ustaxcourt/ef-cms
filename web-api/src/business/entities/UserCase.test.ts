import { UserCase } from './UserCase';
import type { RawUserCase } from './UserCase';

describe('UserCase', () => {
  const validUserCase = {
    docketNumber: '104-21',
  };

  it('fails validation if required fields are non-existent', () => {
    expect(new UserCase({} as unknown as RawUserCase).isValid()).toBeFalsy();
  });

  it('passes validation if required fields exist', () => {
    expect(new UserCase(validUserCase).isValid()).toBeTruthy();
  });
});
