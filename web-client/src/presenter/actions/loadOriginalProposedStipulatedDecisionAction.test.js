import { loadOriginalProposedStipulatedDecisionAction } from './loadOriginalProposedStipulatedDecisionAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

describe('loadOriginalProposedStipulatedDecisionAction', () => {
  let loadPDFForSigningStub;

  beforeEach(() => {
    loadPDFForSigningStub = sinon.stub();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        loadPDFForSigningInteractor: loadPDFForSigningStub,
      }),
    };
  });

  it('loads original proposed stipulated decision', async () => {
    loadPDFForSigningStub.returns({ foo: 'bar' });

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
