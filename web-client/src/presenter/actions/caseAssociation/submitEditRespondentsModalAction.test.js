import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitEditRespondentsModalAction } from './submitEditRespondentsModalAction';
import sinon from 'sinon';

describe('submitEditRespondentsModalAction', () => {
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

  it('should call the delete use case for each respondent on the form with removeFromCase set to true and call the path.success when finished', async () => {
    const form = {
      respondents: [
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

    await runAction(submitEditRespondentsModalAction, {
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

    expect(deleteCounselFromCaseInteractorStub.calledOnce).toEqual(true);
    expect(
      deleteCounselFromCaseInteractorStub.getCall(0).args[0],
    ).toMatchObject({
      caseId: '123',
      userIdToDelete: '2',
    });
    expect(successStub.calledOnce).toEqual(true);
  });
});
