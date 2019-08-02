import { removeScannedPdfAction } from './removeScannedPdfAction';
import { runAction } from 'cerebral/test';

describe('removeScannedPdfAction', () => {
  it('should reset the state.form properties for the given document type', async () => {
    const { state } = await runAction(removeScannedPdfAction, {
      props: {},
      state: {
        documentSelectedForScan: 'petition',
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(state.form.petition).toEqual(null);
    expect(state.form.petitionSize).toEqual(null);
  });

  it('should return the documentUploadMode', async () => {
    const result = await runAction(removeScannedPdfAction, {
      props: {},
      state: {
        documentSelectedForScan: 'petition',
        form: {
          petition: 'test_petition.pdf',
          petitionSize: '100',
        },
      },
    });
    expect(result.output).toMatchObject({ documentUploadMode: 'scan' });
  });
});
