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
              userId: 'user-id-123',
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
    expect(
      applicationContext.getUseCases().deleteCounselFromCaseInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketNumber: '101-20',
      userId: 'user-id-123',
    });
    expect(output.alertSuccess.message).toBe('Respondent Counsel removed.');
    expect(output.docketNumber).toBe('101-20');
    expect(output.tab).toBe('caseInfo');
  });
});
