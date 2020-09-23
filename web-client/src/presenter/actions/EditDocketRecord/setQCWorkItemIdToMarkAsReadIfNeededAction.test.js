import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setQCWorkItemIdToMarkAsReadIfNeededAction } from './setQCWorkItemIdToMarkAsReadIfNeededAction';

presenter.providers.applicationContext = applicationContextForClient;

describe('setQCWorkItemIdToMarkAsReadIfNeededAction', () => {
  it('sets the workItemIdToMarkAsRead for an unread qc work item', async () => {
    const result = await runAction(setQCWorkItemIdToMarkAsReadIfNeededAction, {
      props: {
        documentId: '123-abc-123-abc',
      },
      state: {
        caseDetail: {
          docketEntries: [
            {
              documentId: '123-abc-123-abc',
              lodged: true,
              workItem: { isRead: false, workItemId: 'ThisIsAnId' },
            },
            { documentId: '321-cba-321-cba' },
          ],
          docketNumber: '123-45',
        },
        form: {},
      },
    });

    expect(result.output.workItemIdToMarkAsRead).toEqual('ThisIsAnId');
  });
});
