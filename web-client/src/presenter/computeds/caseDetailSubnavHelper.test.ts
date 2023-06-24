import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseDetailSubnavHelper as caseDetailSubnavHelperComputed } from './caseDetailSubnavHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
    caseDetail: {
      docketEntries: [],
    },
    permissions: getUserPermissions(user),
  };
};

const generateDocketEntries = (numberInDraft, numberNotInDraft) => {
  const docketEntries = [];

  for (let i = 0; i < numberInDraft; i++) {
    docketEntries.push({
      isDraft: true,
    });
  }

  for (let i = 0; i < numberNotInDraft; i++) {
    docketEntries.push({
      isDraft: false,
    });
  }

  return docketEntries;
};

const computeState = state => {
  return runCompute(caseDetailSubnavHelper, {
    state,
  });
};

describe('caseDetailSubnavHelper', () => {
  let state = {};

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

  beforeEach(() => {
    state = getBaseState(petitionsClerkUser);
  });

  it('should show internal-only tabs if user is internal', () => {
    const result = runCompute(caseDetailSubnavHelper, {
      state,
    });
    expect(result.showCaseInformationTab).toBeTruthy();
    expect(result.showTrackedItemsTab).toBeTruthy();
    expect(result.showDraftsTab).toBeTruthy();
    expect(result.showMessagesTab).toBeTruthy();
    expect(result.showCorrespondenceTab).toBeTruthy();
    expect(result.showNotesTab).toBeTruthy();
  });

  it('should not show internal-only tabs if user is external', () => {
    state = {
      ...getBaseState(petitionerUser),
    };

    const result = computeState(state);
    expect(result.showTrackedItemsTab).toBeFalsy();
    expect(result.showDraftsTab).toBeFalsy();
    expect(result.showMessagesTab).toBeFalsy();
    expect(result.showCorrespondenceTab).toBeFalsy();
    expect(result.showNotesTab).toBeFalsy();
  });

  it('should show case information tab if user is external and associated with the case', () => {
    state = {
      ...getBaseState(petitionerUser),
      screenMetadata: {
        isAssociated: true,
      },
    };

    const result = computeState(state);

    expect(result.showCaseInformationTab).toBeTruthy();
  });

  it('should not show case information tab if user is external and not associated with the case', () => {
    state = {
      ...getBaseState(privatePractitionerUser),
      screenMetadata: {
        isAssociated: false,
      },
    };

    const result = computeState(state);
    expect(result.showCaseInformationTab).toBeFalsy();
  });

  it('should show case information tab if user is an irsPractitioner and not associated with the case', () => {
    state = {
      ...getBaseState(irsPractitionerUser),
      screenMetadata: {
        isAssociated: false,
      },
    };

    const result = computeState(state);
    expect(result.showCaseInformationTab).toBeTruthy();
  });

  it('should show primaryTab as selected if it is not caseInformation', () => {
    state = {
      ...getBaseState(petitionerUser),
      currentViewMetadata: {
        caseDetail: {
          caseInformationTab: 'overview',
          primaryTab: 'docketRecord',
        },
      },
    };

    const result = computeState(state);

    expect(result.selectedCaseInformationTab).toBe('docketRecord');
  });

  it("should show caseInformationTab's value as selected if primaryTab is caseInformation", () => {
    state = {
      ...getBaseState(petitionerUser),
      currentViewMetadata: {
        caseDetail: {
          caseInformationTab: 'petitioner',
          primaryTab: 'caseInformation',
        },
      },
    };

    const result = computeState(state);

    expect(result.selectedCaseInformationTab).toBe('petitioner');
  });

  describe('showTrackedItemsNotification', () => {
    it('should be true when caseDetail.hasPendingItems is true', () => {
      state.caseDetail.hasPendingItems = true;

      const result = computeState(state);

      expect(result.showTrackedItemsNotification).toBeTruthy();
    });

    it('should be true when caseDeadlines is an array with length greater than 0', () => {
      state.caseDeadlines = [{ yes: true }];

      const result = computeState(state);

      expect(result.showTrackedItemsNotification).toBeTruthy();
    });

    it('should be false when caseDetail.hasPendingItems is false and caseDeadlines is undefined', () => {
      state.caseDeadlines = undefined;
      state.caseDetail.hasPendingItems = false;

      const result = computeState(state);

      expect(result.showTrackedItemsNotification).toBeFalsy();
    });

    it('should be false when caseDetail.hasPendingItems is false and caseDeadlines is an empty array', () => {
      state.caseDeadlines = [];
      state.caseDetail.hasPendingItems = false;

      const result = computeState(state);

      expect(result.showTrackedItemsNotification).toBeFalsy();
    });
  });

  describe('showNotesIcon', () => {
    it('should be true when caseDetail.caseNote exists', () => {
      state.caseDetail.caseNote = 'domo arigato';

      const result = computeState(state);

      expect(result.showNotesIcon).toBeTruthy();
    });

    it('should be true when state.judgesNotes exists and is loaded', () => {
      state = {
        ...state,
        judgesNote: {
          notes: 'misuta Robotto',
        },
      };

      const result = computeState(state);

      expect(result.showNotesIcon).toBeTruthy();
    });

    it('should be false when neither caseNotes nor judgesNotes exist', () => {
      const result = computeState(state);

      expect(result.showNotesIcon).toBeFalsy();
    });
  });

  describe('draft tab', () => {
    it('returns the number of draft items on the case', () => {
      const numberOfDrafts = 2;
      state.caseDetail.docketEntries = generateDocketEntries(numberOfDrafts, 1);

      const result = computeState(state);

      expect(result.draftDocketEntryCount).toEqual(numberOfDrafts);
    });

    it('returns 0 draft items when there are 0 draft items on the case', () => {
      const numberOfDrafts = 0;
      state.caseDetail.docketEntries = generateDocketEntries(
        numberOfDrafts,
        26,
      );

      const result = computeState(state);

      expect(result.draftDocketEntryCount).toEqual(numberOfDrafts);
    });
  });
});
