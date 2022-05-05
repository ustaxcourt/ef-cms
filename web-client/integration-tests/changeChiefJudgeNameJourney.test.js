import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import {
  fakeFile,
  loginAs,
  setChiefJudgeNameFlagValue,
  setJudgeTitle,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

const judgeFoleyUserId = '659789b4-acc5-40b7-9318-3354e7eb8604';

describe('Chief Judge feature flag configuration', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    await setJudgeTitle(judgeFoleyUserId, 'Chief Judge');
    await setChiefJudgeNameFlagValue('Maurice B. Foley');
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  loginAs(cerebralTest, 'docketclerk1@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  describe('Update chief-judge-name in deploy table', () => {
    it("should retrieve the Chief Judge's name correctly", async () => {
      const { docketEntryId } = cerebralTest.draftOrders[0];

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('pdfForSigning.nameForSigning')).toEqual(
        'Maurice B. Foley',
      );
    });

    it('should correctly retrieve the Chief Judge name flag value after it has been update in dynamo', async () => {
      const { docketEntryId } = cerebralTest.draftOrders[0];

      await setChiefJudgeNameFlagValue('Kathleen Kerrigan');

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('pdfForSigning.nameForSigning')).toEqual(
        'Kathleen Kerrigan',
      );
    });
  });

  // describe('Update judgeTitle', () => {
  //   loginAs(cerebralTest, 'judgeFoley@example.com');

  //   it('should retrieve correct judgeTitle before and after being updated in dynamo', async () => {
  //     const { docketEntryId } = cerebralTest.draftOrders[0];

  //     expect(cerebralTest.getState('user.judgeTitle')).toEqual('Chief Judge');

  //     await setJudgeTitle(judgeFoleyUserId, 'Judge');

  //     await cerebralTest.runSequence('gotoSignOrderSequence', {
  //       docketEntryId,
  //       docketNumber: cerebralTest.docketNumber,
  //     });

  //     expect(
  //       cerebralTest.getState('pdfForSigning.nameForSigningLine2'),
  //     ).toEqual('Judge');
  //   });
  // });
});
