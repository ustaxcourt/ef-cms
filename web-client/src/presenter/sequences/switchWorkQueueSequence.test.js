import { CerebralTest } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';

let test;
const setCurrentUserStub = sinon.stub().returns({ section: 'petitions' });
const getWorkItemsBySectionStub = sinon.stub().returns({});
presenter.providers.applicationContext = {
  setCurrentUser: setCurrentUserStub,
  getCurrentUser: setCurrentUserStub,
  getUseCases: () => ({
    getWorkItemsBySection: getWorkItemsBySectionStub,
  }),
};
test = CerebralTest(presenter);

describe('switchWorkQueueSequence', async () => {
  it('should set the workQueueToDisplay to match the props passed in', async () => {
    test.setState('workQueueToDisplay', null);
    await test.runSequence('switchWorkQueueSequence', {
      queue: 'section',
      box: 'inbox',
    });
    expect(test.getState('workQueueToDisplay')).toEqual({
      queue: 'section',
      box: 'inbox',
    });
    expect(getWorkItemsBySectionStub.called).toBeTruthy();
  });
});
