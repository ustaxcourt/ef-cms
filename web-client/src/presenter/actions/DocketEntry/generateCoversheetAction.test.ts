jest.mock('@web-client/presenter/utilities/pollForCoversheetComplete');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { generateCoversheetAction } from './generateCoversheetAction';
import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('generateCoversheetAction', () => {
  const mockPollForCoversheetComplete = jest.mocked(pollForCoversheetComplete);

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    mockPollForCoversheetComplete.mockReset();
    mockPollForCoversheetComplete.mockResolvedValue(undefined);
  });

  it('enqueues the coversheet job and polls until processing status is complete', async () => {
    const mockDocketEntryId = '456';
    const mockDocketNumber = '123-45';
    await runAction(generateCoversheetAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: [mockDocketEntryId],
        docketNumber: mockDocketNumber,
      }),
    );
  });
});
