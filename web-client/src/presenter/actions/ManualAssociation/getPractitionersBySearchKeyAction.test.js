import { getPractitionersBySearchKeyAction } from './getPractitionersBySearchKeyAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let getPractitionersBySearchKeyInteractorStub;

describe('getPractitionersBySearchKeyAction', () => {
  beforeEach(() => {
    getPractitionersBySearchKeyInteractorStub = sinon.stub().resolves([
      {
        name: 'Test Practitioner',
        userId: '345',
      },
    ]);

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getPractitionersBySearchKeyInteractor: getPractitionersBySearchKeyInteractorStub,
      }),
    };
  });

  it('call the use case to get the matching practitioners', async () => {
    await runAction(getPractitionersBySearchKeyAction, {
      modules: {
        presenter,
      },
      state: { form: { practitionerSearch: 'Test Practitioner' } },
    });
    expect(getPractitionersBySearchKeyInteractorStub.calledOnce).toEqual(true);
    expect(
      getPractitionersBySearchKeyInteractorStub.getCall(0).args[0].searchKey,
    ).toEqual('Test Practitioner');
  });
});
