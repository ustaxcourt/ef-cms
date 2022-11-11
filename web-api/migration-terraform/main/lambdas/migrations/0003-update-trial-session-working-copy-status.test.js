import { camelCase } from 'lodash';
import { migrateItems } from './0003-update-trial-session-working-copy-status';
import { v4 as uuidv4 } from 'uuid';

describe('migrateItems', () => {
  let documentClient;

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
    };
  });

  const mockBasisReached = {
    caseMetadata: {
      '109-19': {
        trialStatus: 'aBasisReached',
      },
      '120-20': {
        trialStatus: 'aBasisReached',
      },
    },
    pk: `trial-session-working-copy|${uuidv4()}`,
    sk: `user|${uuidv4()}`,
  };
  const mockTakenUnderAdvisement = {
    caseMetadata: {
      '121-21': {
        trialStatus: 'takenUnderAdvisement',
      },
    },
    pk: `trial-session-working-copy|${uuidv4()}`,
    sk: `user|${uuidv4()}`,
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

  it('should return and not modify trial session workingCopies that have no trialStatus change', async () => {
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
          trialStatus: 'basisReached',
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
});
