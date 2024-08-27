import { dashboardExternalHelper } from './dashboardExternalHelper';
import {
  docketClerk1User,
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('dashboardExternalHelper', () => {
  it('should show "what to expect" but not case list when there are no open or closed cases', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [],
        openCases: [],
        user: petitionerUser,
      },
    });
    expect(result.showPetitionWelcomePage).toEqual(true);
  });

  it('should show case list but not "what to expect" when there is an open or closed case case', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: petitionerUser,
      },
    });
    expect(result.showPetitionWelcomePage).toEqual(false);
  });

  it('should keep the showStartButton flag as false when the user role is irs practitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: irsPractitionerUser,
      },
    });

    expect(result.showStartButton).toEqual(false);
  });

  it('should set the showStartButton flag as true when the user role is a private practitioner or petitioner', () => {
    const userRoles = [petitionerUser, privatePractitionerUser];

    userRoles.forEach(user => {
      const result = runCompute(dashboardExternalHelper, {
        state: {
          closedCases: [{ something: true }],
          openCases: [{ something: true }],
          user,
        },
      });

      expect(result.showStartButton).toEqual(true);
    });
  });

  it('should set the showFilingFee to true when the user is a private practitioner or petitioner', () => {
    const userRoles = [petitionerUser, privatePractitionerUser];

    userRoles.forEach(user => {
      const result = runCompute(dashboardExternalHelper, {
        state: {
          closedCases: [{ something: true }],
          openCases: [{ something: true }],
          user,
        },
      });

      expect(result.showFilingFee).toEqual(true);
    });
  });

  it('should set the showFilingFee to false when the user is NOT a private practitioner or petitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: docketClerk1User,
      },
    });

    expect(result.showFilingFee).toEqual(false);
  });

  it('should set the return welcome message for private practitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        user: privatePractitionerUser,
      },
    });

    expect(result.welcomeMessageTitle).toEqual(
      'Do you need access to an existing case?',
    );
    expect(result.welcomeMessage).toEqual(
      'Search for the case docket number to file the appropriate document.',
    );
  });

  it('should set the return welcome message for petitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        user: petitionerUser,
      },
    });

    expect(result.welcomeMessageTitle).toEqual(
      'Have you already filed a petition by mail or do you want electronic access to your existing case?',
    );
    expect(result.welcomeMessage).toContain(
      'Do not start a new case. Email <a href="mailto:dawson.support@ustaxcourt.gov"> dawson.support@ustaxcourt.gov </a> with your case\'s docket number (e.g. 12345-67) to get access to your existing case.',
    );
  });
});
