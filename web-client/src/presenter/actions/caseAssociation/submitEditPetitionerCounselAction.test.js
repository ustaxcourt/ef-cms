import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditPetitionerCounselAction } from './submitEditPetitionerCounselAction';

describe('submitEditPetitionerCounselAction', () => {
  let successStub;

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should call the appropriate update use case the practitioner on the form and call the path.success when finished', async () => {
    const form = {
      representingPrimary: true,
      representingSecondary: false,
      userId: '1',
    };

    await runAction(submitEditPetitionerCounselAction, {
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
      userData: {
        representingPrimary: true,
        representingSecondary: false,
        userId: '1',
      },
      userId: '1',
    });
    expect(successStub).toBeCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      alertSuccess: {
        message: 'Petitioner counsel updated.',
      },
    });
  });
});
