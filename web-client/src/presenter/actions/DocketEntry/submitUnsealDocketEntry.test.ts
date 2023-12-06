import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitUnsealDocketEntryAction } from './submitUnsealDocketEntryAction';

describe('submitUnsealDocketEntryAction', () => {
  const mockDocketEntryId = '123';
  const mockDocketNumber = '123-45';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should make a call to unseal the docket entry', async () => {
    applicationContext
      .getUseCases()
      .unsealDocketEntryInteractor.mockReturnValue({});

    await runAction(submitUnsealDocketEntryAction, {
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
        },
      },
    });

    expect(
      applicationContext.getUseCases().unsealDocketEntryInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });
  });

  it('should update the docket entry in state after unsealing it', async () => {
    applicationContext
      .getUseCases()
      .unsealDocketEntryInteractor.mockReturnValue({
        docketEntryId: mockDocketEntryId,
        isSealed: false,
      });

    const result = await runAction(submitUnsealDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketEntries: [{ docketEntryId: mockDocketEntryId }],
          docketNumber: mockDocketNumber,
        },
        modal: {
          docketEntryId: mockDocketEntryId,
        },
      },
    });

    const updatedDocketEntryInState =
      result.state.caseDetail.docketEntries.find(
        entry => entry.docketEntryId === mockDocketEntryId,
      );
    expect(updatedDocketEntryInState.isSealed).toBe(false);
    expect(updatedDocketEntryInState.sealedTo).toBe(undefined);
  });
});
