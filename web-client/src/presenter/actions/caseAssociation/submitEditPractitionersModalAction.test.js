import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitEditPractitionersModalAction } from './submitEditPractitionersModalAction';
import sinon from 'sinon';

describe('submitEditPractitionersModalAction', () => {
  let deleteCounselFromCaseInteractorStub;
  let updateCounselOnCaseInteractorStub;
  let successStub;

  beforeEach(() => {
    deleteCounselFromCaseInteractorStub = sinon.stub();
    updateCounselOnCaseInteractorStub = sinon.stub();
    successStub = sinon.stub();

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
      practitioners: [
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

    await runAction(submitEditPractitionersModalAction, {
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

    expect(updateCounselOnCaseInteractorStub.calledTwice).toEqual(true);
    expect(deleteCounselFromCaseInteractorStub.calledOnce).toEqual(true);
    expect(updateCounselOnCaseInteractorStub.getCall(0).args[0]).toMatchObject({
      caseId: '123',
      userData: {
        representingPrimary: true,
        representingSecondary: false,
        userId: '1',
      },
      userIdToUpdate: '1',
    });
    expect(
      deleteCounselFromCaseInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      caseId: '123',
      userIdToDelete: '2',
    });
    expect(updateCounselOnCaseInteractorStub.getCall(1).args[0]).toMatchObject({
      caseId: '123',
      userData: {
        removeFromCase: false,
        representingSecondary: true,
        userId: '3',
      },
      userIdToUpdate: '3',
    });
    expect(successStub.calledOnce).toEqual(true);
  });
});
