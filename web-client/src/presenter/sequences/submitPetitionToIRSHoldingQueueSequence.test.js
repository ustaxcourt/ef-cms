import { CerebralTest } from 'cerebral/test';

import presenter from '..';

let test;
presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCase: async () => {},
    sendPetitionToIRSHoldingQueue: async () => null,
  }),
};

presenter.providers.router = {
  route: async () => null,
};

test = CerebralTest(presenter);

describe('submitPetitionToIRSHoldingQueueSequence', async () => {
  it('resets showModal back to an empty string', async () => {
    test.setState('showModal', 'SomeModal');
    await test.runSequence('submitPetitionToIRSHoldingQueueSequence', {});
    expect(test.getState('showModal')).toEqual('');
  });
});
