import { getRespondentsBySearchKeyAction } from './getRespondentsBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getRespondentsBySearchKeyInteractorStub;

describe('getRespondentsBySearchKeyAction', () => {
  beforeEach(() => {
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
  });

  it('call the use case to get the matching respondents', async () => {
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
  });
});
