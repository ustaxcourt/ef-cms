import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { loadOriginalProposedStipulatedDecisionAction } from './loadOriginalProposedStipulatedDecisionAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('loadOriginalProposedStipulatedDecisionAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
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
    applicationContext
      .getUseCases()
      .loadPDFForSigningInteractor.mockReturnValue({ foo: 'bar' });

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
