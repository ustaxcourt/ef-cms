import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getPractitionerDetailAction } from './getPractitionerDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPractitionerDetailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getPractitionerByBarNumberInteractor.mockImplementation(
        (_applicationContext, { barNumber }) => ({
          barNumber,
        }),
      );

    applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor.mockImplementation(() => {
        return {
          closedCases: [],
          openCases: [],
        };
      });
  });

  it('calls the correct interactors for an external user when practitionerDetail from state does not match the given bar number', async () => {
    const result = await runAction(getPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        barNumber: 'AA5678',
      },
      state: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
        user: {
          role: ROLES.irsPractitioner,
        },
      },
    });

    expect(result.output).toEqual({
      practitionerDetail: {
        barNumber: 'AA5678',
      },
    });
    expect(
      applicationContext.getUseCases().getPractitionerByBarNumberInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getPractitionerCasesInteractor.mock.calls
        .length,
    ).toEqual(0);
  });

  it('calls the correct interactors for an internal user when practitionerDetail from state does not match the given bar number', async () => {
    const result = await runAction(getPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        barNumber: 'AA5678',
      },
      state: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
        user: {
          role: ROLES.admissionsClerk,
        },
      },
    });

    expect(result.output).toEqual({
      practitionerDetail: {
        barNumber: 'AA5678',
        closedCaseInfo: {
          allCases: [],
          currentPage: 0,
        },
        openCaseInfo: {
          allCases: [],
          currentPage: 0,
        },
      },
    });
    expect(
      applicationContext.getUseCases().getPractitionerByBarNumberInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getPractitionerByBarNumberInteractor.mock
        .calls.length,
    ).toEqual(1);
  });
});
