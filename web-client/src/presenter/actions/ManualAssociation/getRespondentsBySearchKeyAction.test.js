import { getRespondentsBySearchKeyAction } from './getRespondentsBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getRespondentsBySearchKeyInteractorStub;

describe('getRespondentsBySearchKeyAction', () => {
  let successStub, errorStub;

  beforeEach(() => {
    successStub = sinon.stub();
    errorStub = sinon.stub();

    getRespondentsBySearchKeyInteractorStub = sinon.stub().resolves([
      {
        name: 'Test Respondent',
        userId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getRespondentsBySearchKeyInteractor: getRespondentsBySearchKeyInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('calls the use case to get the matching irsPractitioners and calls the success path if irsPractitioners are returned', async () => {
    await runAction(getRespondentsBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { respondentSearch: 'Test Respondent' } },
    });
    expect(getRespondentsBySearchKeyInteractorStub.calledOnce).toEqual(true);
    expect(
      getRespondentsBySearchKeyInteractorStub.getCall(0).args[0].searchKey,
    ).toEqual('Test Respondent');
    expect(successStub.calledOnce).toEqual(true);
    expect(errorStub.calledOnce).toEqual(false);
  });

  it('calls the use case to get the matching irsPractitioners and calls the error path if no irsPractitioners are returned', async () => {
    getRespondentsBySearchKeyInteractorStub = sinon.stub().resolves([]);

    await runAction(getRespondentsBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { respondentSearch: 'Test Respondent2' } },
    });
    expect(getRespondentsBySearchKeyInteractorStub.calledOnce).toEqual(true);
    expect(
      getRespondentsBySearchKeyInteractorStub.getCall(0).args[0].searchKey,
    ).toEqual('Test Respondent2');
    expect(successStub.calledOnce).toEqual(false);
    expect(errorStub.calledOnce).toEqual(true);
  });
});
