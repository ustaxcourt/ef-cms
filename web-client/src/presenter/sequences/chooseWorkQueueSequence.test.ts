import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { docketClerk1User } from '@shared/test/mockUsers';
import { presenter } from '../presenter-mock';

describe('chooseWorkQueueSequence', () => {
  let cerebralTest;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getDocumentQCInboxForSectionInteractor.mockReturnValue([
        { docketEntry: { isFileAttached: true } },
      ]);
    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({});
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      chooseWorkQueueSequence,
    };
    cerebralTest = CerebralTest(presenter);
    cerebralTest.setState('user', docketClerk1User);
  });

  it('should set the workQueueToDisplay to match the props passed in', async () => {
    cerebralTest.setState('workQueueToDisplay', null);
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workItems: [],
    });
    expect(cerebralTest.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
    });
    expect(
      applicationContext.getUseCases().getDocumentQCInboxForSectionInteractor,
    ).toHaveBeenCalled();
  });
});
