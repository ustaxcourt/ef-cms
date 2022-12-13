import { camelCase } from 'lodash';
import { migrateItems } from './0003-update-trial-session-working-copy-status';
import { v4 as uuidv4 } from 'uuid';

describe('migrateItems', () => {
  let documentClient;

  const trialSessionId = '208a959f-9526-4db5-b262-e58c476a4604';
  const userId = 'dabbad03-18d0-43ec-bafb-654e83405416';

  const unchangedTrialSessionWorkingCopies = [
    'Set for Trial',
    'Dismissed',
    'Continued',
    'Rule 122',
    'Settled',
    'Recall',
  ].map(status => {
    return {
      caseMetadata: { '108-18': { trialStatus: camelCase(status) } },
      pk: `trial-session-working-copy|${uuidv4()}`,
      sk: `user|${uuidv4()}`,
      trialSessionId,
      userId,
    };
  });

  const mockBasisReached = {
    caseMetadata: {
      '109-19': {
        trialStatus: 'aBasisReached',
      },
      '120-20': {
        trialStatus: 'takenUnderAdvisement',
      },
    },
    filters: {
      aBasisReached: true,
      continued: false,
      dismissed: true,
      recall: false,
      rule122: true,
      setForTrial: false,
      settled: true,
      showAll: true,
      statusUnassigned: false,
      takenUnderAdvisement: false,
    },
    pk: `trial-session-working-copy|${uuidv4()}`,
    sk: `user|${uuidv4()}`,
    trialSessionId,
    userId,
  };

  const mockTakenUnderAdvisement = {
    caseMetadata: {
      '121-21': {
        trialStatus: 'takenUnderAdvisement',
      },
    },
    filters: {
      aBasisReached: false,
      continued: true,
      dismissed: false,
      recall: false,
      rule122: true,
      setForTrial: false,
      settled: true,
      showAll: true,
      statusUnassigned: false,
      takenUnderAdvisement: false,
    },
    pk: `trial-session-working-copy|${uuidv4()}`,
    sk: `user|${uuidv4()}`,
    trialSessionId,
    userId,
  };

  it('should return and not modify records that are NOT trial session working copies', async () => {
    const items = [
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ]);
  });

  it('should return and not modify trial session workingCopy trialStatuses that have no trialStatus change', async () => {
    const results = await migrateItems(
      unchangedTrialSessionWorkingCopies,
      documentClient,
    );

    expect(results).toEqual(unchangedTrialSessionWorkingCopies);
  });

  it('should update trialStatus on trial session working copies with status aBasisReached or takenUnderAdvisement', async () => {
    const items = [mockBasisReached, mockTakenUnderAdvisement];

    const results = await migrateItems(items, documentClient);

    const expectedBasisReached = {
      ...mockBasisReached,
      caseMetadata: {
        '109-19': {
          trialStatus: 'basisReached',
        },
        '120-20': {
          trialStatus: 'submittedCAV',
        },
      },
    };
    const expectedTakenUnderAdvisement = {
      ...mockTakenUnderAdvisement,
      caseMetadata: {
        '121-21': {
          trialStatus: 'submittedCAV',
        },
      },
    };

    expect(results).toEqual([
      expectedBasisReached,
      expectedTakenUnderAdvisement,
    ]);
  });

  it('should update trialStatus filters and reset all to true', async () => {
    const items = [mockBasisReached, mockTakenUnderAdvisement];

    const results = await migrateItems(items, documentClient);

    const expectedBasisReached = {
      ...mockBasisReached,
      caseMetadata: {
        '109-19': {
          trialStatus: 'basisReached',
        },
        '120-20': {
          trialStatus: 'submittedCAV',
        },
      },
      filters: {
        basisReached: true,
        continued: true,
        definiteTrial: true,
        dismissed: true,
        motionToDismiss: true,
        probableSettlement: true,
        probableTrial: true,
        recall: true,
        rule122: true,
        setForTrial: true,
        settled: true,
        showAll: true,
        statusUnassigned: true,
        submittedCAV: true,
      },
    };
    const expectedTakenUnderAdvisement = {
      ...mockTakenUnderAdvisement,
      caseMetadata: {
        '121-21': {
          trialStatus: 'submittedCAV',
        },
      },
      filters: {
        ...expectedBasisReached.filters,
      },
    };

    expect(results).toEqual([
      expectedBasisReached,
      expectedTakenUnderAdvisement,
    ]);
  });
});
