import { runAction } from 'cerebral/test';
import { setPractitionerDocumentsAction } from './setPractitionerDocumentsAction';

describe('setPractitionerDocumentsAction', () => {
  it('sets state.practitionerDetail from props', async () => {
    const result = await runAction(setPractitionerDocumentsAction, {
      props: {
        practitionerDocuments: [],
      },
      state: {
        practitionerDocuments: undefined,
      },
    });

    expect(result.state.practitionerDocuments).toEqual([]);
  });
});
