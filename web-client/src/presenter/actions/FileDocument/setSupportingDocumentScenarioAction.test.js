import { Document } from '../../../../../shared/src/business/entities/Document';
import { runAction } from 'cerebral/test';
import { setSupportingDocumentScenarioAction } from './setSupportingDocumentScenarioAction';

describe('setSupportingDocumentScenarioAction', () => {
  it('should set scenario and document title for supporting document', async () => {
    const result = await runAction(setSupportingDocumentScenarioAction, {
      state: {
        constants: {
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
        form: {
          supportingDocumentMetadata: {
            category: 'Motion',
            documentType: 'Motion for Judgment on the Pleadings',
          },
        },
      },
    });

    expect(result.state.form.supportingDocumentMetadata.scenario).toEqual(
      'Standard',
    );
    expect(result.state.form.supportingDocumentMetadata.documentTitle).toEqual(
      'Motion for Judgment on the Pleadings',
    );
  });

  it('should set scenario and document type for secondary supporting document', async () => {
    const result = await runAction(setSupportingDocumentScenarioAction, {
      state: {
        constants: {
          CATEGORY_MAP: Document.CATEGORY_MAP,
        },
        form: {
          secondarySupportingDocumentMetadata: {
            category: 'Motion',
            documentType: 'Motion for Judgment on the Pleadings',
          },
        },
      },
    });

    expect(
      result.state.form.secondarySupportingDocumentMetadata.scenario,
    ).toEqual('Standard');
    expect(
      result.state.form.secondarySupportingDocumentMetadata.documentTitle,
    ).toEqual('Motion for Judgment on the Pleadings');
  });
});
