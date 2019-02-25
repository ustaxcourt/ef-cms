import { runAction } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';
import updatePartyTypeAction from './updatePartyTypeAction';

const updateCaseStub = sinon.stub().returns({});

presenter.providers.applicationContext = {
  getUseCases: () => ({
    updateCase: updateCaseStub,
  }),
};

xdescribe('updatePartyTypeAction', async () => {
  it('TODO', async () => {
    await runAction(updatePartyTypeAction, {
      state: {},
      modules: {
        presenter,
      },
      props: {},
    });
    // expect(updateCaseStub.getCall(0).args[0].caseToUpdate).toMatchObject({
    // });
  });
});
