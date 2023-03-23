import { clearPractitionerDocumentsAction } from './clearPractitionerDocumentsAction';
import { runAction } from 'cerebral/test';

describe('clearPractitionerDocumentsAction', () => {
  it('should unset state.practitionerDetail to an empty object', async () => {
    const result = await runAction(clearPractitionerDocumentsAction, {
      state: { practitionerDocuments: [] },
    });

    expect(result.state.practitionerDocuments).toBeUndefined();
  });
});
