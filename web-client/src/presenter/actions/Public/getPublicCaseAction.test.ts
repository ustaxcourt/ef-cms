import { PublicClientState } from '@web-client/presenter/state-public';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { getPublicCaseAction } from './getPublicCaseAction';
import { presenter } from '../../presenter-public';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getPublicCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  beforeEach(() => {
    applicationContextForClient
      .getUseCases()
      .getCaseInteractor.mockResolvedValue({
        docketEntries: [],
        docketNumber: '123-20',
      });

    applicationContextForClient
      .getUseCases()
      .getCaseDocketEntriesInteractor.mockResolvedValue({
        docketEntries: [{ docketEntryId: '1' }],
        page: 0,
        pageSize: 1000,
        totalCount: 1,
      });
  });

  it('gets the public case information with paginated docket entries', async () => {
    const result = await runAction<{ caseDetail: any }, PublicClientState>(
      getPublicCaseAction,
      {
        modules: {
          presenter,
        },
        props: {
          docketNumber: '123-20',
        },
      },
    );

    expect(
      applicationContextForClient.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContextForClient.getUseCases()
        .getCaseDocketEntriesInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '123-20',
      page: 0,
    });
    expect(result.output.caseDetail.docketEntries).toEqual([
      { docketEntryId: '1' },
    ]);
  });
});
