import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { refreshExternalDocumentTitleFromEventCodeAction } from './refreshExternalDocumentTitleFromEventCodeAction';
import { runAction } from '@web-client/presenter/test.cerebral';
presenter.providers.applicationContext = applicationContextForClient;

describe('refreshExternalDocumentTitleFromEventCodeAction', () => {
  it('sets document scenario', async () => {
    const mockDocumentTitle = 'Notice of Abatement of Jeopardy Assessment';

    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            category: 'Notice',
            documentTitle:
              'Notice of Concatenated Title that should be refreshed',
            eventCode: 'NAJA',
          },
        },
      },
    );

    expect(result.state.form.documentTitle).toEqual(mockDocumentTitle);
  });

  it('should set the state.form.secondaryDocument.documentTitle secondaryDocument eventCode and category is defined', async () => {
    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            category: 'Notice',
            documentTitle:
              'Notice of Concatenated Title that should be refreshed',
            documentType: 'Notice of Abatement of Jeopardy Assessment',
            eventCode: 'NAJA',
            secondaryDocument: {
              category: 'Miscellaneous',
              documentTitle: '[First, Second, etc.] Amendment to blablahblah',
              documentType: 'Amendment blablahblah',
              eventCode: 'ADMT',
              labelFreeText: '',
              labelPreviousDocument: 'What is this amendment for?',
              ordinalField: 'What iteration is this filing?',
              scenario: 'Nonstandard F',
            },
          },
        },
      },
    );

    expect(result.state.form.secondaryDocument.documentTitle).toEqual(
      '[First, Second, etc.] Amendment to [anything]',
    );
  });

  it('should set the state.form.secondaryDocument.documentTitle secondaryDocument eventCode and category is defined', async () => {
    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            category: 'Notice',
            documentTitle:
              'Notice of Concatenated Title that should be refreshed',
            documentType: 'Notice of Abatement of Jeopardy Assessment',
            eventCode: 'NAJA',
            secondaryDocument: {
              documentTitle: '[First, Second, etc.] Amendment to blablahblah',
              documentType: 'Amendment blablahblah',
              labelFreeText: '',
              labelPreviousDocument: 'What is this amendment for?',
              ordinalField: 'What iteration is this filing?',
              scenario: 'Nonstandard F',
            },
          },
        },
      },
    );

    expect(result.state.form.secondaryDocument.documentTitle).toEqual(
      '[First, Second, etc.] Amendment to blablahblah',
    );
  });

  it('should not overwrite document title when the eventCode is included in PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP', async () => {
    const mockEntryOfAppearanceDocumentTitle =
      'Entry of Appearance for Petitioner Queen Clarion';

    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            category: 'Appearance and Representation',
            documentTitle: mockEntryOfAppearanceDocumentTitle,
            eventCode: 'EA',
          },
        },
      },
    );

    expect(result.state.form.documentTitle).toEqual(
      mockEntryOfAppearanceDocumentTitle,
    );
  });

  it('should set the document title when the eventCode is an internal filing event code', async () => {
    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            category: 'Miscellaneous',
            eventCode: 'MISC',
          },
        },
      },
    );

    expect(result.state.form.documentTitle).toEqual('[Miscellaneous]');
  });

  it('should set the secondary document title when the secondary document eventCode is an internal filing event code', async () => {
    const result = await runAction(
      refreshExternalDocumentTitleFromEventCodeAction,
      {
        modules: { presenter },
        state: {
          form: {
            secondaryDocument: {
              category: 'Miscellaneous',
              eventCode: 'MISC',
            },
          },
        },
      },
    );

    expect(result.state.form.secondaryDocument.documentTitle).toEqual(
      '[Miscellaneous]',
    );
  });
});
