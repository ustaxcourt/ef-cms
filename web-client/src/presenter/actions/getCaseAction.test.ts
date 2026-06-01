import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseAction } from './getCaseAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseAction', () => {
  const mockDocketNumber = '999-99';
  const mockDocketEntries = [
    { docketEntryId: '1', description: 'Entry 1' },
    { docketEntryId: '2', description: 'Entry 2' },
  ];
  const mockCase = { docketEntries: [], docketNumber: mockDocketNumber };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);

    applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor.mockReturnValue({
        docketEntries: mockDocketEntries,
        page: 0,
        pageSize: 1000,
        totalCount: mockDocketEntries.length,
      });
  });

  it('should call getCaseInteractor with props.docketNumber', async () => {
    await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: mockDocketNumber },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should call getCaseInteractor with state.caseDetail.docketNumber when props.docketNumber is undefined', async () => {
    await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: {},
      state: { caseDetail: { docketNumber: mockDocketNumber } },
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor.mock.calls[0][1]
        .docketNumber,
    ).toEqual(mockDocketNumber);
  });

  it('should call getCaseDocketEntriesInteractor to fetch docket entries', async () => {
    await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: mockDocketNumber },
    });

    expect(
      applicationContext.getUseCases().getCaseDocketEntriesInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: mockDocketNumber,
      page: 0,
    });
  });

  it('should merge docket entries from paginated endpoint into caseDetail', async () => {
    const { output } = await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: mockDocketNumber },
    });

    expect(output.caseDetail.docketNumber).toEqual(mockDocketNumber);
    expect(output.caseDetail.docketEntries).toEqual(mockDocketEntries);
  });

  it('should fetch multiple pages of docket entries when totalCount exceeds pageSize', async () => {
    const page0Entries = Array.from({ length: 1000 }, (_, i) => ({
      docketEntryId: `entry-${i}`,
    }));
    const page1Entries = [{ docketEntryId: 'entry-1000' }];

    applicationContext
      .getUseCases()
      .getCaseDocketEntriesInteractor.mockImplementation(
        (_appContext, { page }) => {
          if (page === 0) {
            return {
              docketEntries: page0Entries,
              page: 0,
              pageSize: 1000,
              totalCount: 1001,
            };
          }
          return {
            docketEntries: page1Entries,
            page: 1,
            pageSize: 1000,
            totalCount: 1001,
          };
        },
      );

    const { output } = await runAction(getCaseAction, {
      modules: {
        presenter,
      },
      props: { docketNumber: mockDocketNumber },
    });

    expect(
      applicationContext.getUseCases().getCaseDocketEntriesInteractor,
    ).toHaveBeenCalledTimes(2);
    expect(output.caseDetail.docketEntries.length).toEqual(1001);
  });
});
