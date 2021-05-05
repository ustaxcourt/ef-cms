import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { removeRespondentCounselFromCaseAction } from './removeRespondentCounselFromCaseAction';
import { runAction } from 'cerebral/test';

describe('removeRespondentCounselFromCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set the success message of `Petitioner Counsel removed.`', async () => {
    const { output } = await runAction(removeRespondentCounselFromCaseAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '101-20',
          irsPractitioners: [
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
    expect(output.alertSuccess.message).toBe('Respondent Counsel removed.');
    expect(output.docketNumber).toBe('101-20');
    expect(output.tab).toBe('caseInfo');
  });
});
