import { runAction } from '@web-client/presenter/test.cerebral';
import { setRecentFilingsAction } from './setRecentFilingsAction';

describe('setRecentFilingsAction', () => {
  const mockRecentFilings = [
    {
      docketNumber: '123-20',
      filedDate: '2023-01-15T10:30:00.000Z',
      document: 'Petition',
      caseTitle: 'Test Case 1',
      docketEntryId: 'abc-123',
      isFileAttached: true,
      eventCode: 'P',
      isStricken: false,
      isSealed: false,
      sealedTo: null,
      servedAt: '2023-01-15T11:00:00.000Z',
      caseIsSealed: false,
      inConsolidatedGroup: false,
      isLeadCase: true,
      consolidatedIconTooltipText: null,
      isDraft: false,
      isRequestingUserAssociated: true,
    },
    {
      docketNumber: '456-20',
      filedDate: '2023-01-16T14:45:00.000Z',
      document: 'Answer',
      caseTitle: 'Test Case 2',
      docketEntryId: 'def-456',
      isFileAttached: true,
      eventCode: 'A',
      isStricken: false,
      isSealed: false,
      sealedTo: null,
      servedAt: '2023-01-16T15:00:00.000Z',
      caseIsSealed: false,
      inConsolidatedGroup: false,
      isLeadCase: false,
      consolidatedIconTooltipText: null,
      isDraft: false,
      isRequestingUserAssociated: true,
    },
  ];

  it('should set recentFilings in state with provided data', async () => {
    const { state } = await runAction(setRecentFilingsAction, {
      props: {
        recentFilings: mockRecentFilings,
      },
      state: {
        recentFilings: [],
      },
    });

    expect(state.recentFilings).toEqual(mockRecentFilings);
    expect(state.recentFilings).toHaveLength(2);
  });

  it('should replace existing recentFilings with new data', async () => {
    const existingFilings = [
      {
        docketNumber: '999-20',
        filedDate: '2023-01-10T09:00:00.000Z',
        document: 'Motion',
        caseTitle: 'Old Case',
        docketEntryId: 'old-123',
        isFileAttached: true,
        eventCode: 'M',
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: '2023-01-10T10:00:00.000Z',
        caseIsSealed: false,
        inConsolidatedGroup: false,
        isLeadCase: false,
        consolidatedIconTooltipText: null,
        isDraft: false,
        isRequestingUserAssociated: true,
      },
    ];

    const { state } = await runAction(setRecentFilingsAction, {
      props: {
        recentFilings: mockRecentFilings,
      },
      state: {
        recentFilings: existingFilings,
      },
    });

    expect(state.recentFilings).toEqual(mockRecentFilings);
    expect(state.recentFilings).toHaveLength(2);
    expect(state.recentFilings[0].docketNumber).toBe('123-20');
  });

  it('should set empty array when no recentFilings provided', async () => {
    const { state } = await runAction(setRecentFilingsAction, {
      props: {
        recentFilings: [],
      },
      state: {
        recentFilings: mockRecentFilings,
      },
    });

    expect(state.recentFilings).toEqual([]);
    expect(state.recentFilings).toHaveLength(0);
  });

  it('should handle single recentFiling', async () => {
    const singleFiling = [mockRecentFilings[0]];

    const { state } = await runAction(setRecentFilingsAction, {
      props: {
        recentFilings: singleFiling,
      },
      state: {
        recentFilings: [],
      },
    });

    expect(state.recentFilings).toEqual(singleFiling);
    expect(state.recentFilings).toHaveLength(1);
    expect(state.recentFilings[0].docketNumber).toBe('123-20');
  });
});
