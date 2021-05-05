import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removePetitionerCounselFromCaseAction } from './removePetitionerCounselFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removePetitionerCounselFromCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the success message of `Petitioner Counsel removed.`', async () => {
    const { output } = await runAction(removePetitionerCounselFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          privatePractitioners: [
            {
              barNumber: 'abc',
            },
          ],
        },
        form: {
          barNumber: 'abc',
        },
      },
    });

    expect(
      applicationContext.getUseCases().deleteCounselFromCaseInteractor,
    ).toBeCalled();
    expect(output.alertSuccess.message).toBe('Petitioner Counsel removed.');
    expect(output.docketNumber).toBe('101-20');
    expect(output.tab).toBe('caseInfo');
  });
});
