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
        caseDetail: { documents: [], privatePractitioners: [] },
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
        caseDetail: { documents: [], privatePractitioners: [] },
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
          documents: [],
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
        caseDetail: { documents: [], privatePractitioners: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
          documents: [],
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
          documents: [],
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
        caseDetail: { documents: [], irsPractitioners: [{ userId: '789' }] },
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
        caseDetail: { documents: [], irsPractitioners: [{ userId: '123' }] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
          documents: [],
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
        caseDetail: { documents: [], privatePractitioners: [] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(false);
  });

  it('should show respondent section if user is an internal user', () => {
    const user = {
      role: ROLES.docketClerk,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(true);
  });

  it('should show respondent section if user is an external user and there are irsPractitioners on the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [],
          irsPractitioners: [{ name: 'Test Respondents' }],
        },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(true);
  });

  it('should not show respondent section if user is an external user and there are no irsPractitioners on the case', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [], irsPractitioners: [] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(false);
  });

  it('should format practitioner matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [], privatePractitioners: [{ userId: '2' }] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: { practitionerMatches: [{ name: '1' }, { name: '2' }] },
      },
    });
    expect(result.practitionerSearchResultsCount).toEqual(2);
  });

  it('should set practitionerSearchResultsCount to 0 if the state.modal.practitionerMatches is an empty array', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: { practitionerMatches: [] },
      },
    });
    expect(result.practitionerSearchResultsCount).toEqual(0);
  });

  it('should not set practitionerSearchResultsCount if state.modal is an empty object', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: {},
      },
    });
    expect(result.practitionerSearchResultsCount).toBeUndefined();
  });

  it('should format respondent matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [], irsPractitioners: [{ userId: '1' }] },
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
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: { respondentMatches: [{ name: '1' }, { name: '2' }] },
      },
    });
    expect(result.respondentSearchResultsCount).toEqual(2);
  });

  it('should set respondentSearchResultsCount to 0 if the state.modal.respondentMatches is an empty array', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: { respondentMatches: [] },
      },
    });
    expect(result.respondentSearchResultsCount).toEqual(0);
  });

  it('should not set respondentSearchResultsCount if state.modal is an empty object', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { documents: [] },
        form: {},
        modal: {},
      },
    });
    expect(result.respondentSearchResultsCount).toBeUndefined();
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
          documents: [],
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
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
        caseDetail: { documents: [] },
        currentPage: 'CaseDetailInternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(false);
  });

  it('should not show petition processing alert if user is an external user and the petition is served', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [
            { documentType: 'Petition', servedAt: '2019-03-01T21:40:46.415Z' },
          ],
        },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(false);
  });

  it('should show petition processing alert if user is an external user and the petition is not served', () => {
    const user = {
      role: ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          documents: [{ documentType: 'Petition' }],
        },
        currentPage: 'CaseDetailExternal',
        form: {},
      },
    });
    expect(result.showPetitionProcessingAlert).toEqual(true);
  });
});
