import { runAction } from 'cerebral/test';
import { updateCaseMessageDetailsFromModalAction } from './updateCaseMessageDetailsFromModalAction';

describe('updateCaseMessageDetailsFromModalAction', () => {
  it('should set the case message on props from the modal', async () => {
    const { output } = await runAction(
      updateCaseMessageDetailsFromModalAction,
      {
        state: {
          modal: {
            form: {
              message: 'yup',
              subject: 'hi',
              toSection: 'yup',
              toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
            },
          },
        },
      },
    );

    expect(output).toMatchObject({
      message: {
        assigneeId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
        message: 'yup',
        section: 'yup',
        subject: 'hi',
      },
    });
  });
});
