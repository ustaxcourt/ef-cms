import { runCompute } from 'cerebral/test';

import startCaseHelper from './startCaseHelper';

describe('start a case computed', () => {
  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {},
        form: {},
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
        },
        form: {},
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets showOwnershipDisclosure when the party is business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
        },
        form: {
          partyType: true,
          filingType: 'A business',
        },
      },
    });
    expect(result.showOwnershipDisclosure).toBeTruthy();
  });

  it('clears showOwnershipDisclosure when the party is not business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        petition: {
          petitionFile: true,
        },
        form: {
          partyType: true,
          filingType: 'not A business',
        },
      },
    });
    expect(result.showOwnershipDisclosure).toBeFalsy();
  });

  it('sets showHasNoticeOptions when hasNotice is Yes', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasNotice: 'Yes',
        },
      },
    });
    expect(result.showHasNoticeOptions).toBeTruthy();
    expect(result.showNotHasNoticeOptions).toBeFalsy();
  });

  it('sets showNotHasNoticeOptions when hasNotice is No', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasNotice: 'No',
        },
      },
    });
    expect(result.showNotHasNoticeOptions).toBeTruthy();
    expect(result.showHasNoticeOptions).toBeFalsy();
  });
});
