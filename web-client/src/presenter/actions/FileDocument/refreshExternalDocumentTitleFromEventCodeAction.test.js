import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { refreshExternalDocumentTitleFromEventCodeAction } from './refreshExternalDocumentTitleFromEventCodeAction';
import { runAction } from 'cerebral/test';
presenter.providers.applicationContext = applicationContextForClient;

describe('refreshExternalDocumentTitleFromEventCodeAction', () => {
  it('sets document scenario', async () => {
    const documentScenario = {
      category: 'Notice',
      documentTitle: 'Notice of Abatement of Jeopardy Assessment',
      documentType: 'Notice of Abatement of Jeopardy Assessment',
      eventCode: 'NAJA',
      labelFreeText: '',
      labelPreviousDocument: '',
      ordinalField: '',
      scenario: 'Standard',
    };

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
          },
        },
      },
    );

    expect(result.state.form.documentTitle).toEqual(
      documentScenario.documentTitle,
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
});
