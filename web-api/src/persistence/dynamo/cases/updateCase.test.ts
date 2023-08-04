import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { put } from '../../dynamodbClientService';
import { updateCase } from './updateCase';

jest.mock('../../dynamodbClientService');

describe('updateCase', () => {
  let oldCase;

  beforeEach(() => {
    oldCase = {
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      correspondence: [],
      docketEntries: [],
      docketNumberSuffix: null,
      hearings: [],
      irsPractitioners: [],
      pk: 'case|101-18',
      privatePractitioners: [],
      sk: 'case|101-18',
      status: 'General Docket - Not at Issue',
    };

    (put as jest.Mock).mockResolvedValue(null);
  });

  it('updates case', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: CASE_STATUS_TYPES.generalDocket,
        userId: 'petitioner',
      },
      oldCase,
    } as any);

    expect((put as jest.Mock).mock.calls[0][0].Item).toMatchObject({
      pk: 'case|101-18',
      sk: 'case|101-18',
    });
  });

  it('should remove fields not stored on main case record in persistence', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        archivedCorrespondences: [{}],
        archivedDocketEntries: [{}],
        correspondence: [{}],
        docketEntries: [{}],
        docketNumber: '101-18',
        docketNumberSuffix: null,
        hearings: [{}],
        irsPractitioners: [{}],
        privatePractitioners: [{}],
        status: CASE_STATUS_TYPES.generalDocket,
        userId: 'petitioner',
      },
      oldCase,
    } as any);

    const caseUpdateCall = (put as jest.Mock).mock.calls.find(
      x =>
        x[0].Item.pk &&
        x[0].Item.pk.startsWith('case|') &&
        x[0].Item.sk.startsWith('case|'),
    );
    expect(caseUpdateCall[0].Item).toEqual({
      docketNumber: '101-18',
      docketNumberSuffix: null,
      pk: 'case|101-18',
      sk: 'case|101-18',
      status: CASE_STATUS_TYPES.generalDocket,
      userId: 'petitioner',
    });
  });
});
