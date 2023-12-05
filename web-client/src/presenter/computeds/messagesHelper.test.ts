import { DOCKET_SECTION } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  caseServicesSupervisorUser,
  docketClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { messagesHelper as messagesHelperComputed } from './messagesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('messagesHelper', () => {
  let user;

  const messagesHelper = withAppContextDecorator(messagesHelperComputed, {
    ...applicationContext,
    getCurrentUser: () => {
      return user;
    },
  });

  beforeEach(() => {
    user = docketClerkUser;
  });

  it('should set showIndividualMessages true and showSectionMessages false if messageBoxToDisplay.queue is my', () => {
    const result = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });
    expect(result.showIndividualMessages).toBeTruthy();
    expect(result.showSectionMessages).toBeFalsy();
  });

  it('should set showIndividualMessages false and showSectionMessages true if messageBoxToDisplay.queue is section', () => {
    const result = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
        },
      },
    });
    expect(result.showIndividualMessages).toBeFalsy();
    expect(result.showSectionMessages).toBeTruthy();
  });

  it('should set messagesTitle to the current message box being displayed', () => {
    let result = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });

    expect(result.messagesTitle).toEqual('My Messages');

    result = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
        },
      },
    });

    expect(result.messagesTitle).toEqual('Section Messages');
  });

  it('should set messagesTitle to a capitalized section specific title if messageBoxToDisplay.section exists', () => {
    let result = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
          section: DOCKET_SECTION,
        },
      },
    });

    expect(result.messagesTitle).toEqual('Docket Section Messages');
  });

  describe('inbox count', () => {
    it("should return individual inbox count if the message box is the user's", () => {
      const result = runCompute(messagesHelper, {
        state: {
          messageBoxToDisplay: {
            queue: 'my',
          },
          messagesInboxCount: 5,
          messagesSectionCount: 3,
        },
      });

      expect(result.inboxCount).toEqual(5);
    });

    it("should return section inbox count if the message box is the user's section", () => {
      const result = runCompute(messagesHelper, {
        state: {
          messageBoxToDisplay: {
            queue: 'section',
          },
          messagesInboxCount: 5,
          messagesSectionCount: 3,
        },
      });

      expect(result.inboxCount).toEqual(3);
    });
  });

  it('should return false for showSectionMessages when the current user is a Case Services Supervisor', () => {
    user = caseServicesSupervisorUser;

    const { showSectionMessages } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
        },
      },
    });

    expect(showSectionMessages).toBe(false);
  });

  it('should return true for showSwitchToMyMessagesButton when the current user is NOT a Case Services Supervisor', () => {
    user = docketClerkUser;

    const { showSwitchToMyMessagesButton } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
        },
      },
    });

    expect(showSwitchToMyMessagesButton).toBe(true);
  });

  it('should return true for showSwitchToSectionMessagesButton when the current user is NOT a Case Services Supervisor', () => {
    user = docketClerkUser;

    const { showSwitchToSectionMessagesButton } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });

    expect(showSwitchToSectionMessagesButton).toBe(true);
  });

  it('should return false for showSwitchToSectionMessagesButton when the current user is a Case Services Supervisor', () => {
    user = caseServicesSupervisorUser;

    const { showSwitchToSectionMessagesButton } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'section',
        },
      },
    });

    expect(showSwitchToSectionMessagesButton).toBe(false);
  });

  it('should return false for showSwitchToMyMessagesButton when the current user is a Case Services Supervisor', () => {
    user = caseServicesSupervisorUser;

    const { showSwitchToMyMessagesButton } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });

    expect(showSwitchToMyMessagesButton).toBe(false);
  });

  it('should return true for showSectionMessages when the current user is a Case Services Supervisor and messageBoxToDisplay.section is defined', () => {
    user = caseServicesSupervisorUser;

    const { showSectionMessages } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
          section: DOCKET_SECTION,
        },
      },
    });

    expect(showSectionMessages).toBe(true);
  });

  it('should return false for showSectionMessages when the current user is a Case Services Supervisor and messageBoxToDisplay.section is undefined', () => {
    user = caseServicesSupervisorUser;

    const { showSectionMessages } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });

    expect(showSectionMessages).toBe(false);
  });

  it('should return false for showIndividualMessages when the current user is a Case Services Supervisor and messageBoxToDisplay.section is defined', () => {
    user = caseServicesSupervisorUser;

    const { showIndividualMessages } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
          section: DOCKET_SECTION,
        },
      },
    });

    expect(showIndividualMessages).toBe(false);
  });

  it('should return true for showIndividualMessages when the current user is a Case Services Supervisor and messageBoxToDisplay.section is undefined', () => {
    user = caseServicesSupervisorUser;

    const { showIndividualMessages } = runCompute(messagesHelper, {
      state: {
        messageBoxToDisplay: {
          queue: 'my',
        },
      },
    });

    expect(showIndividualMessages).toBe(true);
  });

  describe('messagesTabNavigationPath', () => {
    it('should construct a path based on the queue and box values passed in', () => {
      const { messagesTabNavigationPath } = runCompute(messagesHelper, {
        state: {
          messageBoxToDisplay: {
            queue: 'my',
          },
        },
      });

      expect(messagesTabNavigationPath({ box: 'outbox', queue: 'my' })).toEqual(
        '/messages/my/outbox',
      );
    });

    it('should construct a path based on the queue box, and section values when section is defined', () => {
      const { messagesTabNavigationPath } = runCompute(messagesHelper, {
        state: {
          messageBoxToDisplay: {
            queue: 'my',
            section: DOCKET_SECTION,
          },
        },
      });

      expect(
        messagesTabNavigationPath({
          box: 'outbox',
          queue: 'my',
          section: DOCKET_SECTION,
        }),
      ).toEqual('/messages/my/outbox/selectedSection?section=docket');
    });
  });
});
