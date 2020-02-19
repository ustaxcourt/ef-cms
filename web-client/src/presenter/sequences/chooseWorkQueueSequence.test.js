import { CerebralTest } from 'cerebral/test';
import { User } from '../../../../shared/src/business/entities/User';
import { presenter } from '../presenter';
import sinon from 'sinon';

let test;
const setCurrentUserStub = sinon.stub().returns({ section: 'petitions' });
const getInboxMessagesForSectionStub = sinon
  .stub()
  .returns([{ document: { isFileAttached: true }, isQC: false }]);
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
    expect(getInboxMessagesForSectionStub.called).toBeTruthy();
  });
});
