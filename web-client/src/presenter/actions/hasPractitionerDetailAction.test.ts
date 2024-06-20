import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { hasPractitionerDetailAction } from './hasPractitionerDetailAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('hasPractitionerDetailAction', () => {
  const presenter = {
    providers: {
      applicationContext: undefined as unknown as any,
      path: undefined as unknown as any,
    },
  };

  beforeAll(() => {
    applicationContext.isPublicUser = jest.fn().mockImplementation(() => false);
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      navigateToPractitionerDetails: jest.fn(),
      setResultsInState: jest.fn(),
    };
  });

  it('calls the "navigateToPractitionerDetails" function when a (non-empty) practitionerDetail object exists on props', async () => {
    await runAction(hasPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
    });

    expect(
      presenter.providers.path.navigateToPractitionerDetails,
    ).toHaveBeenCalled();
  });

  it('calls the "setResultsInState function when no practitionerDetail object exists on props', async () => {
    await runAction(hasPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {},
    });

    expect(presenter.providers.path.setResultsInState).toHaveBeenCalled();
  });

  it('calls the "setResultsInState" function when a public user get results back', async () => {
    applicationContext.isPublicUser = jest.fn().mockImplementation(() => true);

    await runAction(hasPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
    });

    const setResultsInStateCalls =
      presenter.providers.path.setResultsInState.mock.calls;
    expect(setResultsInStateCalls.length).toEqual(1);
    expect(setResultsInStateCalls[0][0].searchResults).toEqual({
      practitioners: { barNumber: 'PD1234' },
      total: 1,
    });
  });
});
