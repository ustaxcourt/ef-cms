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
  });

  it('calls the fetch interactor if practitionerDetail from state does not match the given bar number', async () => {
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
  });
});
