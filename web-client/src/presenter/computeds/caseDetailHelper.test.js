import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
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
  it('should set showFileDocumentButton to true if current page is CaseDetail, user role is practitioner, and case is owned by user', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ userId: '123' }] },
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
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [] },
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
      role: User.ROLES.petitioner,
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
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
      role: User.ROLES.petitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
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
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to false if user role is practitioner and the practitioner is not associated with the case', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ userId: '234' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: false },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to true if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ userId: '789' }] },
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
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ userId: '123' }] },
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
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
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
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: {},
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
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: [],
        caseDetail: {},
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
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: {},
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
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: ['something'],
        caseDetail: {},
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
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDeadlines: [],
        caseDetail: {},
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
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(true);
  });

  it('should show practitioner section if user is an external user and there are privatePractitioners on the case', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ name: 'Test Practitioner' }] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(true);
  });

  it('should not show practitioner section if user is an external user and there are no privatePractitioners on the case', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(false);
  });

  it('should show respondent section if user is an internal user', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(true);
  });

  it('should show respondent section if user is an external user and there are irsPractitioners on the case', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ name: 'Test Respondents' }] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(true);
  });

  it('should not show respondent section if user is an external user and there are no irsPractitioners on the case', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(false);
  });

  it('should format practitioner matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { privatePractitioners: [{ userId: '2' }] },
        form: {},
        modal: {
          practitionerMatches: [
            {
              contact: { city: 'Somewhere', postalCode: '12345', state: 'AL' },
              name: '1',
              userId: '1',
            },
            {
              contact: {
                city: 'Somewhere Else',
                postalCode: '54321',
                state: 'TX',
              },
              name: '2',
              userId: '2',
            },
          ],
        },
      },
    });
    expect(result.practitionerMatchesFormatted).toMatchObject([
      {
        cityStateZip: 'Somewhere, AL 12345',
        name: '1',
      },
      {
        cityStateZip: 'Somewhere Else, TX 54321',
        name: '2',
      },
    ]);
    expect(result.practitionerMatchesFormatted[0].isAlreadyInCase).toBeFalsy();
    expect(result.practitionerMatchesFormatted[1].isAlreadyInCase).toBeTruthy();
  });

  it('should set practitionerSearchResultsCount to the length of the state.modal.practitionerMatches', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: { practitionerMatches: [{ name: '1' }, { name: '2' }] },
      },
    });
    expect(result.practitionerSearchResultsCount).toEqual(2);
  });

  it('should set practitionerSearchResultsCount to 0 if the state.modal.practitionerMatches is an empty array', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: { practitionerMatches: [] },
      },
    });
    expect(result.practitionerSearchResultsCount).toEqual(0);
  });

  it('should not set practitionerSearchResultsCount if state.modal is an empty object', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: {},
      },
    });
    expect(result.practitionerSearchResultsCount).toBeUndefined();
  });

  it('should format respondent matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { irsPractitioners: [{ userId: '1' }] },
        form: {},
        modal: {
          respondentMatches: [
            {
              contact: { city: 'Somewhere', postalCode: '12345', state: 'AL' },
              name: '1',
              userId: '1',
            },
            {
              contact: {
                city: 'Somewhere Else',
                postalCode: '54321',
                state: 'TX',
              },
              name: '2',
              userId: '2',
            },
          ],
        },
      },
    });
    expect(result.respondentMatchesFormatted).toMatchObject([
      {
        cityStateZip: 'Somewhere, AL 12345',
        name: '1',
      },
      {
        cityStateZip: 'Somewhere Else, TX 54321',
        name: '2',
      },
    ]);
    expect(result.respondentMatchesFormatted[0].isAlreadyInCase).toBeTruthy();
    expect(result.respondentMatchesFormatted[1].isAlreadyInCase).toBeFalsy();
  });

  it('should set respondentSearchResultsCount to the length of the state.modal.respondentMatches', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: { respondentMatches: [{ name: '1' }, { name: '2' }] },
      },
    });
    expect(result.respondentSearchResultsCount).toEqual(2);
  });

  it('should set respondentSearchResultsCount to 0 if the state.modal.respondentMatches is an empty array', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: { respondentMatches: [] },
      },
    });
    expect(result.respondentSearchResultsCount).toEqual(0);
  });

  it('should not set respondentSearchResultsCount if state.modal is an empty object', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        form: {},
        modal: {},
      },
    });
    expect(result.respondentSearchResultsCount).toBeUndefined();
  });

  it('should show empty state for consolidated cases', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          consolidatedCases: [],
          noticeOfAttachments: false,
          orderDesignatingPlaceOfTrial: false,
          orderForAmendedPetition: false,
          orderForAmendedPetitionAndFilingFee: false,
          orderForFilingFee: false,
          orderForOds: false,
          orderForRatification: false,
          orderToChangeDesignatedPlaceOfTrial: false,
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
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: true },
      },
    });
    expect(result.showEditPetitionDetailsButton).toEqual(true);
  });

  it('should not show edit petition details button if user does not have EDIT_PETITION_DETAILS permission', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailInternal',
        form: {},
        permissions: { EDIT_PETITION_DETAILS: false },
      },
    });
    expect(result.showEditPetitionDetailsButton).toEqual(false);
  });

  it('should show the filing fee section for a petitioner user', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(true);
  });

  it('should show the filing fee section for a practitioner user', () => {
    const user = {
      role: User.ROLES.privatePractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(true);
  });

  it('should not show the filing fee section for a respondent user', () => {
    const user = {
      role: User.ROLES.irsPractitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showFilingFeeExternal).toEqual(false);
  });
});
