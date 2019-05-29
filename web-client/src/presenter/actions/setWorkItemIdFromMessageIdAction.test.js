import { runAction } from 'cerebral/test';
import { setWorkItemIdFromMessageIdAction } from './setWorkItemIdFromMessageIdAction';

describe('setWorkItemIdFromMessageIdAction', () => {
  it('sets workItemId from messageId if it exists', async () => {
    const result = await runAction(setWorkItemIdFromMessageIdAction, {
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  messages: [
                    {
                      messageId: 1,
                    },
                  ],
                  workItemId: 5,
                },
              ],
            },
          ],
        },
        messageId: 1,
      },
    });

    expect(result.state.workItemId).toEqual(5);
  });

  it('does not set workItemId if message does not exist in workItem', async () => {
    const result = await runAction(setWorkItemIdFromMessageIdAction, {
      state: {
        caseDetail: {
          documents: [
            {
              workItems: [
                {
                  messages: [
                    {
                      messageId: 2,
                    },
                  ],
                  workItemId: 5,
                },
              ],
            },
          ],
        },
        messageId: 1,
      },
    });

    expect(result.state.workItemId).toBeUndefined();
  });
});
