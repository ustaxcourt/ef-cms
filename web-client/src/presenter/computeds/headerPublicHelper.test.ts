import { headerPublicHelper } from './headerPublicHelper';
import { runCompute } from 'cerebral/test';

describe('headerPublicHelper', () => {
  it('should not signify being in the sign-up process when the current page is not CreatePetitionerAccount nor VerificationSent', () => {
    let result = runCompute(headerPublicHelper, {
      state: { currentPage: '' },
    });

    expect(result).toEqual({ inSignUpProcess: false });
  });

  it('should signify being in the sign-up process when the current page is CreatePetitionerAccount', () => {
    let result = runCompute(headerPublicHelper, {
      state: { currentPage: 'CreatePetitionerAccount' },
    });

    expect(result).toEqual({ inSignUpProcess: true });
  });

  it('should signify being in the sign-up process when the current page is VerificationSent', () => {
    let result = runCompute(headerPublicHelper, {
      state: { currentPage: 'VerificationSent' },
    });

    expect(result).toEqual({ inSignUpProcess: true });
  });
});
