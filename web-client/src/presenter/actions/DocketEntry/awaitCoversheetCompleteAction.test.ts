jest.mock('@web-client/presenter/utilities/pollForCoversheetComplete');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { awaitCoversheetCompleteAction } from './awaitCoversheetCompleteAction';
import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('awaitCoversheetCompleteAction', () => {
  const mockPollForCoversheetComplete = jest.mocked(pollForCoversheetComplete);

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    mockPollForCoversheetComplete.mockReset();
    mockPollForCoversheetComplete.mockResolvedValue(undefined);
  });

  it('polls for coversheet completion using docketEntryId from props', async () => {
    const mockDocketEntryId = '456';
    const mockDocketNumber = '123-45';

    await runAction(awaitCoversheetCompleteAction, {
      modules: { presenter },
      props: { docketEntryId: mockDocketEntryId },
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: [mockDocketEntryId],
        docketNumber: mockDocketNumber,
      }),
    );
  });

  it('does not call any interactor — only the polling utility', async () => {
    await runAction(awaitCoversheetCompleteAction, {
      modules: { presenter },
      props: { docketEntryId: 'abc' },
      state: { caseDetail: { docketNumber: '123-45' } },
    });

    // The frontend must not be the one triggering coversheet generation —
    // the backend interactor enqueues the worker job before responding.
    const { addCoversheetInteractor } =
      applicationContext.getUseCases() as any;
    expect(addCoversheetInteractor).not.toHaveBeenCalled();
  });
});
