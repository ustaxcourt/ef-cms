import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseDetailHelper as caseDetailHelperComputed } from './caseDetailHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailHelper = withAppContextDecorator(caseDetailHelperComputed, {
  ...applicationContext,
  getCurrentUser: () => {
    return globalUser;
  },
});

let globalUser;

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

describe('case detail computed', () => {
  it('should set showAddCorrespondenceButton to false when the current user is not a petitions clerk or a docket clerk', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], privatePractitioners: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showAddCorrespondenceButton).toEqual(false);
  });

  it('should set showAddCorrespondenceButton to true when the current user is a petitions clerk', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '123',
    };

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], privatePractitioners: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });

    expect(result.showAddCorrespondenceButton).toEqual(true);
  });

  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is practitioner, and case is owned by user', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '123' }],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set showFileDocumentButton to false if current page is CaseDetail, user role is practitioner, and case is not owned by user', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], privatePractitioners: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is petitioner, and the user is associated with the case', () => {
    const user = {
      role: ROLES.petitioner,
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set userHasAccessToCase to true if user role is petitioner and user is associated with case', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to true if user role is practitioner and the practitioner is associated with the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '123' }],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to false if user role is practitioner and the practitioner is not associated with the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '234' }],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: false },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to true if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          irsPractitioners: [{ userId: '789' }],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
    expect(result.showFileDocumentButton).toEqual(true);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to false if user role is respondent and the respondent is not associated with the case', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          irsPractitioners: [{ userId: '123' }],
        },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to false if user role is respondent and there is no respondent associated with the case', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
    expect(result.showFileDocumentButton).toEqual(false);
  });

  it('should show case deadlines external view for external user who is associated with the case if there are deadlines on the case', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showCaseDeadlinesExternal).toEqual(true);
    expect(result.showCaseDeadlinesInternalEmpty).toEqual(false);
    expect(result.showCaseDeadlinesInternal).toEqual(false);
  });

  it('should not show case deadlines external view for external user who is associated with the case if there are not deadlines on the case', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: [],
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: true,
        },
      },
    });
    expect(result.showCaseDeadlinesExternal).toEqual(false);
    expect(result.showCaseDeadlinesInternalEmpty).toEqual(false);
    expect(result.showCaseDeadlinesInternal).toEqual(false);
  });

  it('should not show case deadlines external view for external user who is not associated with the case and there are deadlines on the case', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: {
          isAssociated: false,
        },
      },
    });
    expect(result.showCaseDeadlinesExternal).toEqual(false);
    expect(result.showCaseDeadlinesInternalEmpty).toEqual(false);
    expect(result.showCaseDeadlinesInternal).toEqual(false);
  });

  it('should show case deadlines internal view and not show case deadlines external view for internal user', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
      },
    });
    expect(result.showCaseDeadlinesInternalEmpty).toEqual(false);
    expect(result.showCaseDeadlinesInternal).toEqual(true);
    expect(result.showCaseDeadlinesExternal).toEqual(false);
  });

  it('should show case deadlines internal view as empty and not show case deadlines external view for internal user if case deadlines is empty', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: [],
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetail',
        form: {},
      },
    });
    expect(result.showCaseDeadlinesInternalEmpty).toEqual(true);
    expect(result.showCaseDeadlinesInternal).toEqual(false);
    expect(result.showCaseDeadlinesExternal).toEqual(false);
  });

  it('should show practitioner section if user is an internal user', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(true);
  });

  it('should show practitioner section if user is an external user and there are privatePractitioners on the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ name: 'Test Practitioner' }],
        },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(true);
  });

  it('should not show practitioner section if user is an external user and there are no privatePractitioners on the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], privatePractitioners: [] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(false);
  });

  it('should show empty state for consolidated cases', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          consolidatedCases: [],
          docketEntries: [],
          noticeOfAttachments: false,
          orderDesignatingPlaceOfTrial: false,
          orderForAmendedPetition: false,
          orderForAmendedPetitionAndFilingFee: false,
          orderForFilingFee: false,
          orderForOds: false,
          orderForRatification: false,
          orderToShowCause: true,
        },
        form: {},
        modal: {},
      },
    });
    expect(result.hasConsolidatedCases).toEqual(false);
  });

  it('should show edit petition details button if user has EDIT_PETITION_DETAILS permission', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: true },
      },
    });
    expect(result.showEditPetitionDetailsButton).toEqual(true);
  });

  it('should not show edit petition details button if user does not have EDIT_PETITION_DETAILS permission', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.showEditPetitionDetailsButton).toEqual(false);
  });

  it('should show the filing fee section for a petitioner user', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(true);
  });

  it('should show the filing fee section for a practitioner user', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(true);
  });

  it('should not show the filing fee section for a respondent user', () => {
    const user = {
      role: ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(false);
  });

  it('should not show petition processing alert if user is an internal user', () => {
    const user = {
      role: ROLES.petitionsClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(false);
  });

  it('should not show petition processing alert if user is an external user and the case contains a served docket entry', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [
            { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(false);
  });

  it('should not show petition processing alert if user is an external user and the case contains an isLegacyServed docket entry', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [{ documentType: 'Answer', isLegacyServed: true }],
        },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(false);
  });

  it('should show petition processing alert if user is an external user and the case does not contain any served docket entries', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [{ documentType: 'Petition' }],
        },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(true);
  });

  it('should return hasIrsPractitioners false if there are no irs practitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], irsPractitioners: [] },

        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.hasIrsPractitioners).toEqual(false);
  });

  it('should return hasIrsPractitioners true if there are irs practitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          irsPractitioners: [{ userId: '789' }],
        },

        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.hasIrsPractitioners).toEqual(true);
  });

  it('should return hasPrivatePractitioners false if there are no private practitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], privatePractitioners: [] },

        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.hasPrivatePractitioners).toEqual(false);
  });

  it('should return hasPrivatePractitioners true if there are private practitioners on the case', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };

    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '789' }],
        },

        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.hasPrivatePractitioners).toEqual(true);
  });

  describe('showAddRemoveFromHearingButtons', () => {
    it('should set showAddRemoveFromHearingButtons to false when the current user does not have SET_FOR_HEARING permission', () => {
      const user = {
        role: ROLES.petitionsClerk, // does not have SET_FOR_HEARING permission
        userId: '123',
      };

      const result = runCompute(caseDetailHelper, {
        state: {
          ...getBaseState(user), // sets the permissions in state based on the user role
          caseDetail: { docketEntries: [], privatePractitioners: [] },
          currentPage: 'CaseDetail',
          form: {},
          screenMetadata: {
            isAssociated: false,
          },
        },
      });

      expect(result.showAddRemoveFromHearingButtons).toEqual(false);
    });

    it('should set showAddRemoveFromHearingButtons to true when the current user is a has SET_FOR_HEARING permission', () => {
      const user = {
        role: ROLES.docketClerk, // has SET_FOR_HEARING permission
        userId: '123',
      };

      const result = runCompute(caseDetailHelper, {
        state: {
          ...getBaseState(user), // sets the permissions in state based on the user role
          caseDetail: { docketEntries: [], privatePractitioners: [] },
          currentPage: 'CaseDetail',
          form: {},
          screenMetadata: {
            isAssociated: false,
          },
        },
      });

      expect(result.showAddRemoveFromHearingButtons).toEqual(true);
    });
  });
});
