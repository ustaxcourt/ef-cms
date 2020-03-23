import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitEditIrsPractitionersModalAction } from './submitEditIrsPractitionersModalAction';

describe('submitEditIrsPractitionersModalAction', () => {
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
          caseId: '123',
        },
        modal: form,
      },
    });

    expect(deleteCounselFromCaseInteractorStub.mock.calls.length).toEqual(1);
    expect(deleteCounselFromCaseInteractorStub.mock.calls[0][0]).toMatchObject({
      caseId: '123',
      userIdToDelete: '2',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });
});
