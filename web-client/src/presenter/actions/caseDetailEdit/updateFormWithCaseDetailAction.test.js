import { runAction } from 'cerebral/test';
import { updateFormWithCaseDetailAction } from './updateFormWithCaseDetailAction';

describe('updateFormWithCaseDetailAction', () => {
  it('should update from with case detail properties', async () => {
    const result = await runAction(updateFormWithCaseDetailAction, {
      props: {
        combinedCaseDetailWithForm: {
          caseId: 'something',
        },
      },
      state: {
        form: { what: 'something more' },
      },
    });
    expect(result.state.form).toEqual({
      caseId: 'something',
      what: 'something more',
    });
  });
});
