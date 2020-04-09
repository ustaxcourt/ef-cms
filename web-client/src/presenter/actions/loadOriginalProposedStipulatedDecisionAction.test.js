import { loadOriginalProposedStipulatedDecisionAction } from './loadOriginalProposedStipulatedDecisionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('loadOriginalProposedStipulatedDecisionAction', () => {
  let loadPDFForSigningStub;

  beforeEach(() => {
    loadPDFForSigningStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        loadPDFForSigningInteractor: loadPDFForSigningStub,
      }),
    };
  });

  it('does nothing if state.caseDetail does not exist', async () => {
    const result = await runAction(
      loadOriginalProposedStipulatedDecisionAction,
      {
        modules: {
          presenter,
        },
        state: {},
      },
    );

    expect(result.state.pdfForSigning).toBeUndefined();
  });

  it('loads original proposed stipulated decision', async () => {
    loadPDFForSigningStub = jest.fn().mockReturnValue({ foo: 'bar' });

    const result = await runAction(
      loadOriginalProposedStipulatedDecisionAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123',
                documentType: 'Proposed Stipulated Decision',
              },
            ],
          },
        },
      },
    );

    expect(result.state.pdfForSigning).toMatchObject({
      pdfjsObj: { foo: 'bar' },
    });
  });
});
