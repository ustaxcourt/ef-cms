import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditRespondentCounselAction } from './submitEditRespondentCounselAction';

describe('submitEditRespondentCounselAction', () => {
  let successStub;

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should call the delete use case for each respondent on the form with removeFromCase set to true and call the path.success when finished', async () => {
    const form = {
      contact: {
        name: 'Guy Fieri',
      },
      userId: '1',
    };

    await runAction(submitEditRespondentCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        form,
      },
    });

    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls[0][1],
    ).toMatchObject({
      docketNumber: '123-20',
      userData: { userId: '1' },
      userId: '1',
    });
    expect(successStub).toHaveBeenCalled();
  });
});
