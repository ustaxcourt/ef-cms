import { removeScannedPdfAction } from './removeScannedPdfAction';
import { runAction } from 'cerebral/test';

describe('removeScannedPdfAction', () => {
  it('should reset the state.form properties for the given document type', async () => {
    const { state } = await runAction(removeScannedPdfAction, {
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(state.form.petition).toBeUndefined();
    expect(state.form.petitionSize).toBeUndefined();
  });

  it('should return the documentUploadMode and documentType', async () => {
    const result = await runAction(removeScannedPdfAction, {
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(result.output.documentUploadMode).toEqual('scan');
    expect(result.output.documentType).toEqual('petition');
  });
});
