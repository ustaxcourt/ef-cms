import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitEditPrivatePractitionersModalAction } from './submitEditPrivatePractitionersModalAction';

describe('submitEditPrivatePractitionersModalAction', () => {
  let deleteCounselFromCaseInteractorStub;
  let updateCounselOnCaseInteractorStub;
  let successStub;

  beforeEach(() => {
    deleteCounselFromCaseInteractorStub = jest.fn();
    updateCounselOnCaseInteractorStub = jest.fn();
    successStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        deleteCounselFromCaseInteractor: deleteCounselFromCaseInteractorStub,
        updateCounselOnCaseInteractor: updateCounselOnCaseInteractorStub,
      }),
    };

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
          caseId: '123',
        },
        modal: form,
      },
    });

    expect(updateCounselOnCaseInteractorStub.mock.calls.length).toEqual(2);
    expect(deleteCounselFromCaseInteractorStub.mock.calls.length).toEqual(1);
    expect(updateCounselOnCaseInteractorStub.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      userData: {
        representingPrimary: true,
        representingSecondary: false,
        userId: '1',
      },
      userIdToUpdate: '1',
    });
    expect(deleteCounselFromCaseInteractorStub.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      userIdToDelete: '2',
    });
    expect(updateCounselOnCaseInteractorStub.mock.calls[1][0]).toMatchObject({
      caseId: '123',
      userData: {
        removeFromCase: false,
        representingSecondary: true,
        userId: '3',
      },
      userIdToUpdate: '3',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
