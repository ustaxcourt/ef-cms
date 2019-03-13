import { CerebralTest } from 'cerebral/test';

import presenter from '..';
import sinon from 'sinon';

let test;
const setCurrentUserStub = sinon.stub().returns({ section: 'petitions' });
const getWorkItemsBySectionStub = sinon.stub().returns({});
presenter.providers.applicationContext = {
  getCurrentUser: setCurrentUserStub,
  getUseCases: () => ({
    getWorkItemsBySection: getWorkItemsBySectionStub,
  }),
  setCurrentUser: setCurrentUserStub,
};
test = CerebralTest(presenter);

describe('chooseWorkQueueSequence', async () => {
  it('should set the workQueueToDisplay to match the props passed in', async () => {
    test.setState('workQueueToDisplay', null);
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
    });
    expect(getWorkItemsBySectionStub.called).toBeTruthy();
  });
});
