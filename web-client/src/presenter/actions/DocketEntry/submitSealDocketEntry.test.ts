import { DOCKET_ENTRY_SEALED_TO_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitSealDocketEntryAction } from './submitSealDocketEntryAction';

describe('submitSealDocketEntryAction', () => {
  const mockDocketEntryId = '123';
  const mockDocketNumber = '123-45';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to seal the docket entry', async () => {
    applicationContext
      .getUseCases()
      .sealDocketEntryInteractor.mockReturnValue({});

    await runAction(submitSealDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [],
          docketNumber: mockDocketNumber,
        },
        modal: {
          docketEntryId: mockDocketEntryId,
          docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        },
      },
    });

    expect(
      applicationContext.getUseCases().sealDocketEntryInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
      docketNumber: mockDocketNumber,
    });
  });

  it('should update the docket entry in state after sealing it', async () => {
    applicationContext.getUseCases().sealDocketEntryInteractor.mockReturnValue({
      docketEntryId: mockDocketEntryId,
      sealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    });

    const result = await runAction(submitSealDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [
            { docketEntryId: mockDocketEntryId, sealedTo: undefined },
          ],
          docketNumber: mockDocketNumber,
        },
        modal: {
          docketEntryId: mockDocketEntryId,
          docketEntrySealedTo: DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
        },
      },
    });

    const updatedDocketEntryInState =
      result.state.caseDetail.docketEntries.find(
        entry => entry.docketEntryId === mockDocketEntryId,
      );
    expect(updatedDocketEntryInState.sealedTo).toBe(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
  });
});
