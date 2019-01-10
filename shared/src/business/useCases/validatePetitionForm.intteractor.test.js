const { validatePetitionForm } = require('./validatePetitionForm.interactor');

describe('validatePetitionForm', () => {
  it('returns the expected errors object', () => {
    const errors = validatePetitionForm({
      petitionForm: {},
    });
    expect(errors).toEqual({
      caseType: '"caseType" is required',
      procedureType: '"procedureType" is required',
      irsNoticeDate: '"irsNoticeDate" is required',
      // irsNoticeFile: '"irsNoticeFile" is required',
      petitionFile: '"petitionFile" is required',
      trialLocation: '"trialLocation" is required',
    });
  });

  it('returns the expected errors object', () => {
    const errors = validatePetitionForm({
      petitionForm: {
        caseType: 'defined',
      },
    });
    expect(errors).toEqual({
      procedureType: '"procedureType" is required',
      irsNoticeDate: '"irsNoticeDate" is required',
      // irsNoticeFile: '"irsNoticeFile" is required',
      petitionFile: '"petitionFile" is required',
      trialLocation: '"trialLocation" is required',
    });
  });

  it('returns the expected errors object', () => {
    const errors = validatePetitionForm({
      petitionForm: {
        caseType: 'defined',
        procedureType: 'defined',
        irsNoticeDate: '01/01/1001',
        // irsNoticeFile: new File([], 'noop.png'),
        petitionFile: new File([], 'test.png'),
        trialLocation: 'defined',
      },
    });
    expect(errors).toEqual(null);
  });
});
