import { CerebralTest } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('switchWorkQueueSequence', async () => {
  it('should set the workQueueToDisplay to match the props passed in', async () => {
    test.setState('workQueueToDisplay', null);
    await test.runSequence('switchWorkQueueSequence', {
      workQueueToDisplay: 'Work Queue',
    });
    expect(test.getState('workQueueToDisplay')).toEqual('Work Queue');
  });
});
