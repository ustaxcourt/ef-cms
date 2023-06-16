import { runAction } from '@web-client/presenter/test.cerebral';
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
