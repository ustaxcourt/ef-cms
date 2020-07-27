import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitEditPrivatePractitionersModalAction } from './submitEditPrivatePractitionersModalAction';

describe('submitEditPrivatePractitionersModalAction', () => {
  let successStub;

  beforeAll(() => {
    successStub = jest.fn();

    presenter.providers.applicationContext = applicationContextForClient;
    presenter.providers.path = {
      success: successStub,
    };
  });

  it('should call the appropriate update and delete use cases for each practitioner on the form and call the path.success when finished', async () => {
    const form = {
      privatePractitioners: [
        {
          representingPrimary: true,
          representingSecondary: false,
          userId: '1',
        },
        {
          removeFromCase: true,
          representingPrimary: true,
          userId: '2',
        },
        {
          removeFromCase: false,
          representingSecondary: true,
          userId: '3',
        },
      ],
    };

    await runAction(submitEditPrivatePractitionersModalAction, {
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
      applicationContextForClient.getUseCases().deleteCounselFromCaseInteractor
        .mock.calls.length,
    ).toEqual(1);
    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-20',
      userData: {
        representingPrimary: true,
        representingSecondary: false,
        userId: '1',
      },
      userId: '1',
    });
    expect(
      applicationContextForClient.getUseCases().deleteCounselFromCaseInteractor
        .mock.calls[0][0],
    ).toMatchObject({
      docketNumber: '123-20',
      userId: '2',
    });
    expect(
      applicationContextForClient.getUseCases().updateCounselOnCaseInteractor
        .mock.calls[1][0],
    ).toMatchObject({
      docketNumber: '123-20',
      userData: {
        removeFromCase: false,
        representingSecondary: true,
        userId: '3',
      },
      userId: '3',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
