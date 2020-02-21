import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { refreshExternalDocumentTitleFromEventCodeAction } from './refreshExternalDocumentTitleFromEventCodeAction';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

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
});
