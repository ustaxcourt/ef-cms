import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getFileExternalDocumentAlertSuccessAction } from './getFileExternalDocumentAlertSuccessAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getFileExternalDocumentAlertSuccessAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should return a default success message', async () => {
    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      modules: {
        presenter,
      },
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
      modules: {
        presenter,
      },
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
      modules: {
        presenter,
      },
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
      modules: {
        presenter,
      },
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
      modules: {
        presenter,
      },
      state: { isCreatingOrder: true },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message.',
      },
    });
  });

  it('should return a notice saved success message when props.eventCode belongs to a notice document type', async () => {
    const mockDocketEntryId = applicationContext.getUniqueId();
    const mockDocumentTitle = 'Notice of Test Passing';

    const result = await runAction(getFileExternalDocumentAlertSuccessAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: mockDocketEntryId,
              documentTitle: mockDocumentTitle,
            },
          ],
        },
        docketEntryId: mockDocketEntryId,
        eventCode: 'NOT',
      },
    });

    expect(result.output).toMatchObject({
      alertSuccess: {
        message: `${mockDocumentTitle} saved.`,
      },
    });
  });
});
