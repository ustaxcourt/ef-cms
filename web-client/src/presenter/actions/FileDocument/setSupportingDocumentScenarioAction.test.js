import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setSupportingDocumentScenarioAction } from './setSupportingDocumentScenarioAction';

presenter.providers.applicationContext = applicationContext;

describe('setSupportingDocumentScenarioAction', () => {
  it('should set scenario and document title for supporting document', async () => {
    const result = await runAction(setSupportingDocumentScenarioAction, {
      modules: { presenter },
      state: {
        form: {
          supportingDocuments: [
            {
              category: 'Motion',
              documentType: 'Motion for Judgment on the Pleadings',
            },
          ],
        },
      },
    });

    expect(result.state.form.supportingDocuments[0].scenario).toEqual(
      'Standard',
    );
    expect(result.state.form.supportingDocuments[0].documentTitle).toEqual(
      'Motion for Judgment on the Pleadings',
    );
  });

  it('should set scenario and document type for secondary supporting document', async () => {
    const result = await runAction(setSupportingDocumentScenarioAction, {
      modules: { presenter },
      state: {
        form: {
          secondarySupportingDocuments: [
            {
              category: 'Motion',
              documentType: 'Motion for Judgment on the Pleadings',
            },
          ],
        },
      },
    });

    expect(result.state.form.secondarySupportingDocuments[0].scenario).toEqual(
      'Standard',
    );
    expect(
      result.state.form.secondarySupportingDocuments[0].documentTitle,
    ).toEqual('Motion for Judgment on the Pleadings');
  });
});
