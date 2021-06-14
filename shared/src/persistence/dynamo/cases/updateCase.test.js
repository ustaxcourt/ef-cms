const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { updateCase } = require('./updateCase');
jest.mock('../messages/updateMessage');
jest.mock('../caseDeadlines/getCaseDeadlinesByDocketNumber');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../caseDeadlines/getCaseDeadlinesByDocketNumber');
jest.mock('../caseDeadlines/createCaseDeadline');
const { createCaseDeadline } = require('../caseDeadlines/createCaseDeadline');

describe('updateCase', () => {
  const mockCaseDeadline = {
    associatedJudge: 'Judge Carluzzo',
    caseDeadlineId: 'a37f712d-bb9c-4885-8d35-7b67b908a5aa',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '101-18',
  };

  let oldCase;

  beforeEach(() => {
    oldCase = {
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      correspondence: [],
      docketEntries: [],
      docketNumberSuffix: null,
      hearings: [],
      inProgress: false,
      irsPractitioners: [],
      pk: 'case|101-18',
      privatePractitioners: [],
      sk: 'case|101-18',
      status: 'General Docket - Not at Issue',
    };

    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: async () => null,
    });

    applicationContext.getDocumentClient().delete.mockReturnValue({
      promise: async () => null,
    });

    applicationContext.getDocumentClient().query.mockReturnValue([
      {
        sk: '123',
      },
    ]);

    client.query = applicationContext.getDocumentClient().query;

    getCaseDeadlinesByDocketNumber.mockReturnValue([mockCaseDeadline]);
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
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
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
    });

    const caseUpdateCall = applicationContext
      .getDocumentClient()
      .put.mock.calls.find(
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

  it('updates associated judge on case deadlines', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        docketNumberSuffix: null,
        status: CASE_STATUS_TYPES.generalDocket,
      },
      oldCase,
    });

    expect(createCaseDeadline).toHaveBeenCalled();
    expect(createCaseDeadline.mock.calls[0][0].caseDeadline).toMatchObject({
      ...mockCaseDeadline,
      associatedJudge: 'Judge Buch',
    });
  });
});
