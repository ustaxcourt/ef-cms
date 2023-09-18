import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDetailPractitionerSearchHelper as caseDetailPractitionerSearchHelperComputed } from './caseDetailPractitionerSearchHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseDetailPractitionerSearchHelper = withAppContextDecorator(
  caseDetailPractitionerSearchHelperComputed,
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

describe('caseDetailPractitionerSearchHelper', () => {
  it('should format practitioner matches with cityStateZip string and isAlreadyInCase boolean', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: {
          docketEntries: [],
          privatePractitioners: [{ userId: '2' }],
        },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [], irsPractitioners: [{ userId: '1' }] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
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
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: {},
      },
    });
    expect(result.respondentSearchResultsCount).toBeUndefined();
  });

  it('should return showMultiplePractitioners true and showOnePractitioner false if practitioner search results count is greater than one', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: { practitionerMatches: [{ name: '1' }, { name: '2' }] },
      },
    });

    expect(result.showMultiplePractitioners).toEqual(true);
    expect(result.showOnePractitioner).toEqual(false);
  });

  it('should return showOnePractitioner true and showMultiplePractitioners false if practitioner search results count is only one', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: { practitionerMatches: [{ name: '1' }] },
      },
    });

    expect(result.showOnePractitioner).toEqual(true);
    expect(result.showMultiplePractitioners).toEqual(false);
  });

  it('should return showOnePractitioner false and showMultiplePractitioners false if there are no practitioner search results', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: {},
      },
    });

    expect(result.showOnePractitioner).toEqual(false);
    expect(result.showMultiplePractitioners).toEqual(false);
  });

  it('should return showMultipleRespondents true and showOneRespondent false if respondent search results count is greater than one', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: { respondentMatches: [{ name: '1' }, { name: '2' }] },
      },
    });

    expect(result.showMultipleRespondents).toEqual(true);
    expect(result.showOneRespondent).toEqual(false);
  });

  it('should return showOneRespondent true and showMultipleRespondents false if respondent search results count is only one', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: { respondentMatches: [{ name: '1' }] },
      },
    });

    expect(result.showOneRespondent).toEqual(true);
    expect(result.showMultipleRespondents).toEqual(false);
  });

  it('should return showOneRespondent false and showMultipleRespondents false if there are no respondent search results', () => {
    const user = {
      role: ROLES.privatePractitioner,
      userId: '123',
    };
    const result = runCompute(caseDetailPractitionerSearchHelper, {
      state: {
        ...getBaseState(user),
        caseDetail: { docketEntries: [] },
        form: {},
        modal: {},
      },
    });

    expect(result.showOneRespondent).toEqual(false);
    expect(result.showMultipleRespondents).toEqual(false);
  });
});
