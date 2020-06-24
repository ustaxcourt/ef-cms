const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { updateCase } = require('./updateCase');

describe('updateCase', () => {
  let firstQueryStub;
  let secondQueryStub;

  beforeEach(() => {
    firstQueryStub = [
      {
        docketNumberSuffix: null,
        inProgress: false,
        pk: 'case|123',
        sk: 'case|123',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    secondQueryStub = [
      {
        gsi1pk: 'user-case|123',
        leadCaseId: '123',
        pk: 'user|123',
        sk: 'case|123',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: async () => null,
    });

    applicationContext.getDocumentClient().delete.mockReturnValue({
      promise: async () => null,
    });

    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce(firstQueryStub)
      .mockReturnValueOnce(secondQueryStub)
      .mockReturnValue([
        {
          sk: '123',
        },
      ]);

    client.query = applicationContext.getDocumentClient().query;
  });

  /**
   * Adds mock private practitioners to test fixture
   */
  function addPrivatePractitioners() {
    firstQueryStub.push({
      name: 'Guy Fieri',
      pk: 'case|123',
      sk: 'privatePractitioner|user-id-existing-123',
      userId: 'user-id-existing-123',
    });
    firstQueryStub.push({
      name: 'Rachel Ray',
      pk: 'case|123',
      sk: 'privatePractitioner|user-id-existing-234',
      userId: 'user-id-existing-234',
    });
  }

  it('updates case', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: null,
        status: CASE_STATUS_TYPES.generalDocket,
        userId: 'petitioner',
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
  });

  it('updates fields on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseCaption: 'Johnny Joe Jacobson, Petitioner',
        caseId: '123',
        docketNumber: '101-18',
        docketNumberSuffix: 'W',
        inProgress: true,
        status: CASE_STATUS_TYPES.calendared,
        trialDate: '2019-03-01T21:40:46.415Z',
        userId: 'petitioner',
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0].Item,
    ).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':caseStatus': CASE_STATUS_TYPES.calendared,
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[1][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':caseTitle': 'Johnny Joe Jacobson',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[2][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':docketNumberSuffix': 'W',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[3][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':trialDate': '2019-03-01T21:40:46.415Z',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[4][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[5][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':caseIsInProgress': true,
      },
    });
  });

  it('updates associated judge on work items', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        associatedJudge: 'Judge Buch',
        caseId: '123',
        docketNumberSuffix: null,
        status: CASE_STATUS_TYPES.generalDocket,
      },
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeValues: {
        ':associatedJudge': 'Judge Buch',
      },
    });
  });

  it('does not update work items if work item fields are unchanged', async () => {
    await updateCase({
      applicationContext,
      caseToUpdate: {
        caseId: '123',
        docketNumberSuffix: null,
        status: CASE_STATUS_TYPES.generalDocket,
      },
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      pk: 'case|123',
      sk: 'case|123',
    });
    expect(applicationContext.getDocumentClient().update).not.toBeCalled();
  });

  describe('irsPractitioners', () => {
    it('adds a irsPractitioner to a case with no existing irsPractitioners', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          irsPractitioners: [
            { name: 'Guy Fieri', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-234',
        userId: 'user-id-existing-234',
      });
    });

    it('adds an irsPractitioner to a case with existing irsPractitioners', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          irsPractitioners: [
            {
              name: 'Bobby Flay',
              userId: 'user-id-new-321',
            },
            { name: 'Guy Fieri', userId: 'user-id-existing-123' },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-new-321',
        userId: 'user-id-new-321',
      });
    });

    it('updates a irsPractitioner on a case', async () => {
      firstQueryStub.push({
        name: 'Guy Fieri',
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
      firstQueryStub.push({
        name: 'Rachel Ray',
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-234',
        userId: 'user-id-existing-234',
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          irsPractitioners: [
            {
              motto: 'Welcome to Flavortown!',
              name: 'Guy Fieri',
              userId: 'user-id-existing-123',
            },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });
      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        motto: 'Welcome to Flavortown!',
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
    });

    it('removes an irsPractitioner from a case with existing irsPractitioners', async () => {
      firstQueryStub.push({
        name: 'Guy Fieri',
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
      firstQueryStub.push({
        name: 'Rachel Ray',
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-234',
        userId: 'user-id-existing-234',
      });

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          irsPractitioners: [
            {
              name: 'Rachel Ray',
              userId: 'user-id-existing-234',
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(applicationContext.getDocumentClient().delete).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls.length,
      ).toEqual(1);
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[0][0].Key,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'irsPractitioner|user-id-existing-123',
      });
    });
  });

  describe('PrivatePractitioners', () => {
    it('adds a privatePractitioner to a case with no existing privatePractitioners', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          privatePractitioners: [
            { name: 'Guy Fieri', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'privatePractitioner|user-id-existing-234',
        userId: 'user-id-existing-234',
      });
    });

    it('adds a privatePractitioner to a case with existing privatePractitioners', async () => {
      addPrivatePractitioners();

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          privatePractitioners: [
            {
              name: 'Bobby Flay',
              userId: 'user-id-new-321',
            },
            { name: 'Guy Fieri', userId: 'user-id-existing-123' },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'privatePractitioner|user-id-new-321',
        userId: 'user-id-new-321',
      });
    });

    it('updates a privatePractitioner on a case', async () => {
      addPrivatePractitioners();

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          privatePractitioners: [
            {
              motto: 'Welcome to Flavortown!',
              name: 'Guy Fieri',
              userId: 'user-id-existing-123',
            },
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(
        applicationContext.getDocumentClient().delete,
      ).not.toHaveBeenCalled();
      expect(applicationContext.getDocumentClient().put).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        motto: 'Welcome to Flavortown!',
        pk: 'case|123',
        sk: 'privatePractitioner|user-id-existing-123',
        userId: 'user-id-existing-123',
      });
    });

    it('removes a privatePractitioner from a case with existing privatePractitioners', async () => {
      addPrivatePractitioners();

      await updateCase({
        applicationContext,
        caseToUpdate: {
          caseId: '123',
          docketNumberSuffix: null,
          privatePractitioners: [
            { name: 'Rachel Ray', userId: 'user-id-existing-234' },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
      });

      expect(applicationContext.getDocumentClient().delete).toHaveBeenCalled();
      expect(
        applicationContext.getDocumentClient().delete.mock.calls.length,
      ).toEqual(1);
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[0][0].Key,
      ).toMatchObject({
        pk: 'case|123',
        sk: 'privatePractitioner|user-id-existing-123',
      });
    });
  });

  describe('user case mappings', () => {
    beforeEach(() => {
      applicationContext.getDocumentClient().query = jest
        .fn()
        .mockResolvedValueOnce(firstQueryStub) // getting case
        .mockResolvedValueOnce([]) // work item mappings
        .mockResolvedValue(secondQueryStub);

      client.query = applicationContext.getDocumentClient().query;
    });

    it('updates user case mapping if the status has changed', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          associatedJudge: 'Judge Buch',
          caseId: '123',
          docketNumber: '101-18',
          docketNumberSuffix: null,
          inProgress: true,
          status: CASE_STATUS_TYPES.calendared,
          trialDate: '2019-03-01T21:40:46.415Z',
          userId: 'petitioner',
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        gsi1pk: 'user-case|123',
        pk: 'user|123',
        sk: 'case|123',
        status: CASE_STATUS_TYPES.calendared,
      });
    });

    it('updates user case mapping if the docket number suffix has changed', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          associatedJudge: 'Judge Buch',
          caseId: '123',
          docketNumber: '101-18',
          docketNumberSuffix: 'W',
          inProgress: true,
          status: CASE_STATUS_TYPES.generalDocket,
          trialDate: '2019-03-01T21:40:46.415Z',
          userId: 'petitioner',
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        docketNumberSuffix: 'W',
        gsi1pk: 'user-case|123',
        pk: 'user|123',
        sk: 'case|123',
      });
    });

    it('updates user case mapping if the case caption has changed', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          associatedJudge: 'Judge Buch',
          caseCaption: 'Guy Fieri, Petitioner',
          caseId: '123',
          docketNumber: '101-18',
          docketNumberSuffix: null,
          inProgress: true,
          status: CASE_STATUS_TYPES.generalDocket,
          trialDate: '2019-03-01T21:40:46.415Z',
          userId: 'petitioner',
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        caseCaption: 'Guy Fieri, Petitioner',
        gsi1pk: 'user-case|123',
        pk: 'user|123',
        sk: 'case|123',
      });
    });

    it('updates user case mapping if the lead case id (consolidation) has changed', async () => {
      await updateCase({
        applicationContext,
        caseToUpdate: {
          associatedJudge: 'Judge Buch',
          caseId: '123',
          docketNumber: '101-18',
          docketNumberSuffix: null,
          inProgress: true,
          leadCaseId: 'case|321',
          status: CASE_STATUS_TYPES.generalDocket,
          trialDate: '2019-03-01T21:40:46.415Z',
          userId: 'petitioner',
        },
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
      ).toMatchObject({
        gsi1pk: 'user-case|123',
        leadCaseId: 'case|321',
        pk: 'user|123',
        sk: 'case|123',
      });
    });
  });
});
