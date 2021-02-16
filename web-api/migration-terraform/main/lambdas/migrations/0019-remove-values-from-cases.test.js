const { migrateItems } = require('./0019-remove-values-from-cases');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  const MOCK_CASE_RECORD = {
    ...MOCK_CASE,
    archivedCorrespondences: [{}],
    archivedDocketEntries: [{}],
    correspondence: [{}],
    docketEntries: [{}],
    hearings: [{}],
    irsPractitioners: [{}],
    pk: 'case|105-20',
    privatePractitioners: [{}],
    sk: 'case|105-20',
  };

  beforeEach(() => {});

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify records that are case records without fields not stored in persistence on them', async () => {
    const mockValidCaseRecord = {
      ...MOCK_CASE_RECORD,
      archivedCorrespondences: undefined,
      archivedDocketEntries: undefined,
      correspondence: undefined,
      docketEntries: undefined,
      hearings: undefined,
      irsPractitioners: undefined,
      privatePractitioners: undefined,
    };

    const items = [mockValidCaseRecord];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([mockValidCaseRecord]);
  });

  it('should migrate case records and remove fields not stored in persistence', async () => {
    const items = [MOCK_CASE_RECORD];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toEqual({
      ...MOCK_CASE_RECORD,
      archivedCorrespondences: undefined,
      archivedDocketEntries: undefined,
      correspondence: undefined,
      docketEntries: undefined,
      hearings: undefined,
      irsPractitioners: undefined,
      privatePractitioners: undefined,
    });
  });

  it('should throw an error if the case record is invalid after removing fields not stored in persistence', async () => {
    const items = [{ ...MOCK_CASE_RECORD, partyType: undefined }];

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      'The Case entity was invalid. {"partyType":"\'partyType\' is required"}',
    );
  });
});
