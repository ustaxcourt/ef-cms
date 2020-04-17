import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionerDetailAction } from './getPractitionerDetailAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getPractitionerDetailAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getPractitionerByBarNumberInteractor.mockImplementation(
        ({ barNumber }) => ({
          barNumber,
        }),
      );
  });

  it('returns practitionerDetail from state for the given bar number if it exists and does not call the fetch interactor', async () => {
    const result = await runAction(getPractitionerDetailAction, {
      modules: {
        presenter,
      },
      props: {
        barNumber: 'PD1234',
      },
      state: {
        practitionerDetail: {
          barNumber: 'PD1234',
        },
      },
    });

    expect(result.output).toEqual({
      practitionerDetail: {
        barNumber: 'PD1234',
      },
    });
    expect(
      applicationContext.getUseCases().getPractitionerByBarNumberInteractor.mock
        .calls.length,
    ).toEqual(0);
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
