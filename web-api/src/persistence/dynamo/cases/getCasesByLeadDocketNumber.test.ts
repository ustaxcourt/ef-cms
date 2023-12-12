import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesByLeadDocketNumber } from './getCasesByLeadDocketNumber';

describe('getCasesByLeadDocketNumber', () => {
  it('attempts to retrieve the cases by leadDocketNumber', async () => {
    applicationContext.getDocumentClient().query.mockResolvedValue({
      Items: [
        {
          docketNumber: '123-20',
          pk: 'case|123-20',
          sk: 'case|123-20',
        },
      ],
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        docketEntries: [],
        irsPractitioners: [],
        pk: 'case|123-20',
        privatePractitioners: [],
        sk: 'case|123-20',
        status: CASE_STATUS_TYPES.new,
      });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toEqual([
      {
        docketEntries: [],
        irsPractitioners: [],
        pk: 'case|123-20',
        privatePractitioners: [],
        sk: 'case|123-20',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('returns an empty array when no items are returned', async () => {
    applicationContext.getDocumentClient().query.mockResolvedValueOnce({
      Items: [],
    });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
