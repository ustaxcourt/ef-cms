import { runAction } from 'cerebral/test';
import { setPractitionerDocumentationPropFromStateAction } from './setPractitionerDocumentationPropFromStateAction';

describe('setPractitionerDocumentationPropFromStateAction', () => {
  it('sets state.practitionerDetail from props', async () => {
    const result = await runAction(
      setPractitionerDocumentationPropFromStateAction,
      {
        state: {
          practitionerDetails: {
            barNumber: 'PT1234',
          },
        },
      },
    );

    expect(result.output).toEqual({
      barNumber: 'PT1234',
    });
  });
});
