const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { createCase } = require('./createCase');

describe('createCase', () => {
  it('should persist case records', async () => {
    const DOCKET_ENTRY_ID = '2fe3a727-d122-4a7f-830e-16336e36b2c7';
    const IRS_PRACTITIONER_ID = '7703dc49-c241-44ab-b9cb-f05638d9e27c';
    const PRIVATE_PRACTITIONER_ID = '1adddc1e-12c1-49b1-a491-b7d4e7c9e8c0';

    await createCase({
      applicationContext,
      caseToCreate: {
        docketEntries: [
          {
            docketEntryId: DOCKET_ENTRY_ID,
          },
        ],
        docketNumber: '101-20',
        irsPractitioners: [
          {
            name: 'Test IRS Practitioner',
            userId: IRS_PRACTITIONER_ID,
          },
        ],
        privatePractitioners: [
          {
            name: 'Test Private Practitioner',
            userId: PRIVATE_PRACTITIONER_ID,
          },
        ],
      },
    });

    expect(applicationContext.getDocumentClient().put.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            Item: {
              docketNumber: '101-20',
              pk: 'case|101-20',
              sk: 'case|101-20',
            },
          }),
        ],
      ]),
      expect.arrayContaining([
        [
          expect.objectContaining({
            Item: {
              pk: 'case|101-20',
              sk: `docket-entry|${DOCKET_ENTRY_ID}`,
            },
          }),
        ],
      ]),
      expect.arrayContaining([
        [
          expect.objectContaining({
            Item: {
              name: 'Test IRS Practitioner',
              pk: 'case|101-20',
              sk: `irsPractitioner|${IRS_PRACTITIONER_ID}`,
            },
          }),
        ],
      ]),
      expect.arrayContaining([
        [
          expect.objectContaining({
            Item: {
              name: 'Test Private Practitioner',
              pk: 'case|101-20',
              sk: `privatePractitioner|${PRIVATE_PRACTITIONER_ID}`,
            },
          }),
        ],
      ]),
    );
  });

  it('should remove fields not stored on main case record in persistence', async () => {
    await createCase({
      applicationContext,
      caseToCreate: {
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
    });

    const createCaseCall = applicationContext
      .getDocumentClient()
      .put.mock.calls.find(
        x =>
          x[0].Item.pk &&
          x[0].Item.pk.startsWith('case|') &&
          x[0].Item.sk.startsWith('case|'),
      );
    expect(createCaseCall[0].Item).toEqual({
      docketNumber: '101-18',
      docketNumberSuffix: null,
      pk: 'case|101-18',
      sk: 'case|101-18',
      status: CASE_STATUS_TYPES.generalDocket,
      userId: 'petitioner',
    });
  });
});
