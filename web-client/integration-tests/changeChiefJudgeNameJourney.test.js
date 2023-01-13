import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import {
  fakeFile,
  loginAs,
  setChiefJudgeNameFlagValue,
  setJudgeTitle,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';

describe('Chief Judge feature flag configuration', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  const judgeFoleyUserId = '659789b4-acc5-40b7-9318-3354e7eb8604';
  const kerriganFullName = 'Kathleen Kerrigan';
  const foleyFullName = 'Maurice B. Foley';

  beforeAll(async () => {
    await setJudgeTitle(judgeFoleyUserId, 'Chief Judge');
    await setChiefJudgeNameFlagValue(foleyFullName);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await setJudgeTitle(judgeFoleyUserId, 'Chief Judge');
    await setChiefJudgeNameFlagValue(foleyFullName);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkReviewsPaperCaseBeforeServing(cerebralTest, {
    hasIrsNoticeFormatted: 'No',
    ordersAndNoticesInDraft: ['Order Designating Place of Trial'],
    ordersAndNoticesNeeded: ['Order for Ratification of Petition'],
    petitionPaymentStatusFormatted: 'Waived 05/05/05',
    receivedAtFormatted: '01/01/01',
    shouldShowIrsNoticeDate: false,
  });
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
        foleyFullName,
      );
    });

    it('should correctly retrieve the Chief Judge name flag value after it has been update in dynamo', async () => {
      const { docketEntryId } = cerebralTest.draftOrders[0];

      await setChiefJudgeNameFlagValue(kerriganFullName);

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('pdfForSigning.nameForSigning')).toEqual(
        kerriganFullName,
      );
    });
  });

  describe('Update judgeTitle', () => {
    loginAs(cerebralTest, 'judgefoley@example.com');

    it('should retrieve correct judgeTitle before and after being updated in dynamo', async () => {
      const { docketEntryId } = cerebralTest.draftOrders[0];

      expect(cerebralTest.getState('user.judgeTitle')).toEqual('Chief Judge');

      await setJudgeTitle(judgeFoleyUserId, 'Judge');

      await cerebralTest.runSequence('gotoSignOrderSequence', {
        docketEntryId,
        docketNumber: cerebralTest.docketNumber,
      });

      expect(
        cerebralTest.getState('pdfForSigning.nameForSigningLine2'),
      ).toEqual('Judge');
    });
  });
});
