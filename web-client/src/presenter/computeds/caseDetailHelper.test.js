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
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ userId: '123' }] },
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
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [] },
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
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ userId: '123' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: true },
      },
    });
    expect(result.userHasAccessToCase).toEqual(true);
  });

  it('should set userHasAccessToCase to false if user role is practitioner and the practitioner is not associated with the case', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ userId: '234' }] },
        currentPage: 'CaseDetail',
        form: {},
        screenMetadata: { isAssociated: false },
      },
    });
    expect(result.userHasAccessToCase).toEqual(false);
  });

  it('should set userHasAccessToCase and showFileDocumentButton to true if user role is respondent and the respondent is associated with the case', () => {
    const user = {
      role: User.ROLES.respondent,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ userId: '789' }] },
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
      role: User.ROLES.respondent,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ userId: '123' }] },
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
      role: User.ROLES.respondent,
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

  it('should show add docket entry button if current page is CaseDetailInternal and user role is docketclerk', () => {
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
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(true);
  });

  it('should not show add docket entry button if current page is not CaseDetailInternal or user role is not docketclerk', () => {
    const user = {
      role: User.ROLES.docketClerk,
      userId: '789',
    };
    let result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(false);

    result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
        user: {
          role: User.ROLES.petitioner,
          userId: '789',
        },
      },
    });
    expect(result.showAddDocketEntryButton).toEqual(false);
  });

  it('should show payment record and not payment options if case is paid', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { payGovId: '123' },
        currentPage: 'CaseDetail',
        form: {},
      },
    });
    expect(result.showPaymentRecord).toEqual(true);
    expect(result.showPaymentOptions).toEqual(false);
  });

  it('should not show payment record and show payment options if case is not paid', () => {
    const user = {
      role: User.ROLES.petitioner,
      userId: '789',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {},
        currentPage: 'CaseDetail',
        form: {},
      },
    });
    expect(result.showPaymentRecord).toBeUndefined();
    expect(result.showPaymentOptions).toEqual(true);
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
      role: User.ROLES.respondent,
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

  it('should show practitioner section if user is an external user and there are practitioners on the case', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ name: 'Test Practitioner' }] },
        form: {},
      },
    });
    expect(result.showPractitionerSection).toEqual(true);
  });

  it('should not show practitioner section if user is an external user and there are no practitioners on the case', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [] },
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

  it('should show respondent section if user is an external user and there are respondents on the case', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ name: 'Test Respondents' }] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(true);
  });

  it('should not show respondent section if user is an external user and there are no respondents on the case', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [] },
        form: {},
      },
    });
    expect(result.showRespondentSection).toEqual(false);
  });

  it('should format practitioner matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { practitioners: [{ userId: '2' }] },
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
      role: User.ROLES.practitioner,
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
      role: User.ROLES.practitioner,
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
      role: User.ROLES.practitioner,
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
      role: User.ROLES.practitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { respondents: [{ userId: '1' }] },
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
      role: User.ROLES.practitioner,
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
      role: User.ROLES.practitioner,
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
      role: User.ROLES.practitioner,
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

  describe('hasOrders', () => {
    it('should signify a given case has orders (hasOrders=TRUE) if any of the order-related props are true', () => {
      const user = {
        role: User.ROLES.practitioner,
        userId: '123',
      };
      const result = runCompute(caseDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            noticeOfAttachments: true,
            orderDesignatingPlaceOfTrial: true,
            orderForAmendedPetition: true,
            orderForAmendedPetitionAndFilingFee: true,
            orderForFilingFee: true,
            orderForOds: true,
            orderForRatification: true,
            orderToChangeDesignatedPlaceOfTrial: true,
            orderToShowCause: true,
          },
          form: {},
          modal: {},
        },
      });

      expect(result.hasOrders).toEqual(true);
    });

    it('should signify a given case does NOT have orders if all of the order-related props are false', () => {
      const user = {
        role: User.ROLES.practitioner,
        userId: '123',
      };
      const result = runCompute(caseDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
            noticeOfAttachments: false,
            orderDesignatingPlaceOfTrial: false,
            orderForAmendedPetition: false,
            orderForAmendedPetitionAndFilingFee: false,
            orderForFilingFee: false,
            orderForOds: false,
            orderForRatification: false,
            orderToChangeDesignatedPlaceOfTrial: false,
            orderToShowCause: false,
          },
          form: {},
          modal: {},
        },
      });

      expect(result.hasOrders).toEqual(false);
    });

    it('should signify a given case has orders if one of the order-related props is true', () => {
      const user = {
        role: User.ROLES.practitioner,
        userId: '123',
      };
      const result = runCompute(caseDetailHelper, {
        state: {
          ...getBaseState(user),
          caseDetail: {
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

      expect(result.hasOrders).toEqual(true);
    });
  });

  it('should show empty state for consolidated cases', () => {
    const result = runCompute(caseDetailHelper, {
      state: {
        caseDetail: { consolidatedCases: [] },
      },
    });
    expect(result.hasNoConsolidatedCases).toEqual(true);
  });
});
