import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesByDocketNumbers } from './getCasesByDocketNumbers';

describe('getCasesByDocketNumbers', () => {
  it('should call batchGet with keys for docket numbers passed in', async () => {
    await getCasesByDocketNumbers({
      applicationContext,
      docketNumbers: ['123-20', '124-20'],
    });

    expect(
      applicationContext.getDocumentClient().batchGet.mock.calls[0][0],
    ).toMatchObject({
      RequestItems: {
        'efcms-local': {
          Keys: [
            {
              pk: 'case|123-20',
              sk: 'case|123-20',
            },
            {
              pk: 'case|124-20',
              sk: 'case|124-20',
            },
          ],
        },
      },
    });
  });

  it('should filter out duplicate docket numbers before calling batchGet', async () => {
    await getCasesByDocketNumbers({
      applicationContext,
      docketNumbers: ['123-20', '124-20', '123-20'],
    });

    expect(
      applicationContext.getDocumentClient().batchGet.mock.calls[0][0],
    ).toMatchObject({
      RequestItems: {
        'efcms-local': {
          Keys: [
            {
              pk: 'case|123-20',
              sk: 'case|123-20',
            },
            {
              pk: 'case|124-20',
              sk: 'case|124-20',
            },
          ],
        },
      },
    });
  });
});
