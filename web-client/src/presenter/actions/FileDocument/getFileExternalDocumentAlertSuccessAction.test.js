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
        message:
          'You can access your documents at any time from the docket record below.',
        title: 'Your filing has been successfully submitted.',
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
          'If approved, you will gain full access to this case. Please check your dashboard for updates.',
        title: 'Your filing has been successfully submitted.',
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
        message:
          'You can access your documents at any time from the docket record below.',
        title: 'Your filing has been successfully submitted.',
      },
    });
  });
});
