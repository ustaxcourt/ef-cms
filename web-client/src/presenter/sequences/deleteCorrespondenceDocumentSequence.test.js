import { CerebralTest } from 'cerebral/test';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteCorrespondenceDocumentSequence } from './deleteCorrespondenceDocumentSequence';
import { presenter } from '../presenter-mock';

describe('deleteCorrespondenceDocumentSequence', () => {
  const mockCorrespondence1 = {
    correspondenceId: '1234',
    documentTitle: 'a lovely correspondence',
  };
  const mockCorrespondence2 = {
    correspondenceId: '2345',
    documentTitle: 'a lovely second correspondence',
  };

  let test;

  beforeAll(() => {
    //state has case with 2 correspondi, delete first one, expect 2nd one to be in the viewer

    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      deleteCorrespondenceDocumentSequence,
    };
    test = CerebralTest(presenter);

    applicationContext
      .getUseCases()
      .getNotificationsInteractor.mockReturnValue({
        userInboxCount: mockUserInboxCount,
        userSectionCount: mockUserSectionCount,
      });

    applicationContext
      .getUseCases()
      .getInboxMessagesForUserInteractor.mockReturnValue(mockMessages);
  });

  it('should change the page to CaseDetail and close the opened menu', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      correspondences: [mockCorrespondence1, mockCorrespondence2],
    };

    const modal = {
      correspondenceToDelete: {
        correspondenceId: mockCorrespondence1.correspondenceId,
      },
    };

    test.setState('caseDetail', caseDetail);
    test.setState('modal', modal);

    await test.runSequence('deleteCorrespondenceDocumentSequence');

    expect(test.getState()).toMatchObject({
      messages: mockMessages,
      messagesInboxCount: mockUserInboxCount,
      messagesSectionCount: mockUserSectionCount,
      notifications: {
        userInboxCount: mockUserInboxCount,
        userSectionCount: mockUserSectionCount,
      },
    });
  });
});
