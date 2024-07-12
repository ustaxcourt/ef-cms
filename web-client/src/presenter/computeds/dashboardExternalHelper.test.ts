import { applicationContext } from '../../applicationContext';
import { dashboardExternalHelper as dashboardExternalHelperComputed } from './dashboardExternalHelper';
import {
  docketClerk1User,
  irsPractitionerUser,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('dashboardExternalHelper', () => {
  const dashboardExternalHelper = withAppContextDecorator(
    dashboardExternalHelperComputed,
    applicationContext,
  );

  it('should show "what to expect" but not case list when there are no open or closed cases', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [],
        openCases: [],
        user: petitionerUser,
      },
    });
    expect(result.showWhatToExpect).toEqual(true);
  });

  it('should show case list but not "what to expect" when there is an open or closed case case', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: petitionerUser,
      },
    });
    expect(result.showWhatToExpect).toEqual(false);
  });

  it('should keep the showFileACase flag as false when the user role is petitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: petitionerUser,
      },
    });

    expect(result.showFileACase).toEqual(false);
  });

  it('should set the showFileACase flag as true when the user role is a private practitioner', () => {
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
        user: privatePractitionerUser,
      },
    });

    expect(result.showFileACase).toEqual(true);
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
});
