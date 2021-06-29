const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { createCase } = require('./createCase');

describe('createCase', () => {
  it('should remove fields not stored on main case record and put into persistence', async () => {
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
