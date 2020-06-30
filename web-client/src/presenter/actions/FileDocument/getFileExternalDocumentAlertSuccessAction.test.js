import { getFileExternalDocumentAlertSuccessAction } from './getFileExternalDocumentAlertSuccessAction';
import { runAction } from 'cerebral/test';

describe('getFileExternalDocumentAlertSuccessAction', () => {
  it('should return a default success message', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      props: {},
      state: {},
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message: 'Document filed and is accessible from the Docket Record.',
      },
    });
  });

  it('should return a pending association message when props.documentWithPendingAssociation is true', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      props: {
        documentWithPendingAssociation: true,
      },
      state: {},
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message:
          'Document filed and pending approval. Please check your dashboard for updates.',
      },
    });
  });

  it('should include a link and link text if props.printReceiptLink is set', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      props: {
        printReceiptLink: 'http://example.com',
      },
      state: {},
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        linkText: 'Print receipt.',
        linkUrl: 'http://example.com',
        message: 'Document filed and is accessible from the Docket Record.',
      },
    });
  });

  it('should return changes saved message if documentToEdit is set', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      state: { documentToEdit: '123' },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message: 'Changes saved.',
      },
    });
  });

  it('should return created document success message if isCreatingOrder is set', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      state: { isCreatingOrder: true },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message',
      },
    });
  });
});
