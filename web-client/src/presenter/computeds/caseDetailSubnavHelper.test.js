import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from './caseDetailSubnavHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailSubnavHelper = withAppContextDecorator(
  caseDetailSubnavHelperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('caseDetailSubnavHelper', () => {
  const petitionsClerkUser = {
    role: ROLES.petitionsClerk,
    userId: '123',
  };
  const petitionerUser = {
    role: ROLES.petitioner,
    userId: '123',
  };
  const privatePractitionerUser = {
    role: ROLES.privatePractitioner,
    userId: '123',
  };
  const irsPractitionerUser = {
    role: ROLES.irsPractitioner,
    userId: '123',
  };

  it('should show internal-only tabs if user is internal', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
    expect(result.showTrackedItemsTab).toBeTruthy();
    expect(result.showDraftsTab).toBeTruthy();
    expect(result.showMessagesTab).toBeTruthy();
    expect(result.showCorrespondenceTab).toBeTruthy();
    expect(result.showNotesTab).toBeTruthy();
  });

  it('should not show internal-only tabs if user is external', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(petitionerUser),
      },
    });
    expect(result.showTrackedItemsTab).toBeFalsy();
    expect(result.showDraftsTab).toBeFalsy();
    expect(result.showMessagesTab).toBeFalsy();
    expect(result.showCorrespondenceTab).toBeFalsy();
    expect(result.showNotesTab).toBeFalsy();
  });

  it('should show case information tab if user is external and associated with the case', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(petitionerUser),
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
  });

  it('should not show case information tab if user is external and not associated with the case', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(privatePractitionerUser),
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showCaseInformationTab).toBeFalsy();
  });

  it('should show case information tab if user is an irsPractitioner and not associated with the case', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(irsPractitionerUser),
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showCaseInformationTab).toBeTruthy();
  });

  it('should show primaryTab as selected if it is not caseInformation', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(petitionerUser),
        currentViewMetadata: {
          caseDetail: {
            caseInformationTab: 'overview',
            primaryTab: 'docketRecord',
          },
        },
      },
    });
    expect(result.selectedCaseInformationTab).toBe('docketRecord');
  });

  it("should show caseInformationTab's value as selected if primaryTab is caseInformation", () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state: {
        ...getBaseState(petitionerUser),
        currentViewMetadata: {
          caseDetail: {
            caseInformationTab: 'petitioner',
            primaryTab: 'caseInformation',
          },
        },
      },
    });
    expect(result.selectedCaseInformationTab).toBe('petitioner');
  });

  describe('showTrackedItemsNotification', () => {
    it('should be true when caseDetail.hasPendingItems is true', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            hasPendingItems: true,
          },
        },
      });

      expect(result.showTrackedItemsNotification).toBeTruthy();
    });

    it('should be true when caseDeadlines is an array with length greater than 0', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines: [{ yes: true }],
        },
      });

      expect(result.showTrackedItemsNotification).toBeTruthy();
    });

    it('should be false when caseDetail.hasPendingItems is false and caseDeadlines is undefined', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines: undefined,
          caseDetail: {
            hasPendingItems: false,
          },
        },
      });

      expect(result.showTrackedItemsNotification).toBeFalsy();
    });

    it('should be false when caseDetail.hasPendingItems is false and caseDeadlines is an empty array', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDeadlines: [],
          caseDetail: {
            hasPendingItems: false,
          },
        },
      });

      expect(result.showTrackedItemsNotification).toBeFalsy();
    });
  });

  describe('showNotesIcon', () => {
    it('should be true when caseDetail.caseNote exists', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          caseDetail: {
            caseNote: 'domo arigato',
          },
        },
      });

      expect(result.showNotesIcon).toBeTruthy();
    });

    it('should be true when state.judgesNotes exists and is loaded', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {
          judgesNote: {
            notes: 'misuta Robotto',
          },
        },
      });

      expect(result.showNotesIcon).toBeTruthy();
    });

    it('should be false when neither caseNotes nor judgesNotes exist', () => {
      const result = runCompute(caseDetailSubnavHelper, {
        state: {},
      });

      expect(result.showNotesIcon).toBeFalsy();
    });
  });
});
