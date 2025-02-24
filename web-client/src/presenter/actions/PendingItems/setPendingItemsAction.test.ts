import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPendingItemsAction } from './setPendingItemsAction';
import { Case } from '@shared/business/entities/cases/Case';

jest.mock('@shared/business/utilities/formatPendingItem', () => ({
  formatPendingItem: jest.fn(),
}));

const mockFormatPendingItem = formatPendingItem as jest.MockedFunction<
  typeof formatPendingItem
>;

describe('setPendingItemsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems', async () => {
    const DOCKET_NUMBER = '101-10';
    const mockResult = {
      associatedJudgeFormatted: '',
      caseTitle: '',
      consolidatedIconTooltipText: '',
      docketEntryId: 'e0f518ad-f957-43e0-b7db-eb7c91d00a5f',
      docketNumber: DOCKET_NUMBER,
      docketNumberWithSuffix: '101-10S',
      documentLink:
        '/case-detail/undefined/document-view?docketEntryId=undefined',
      formattedFiledDate: '',
      formattedName: 'Name',
      formattedStatus: 'Staus',
      inConsolidatedGroup: false,
      isLeadCase: false,
      receivedAt: '',
      shouldIndent: false,
      sortableDocketNumber: Case.getSortableDocketNumber(DOCKET_NUMBER)!,
    };

    mockFormatPendingItem.mockReturnValue(mockResult);

    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });

    expect(state.pendingReports.pendingItems).toEqual([mockResult]);
  });

  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems and replaces any items that were previously stored in state.pendingReport.pendingItems', async () => {
    const DOCKET_NUMBER = '101-10';
    const mockResult = {
      associatedJudgeFormatted: '',
      caseTitle: '',
      consolidatedIconTooltipText: '',
      docketEntryId: 'e0f518ad-f957-43e0-b7db-eb7c91d00a5f',
      docketNumber: DOCKET_NUMBER,
      docketNumberWithSuffix: '101-10S',
      documentLink:
        '/case-detail/undefined/document-view?docketEntryId=undefined',
      formattedFiledDate: '',
      formattedName: 'Name',
      formattedStatus: 'Staus',
      inConsolidatedGroup: false,
      isLeadCase: false,
      receivedAt: '',
      shouldIndent: false,
      sortableDocketNumber: Case.getSortableDocketNumber(DOCKET_NUMBER)!,
    };

    mockFormatPendingItem.mockReturnValue(mockResult);

    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
      },
      state: {
        pendingReports: {
          pendingItems: [{}, {}],
        },
      },
    });

    expect(state.pendingReports.pendingItems).toEqual([mockResult]);
  });

  it('sets state.pendingReports.hasPendingItemsResults to true when props.pendingItems contains items', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });
    expect(state.pendingReports.hasPendingItemsResults).toBe(true);
  });

  it('sets state.pendingReports.hasPendingItemsResults to false when neither props.pendingItems nor state.pendingReports.pendingItems contain items', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });
    expect(state.pendingReports.hasPendingItemsResults).toBe(false);
  });
});
