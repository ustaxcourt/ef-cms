import { clearFormAssigneeIdAction } from './clearFormAssigneeIdAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearFormAssigneeIdAction', () => {
  it('should set the value of state.<form>.assigneeId to an empty string', async () => {
    const result = await Promise.resolve(
      runAction(clearFormAssigneeIdAction, {
        props: { form: 'testForm' },
        state: {
          testForm: {
            assigneeId: 'abc-123',
          },
        },
      }),
    );

    expect(result.state).toHaveProperty(['testForm', 'assigneeId'], '');
  });
});
