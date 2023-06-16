import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentIsRequiredAction } from './setDocumentIsRequiredAction';

describe('setDocumentIsRequiredAction', () => {
  it('sets state.form.isDocumentRequired to true if a file is not attached on the form', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        currentViewMetadata: { documentUploadMode: 'scan' },
        form: {},
      },
    });

    expect(result.state.form).toMatchObject({
      isDocumentRequired: true,
    });
  });

  it('unsets state.form.isDocumentRequired if a file is not attached on the form and isSavingForLater is true', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      props: { isSavingForLater: true },
      state: {
        currentViewMetadata: { documentUploadMode: 'scan' },
        form: {},
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });

  it('unsets state.form.isDocumentRequired if a docket entry is being modified with an existing document and documentUploadMode is preview', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        currentViewMetadata: { documentUploadMode: 'preview' },
        form: {
          isFileAttached: true,
        },
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });

  it('unsets state.form.isDocumentRequired if a docket entry previously did not have a file attached and a file has been added (documentUploadMode is preview)', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        currentViewMetadata: { documentUploadMode: 'preview' },
        form: {
          isFileAttached: false,
        },
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });

  it('unsets state.form.isDocumentRequired if a docket entry previously did not have a file attached, a file has been added (documentUploadMode is preview), and isSavingForLater is true', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        currentViewMetadata: { documentUploadMode: 'preview' },
        form: {
          isFileAttached: false,
        },
        props: { isSavingForLater: true },
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });
});
