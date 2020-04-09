import { CerebralTest } from 'cerebral/test';
import { User } from '../../../../shared/src/business/entities/User';
import { presenter } from '../presenter';

let test;
const setCurrentUserStub = jest.fn().mockReturnValue({ section: 'petitions' });
const getInboxMessagesForSectionStub = jest
  .fn()
  .mockReturnValue([{ document: { isFileAttached: true }, isQC: false }]);
presenter.providers.applicationContext = {
  getConstants: () => ({ USER_ROLES: User.ROLES }),
  getCurrentUser: setCurrentUserStub,
  getUniqueId: () => new Date().getTime(),
  getUseCases: () => ({
    getInboxMessagesForSectionInteractor: getInboxMessagesForSectionStub,
    getJudgeForUserChambersInteractor: () => null,
    getNotificationsInteractor: () => {
      return {};
    },
  }),
  setCurrentUser: setCurrentUserStub,
};
test = CerebralTest(presenter);

describe('chooseWorkQueueSequence', () => {
  it('should set the workQueueToDisplay to match the props passed in', async () => {
    test.setState('workQueueToDisplay', null);
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: true,
    });
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: true,
    });
    expect(getInboxMessagesForSectionStub).toBeCalled();
  });
});
