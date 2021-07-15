import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { chooseWorkQueueSequence } from '../sequences/chooseWorkQueueSequence';
import { presenter } from '../presenter-mock';

describe('chooseWorkQueueSequence', () => {
  const { PETITIONS_SECTION } = applicationContext.getConstants();
  let cerebralTest;

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      section: PETITIONS_SECTION,
    });
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
    ).toBeCalled();
  });
});
