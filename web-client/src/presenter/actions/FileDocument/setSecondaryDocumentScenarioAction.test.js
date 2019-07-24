import { runAction } from 'cerebral/test';
import { setSecondaryDocumentScenarioAction } from './setSecondaryDocumentScenarioAction';

describe('setSecondaryDocumentScenarioAction', () => {
  it('sets secondaryDocument scenario', async () => {
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

    const result = await runAction(setSecondaryDocumentScenarioAction, {
      state: {
        constants: {
          CATEGORY_MAP: {
            Notice: [documentScenario],
          },
        },
        form: {
          secondaryDocument: {
            category: 'Notice',
            documentType: 'Notice of Abatement of Jeopardy Assessment',
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument.scenario).toEqual(
      documentScenario.scenario,
    );
    expect(result.state.form.secondaryDocument.documentTitle).toEqual(
      documentScenario.documentTitle,
    );
    expect(result.state.form.secondaryDocument.eventCode).toEqual(
      documentScenario.eventCode,
    );
  });

  it('does not set secondaryDocument scenario', async () => {
    const result = await runAction(setSecondaryDocumentScenarioAction, {
      state: {
        form: {
          secondaryDocument: {
            category: 'Notice',
          },
        },
      },
    });

    expect(result.state.form.secondaryDocument.secenario).toBeUndefined();
    expect(result.state.form.secondaryDocument.documentTitle).toBeUndefined();
    expect(result.state.form.secondaryDocument.eventCode).toBeUndefined();
  });
});
