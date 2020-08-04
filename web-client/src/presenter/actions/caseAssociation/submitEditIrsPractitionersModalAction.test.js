import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditIrsPractitionersModalAction } from './submitEditIrsPractitionersModalAction';

describe('submitEditIrsPractitionersModalAction', () => {
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
      irsPractitioners: [
        {
          userId: '1',
        },
        {
          removeFromCase: true,
          userId: '2',
        },
        {
          removeFromCase: false,
          userId: '3',
        },
      ],
    };

    await runAction(submitEditIrsPractitionersModalAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: '123-20',
        },
        modal: form,
      },
    });

    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls[0],
    ).toMatchObject(
      [
        {
          docketNumber: '123-20',
          userData: { userId: '1' },
          userId: '1',
        },
      ],
      [
        {
          docketNumber: '123-20',
          userData: { userId: '3' },
          userId: '3',
        },
      ],
    );
    expect(
      applicationContextForClient.getUseCases().deleteCounselFromCaseInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContextForClient.getUseCases().deleteCounselFromCaseInteractor
        .mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-20',
      userId: '2',
    });
    expect(successStub).toHaveBeenCalled();
  });
});
