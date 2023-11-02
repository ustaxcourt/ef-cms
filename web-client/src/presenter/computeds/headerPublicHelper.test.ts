import { headerPublicHelper } from './headerPublicHelper';
import { runCompute } from 'cerebral/test';

describe('headerHelper', () => {
  it('should not signify being in the sign-up process when the current page is not CreatePetitionerAccount nor VerificationSent', () => {
    let result = runCompute(headerPublicHelper, {
      state: { currentPage: '' },
    });

    expect(result).toEqual({ inSignUpProcess: false });
  });

  it('should signify being in the sign-up process when the current page is CreatePetitionerAccount or VerificationSent', () => {
    let result = runCompute(headerPublicHelper, {
      state: { currentPage: 'CreatePetitionerAccount' },
    });

    expect(result).toEqual({ inSignUpProcess: true });
  });
});
