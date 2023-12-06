import { runAction } from '@web-client/presenter/test.cerebral';
import { setAssigneeIdAction } from './setAssigneeIdAction';

describe('setAssigneeIdAction', () => {
  it('sets state.assigneeId and state.assigneeName from props', async () => {
    const { state } = await runAction(setAssigneeIdAction, {
      props: {
        assigneeId: '123',
        assigneeName: 'Test Assignee',
      },
    });

    expect(state.assigneeId).toEqual('123');
    expect(state.assigneeName).toEqual('Test Assignee');
  });
});
