import { CerebralTest } from 'cerebral/test';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = {
  getUseCases: () => ({
    getCaseInteractor: async () => {},
    sendPetitionToIRSHoldingQueueInteractor: async () => null,
  }),
};

presenter.providers.router = {
  route: async () => null,
};

test = CerebralTest(presenter);

describe('submitPetitionToIRSHoldingQueueSequence', () => {
  it('resets showModal back to an empty string', async () => {
    test.setState('showModal', 'SomeModal');
    await test.runSequence('submitPetitionToIRSHoldingQueueSequence', {});
    expect(test.getState('showModal')).toEqual('');
  });
});
