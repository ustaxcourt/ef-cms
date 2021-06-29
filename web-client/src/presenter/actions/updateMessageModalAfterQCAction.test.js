import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { updateMessageModalAfterQCAction } from './updateMessageModalAfterQCAction';

describe('updateMessageModalAfterQCAction', () => {
  const mockDocketEntryId = '105-20';
  const mockDocumentTitle = 'Ratification of do the test';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('set state.modal.validationErrors to an empty object', async () => {
    const result = await runAction(updateMessageModalAfterQCAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          documentTitle: mockDocumentTitle,
        },
        modal: undefined,
      },
    });

    expect(result.state.modal.validationErrors).toEqual({});
  });

  it('set state.modal.form.subject to state.form.documentTitle', async () => {
    const result = await runAction(updateMessageModalAfterQCAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          documentTitle: mockDocumentTitle,
        },
        modal: { form: undefined },
      },
    });

    expect(result.state.modal.form.subject).toEqual(mockDocumentTitle);
  });

  it('set state.modal.form.attachments with state.docketEntryId and state.form.documentTitle', async () => {
    const result = await runAction(updateMessageModalAfterQCAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          documentTitle: mockDocumentTitle,
        },
        modal: { form: undefined },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: mockDocketEntryId, documentTitle: mockDocumentTitle },
    ]);
  });

  it('should call getDocumentTitleWithAdditionalInfo', async () => {
    await runAction(updateMessageModalAfterQCAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          documentTitle: mockDocumentTitle,
        },
        modal: { form: undefined },
      },
    });

    expect(
      applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo.mock
        .calls[0][0],
    ).toMatchObject({ docketEntry: { documentTitle: mockDocumentTitle } });
  });
});
