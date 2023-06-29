import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsDeficiencyStatisticToCase } from './journey/petitionsClerkAddsDeficiencyStatisticToCase';
import { petitionsClerkAddsOtherStatisticsToCase } from './journey/petitionsClerkAddsOtherStatisticsToCase';
import { petitionsClerkCancelsAddingDeficiencyStatisticToCase } from './journey/petitionsClerkCancelsAddingDeficiencyStatisticToCase';
import { petitionsClerkChangesCaseCaptionDuringQC } from './journey/petitionsClerkChangesCaseCaptionDuringQC';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkDeleteDeficiencyStatistic } from './journey/petitionsClerkDeleteDeficiencyStatistic';
import { petitionsClerkDeletesOtherStatisticToCase } from './journey/petitionsClerkDeletesOtherStatisticToCase';
import { petitionsClerkEditOtherStatisticToCase } from './journey/petitionsClerkEditOtherStatisticToCase';
import { petitionsClerkEditsDeficiencyStatistic } from './journey/petitionsClerkEditsDeficiencyStatistic';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkReviewsPaperCaseBeforeServing } from './journey/petitionsClerkReviewsPaperCaseBeforeServing';
import { petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox } from './journey/petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox';
import { petitionsClerkVerifiesOrderForCdsCheckbox } from './journey/petitionsClerkVerifiesOrderForCdsCheckbox';
import { petitionsClerkVerifiesPetitionPaymentFeeOptions } from './journey/petitionsClerkVerifiesPetitionPaymentFeeOptions';

describe('Petitions clerk case journey', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
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
  petitionsClerkVerifiesOrderForCdsCheckbox(cerebralTest, fakeFile);
  petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox(
    cerebralTest,
    fakeFile,
  );
  petitionsClerkVerifiesPetitionPaymentFeeOptions(cerebralTest, fakeFile);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #1', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkEditsPetitionInQCIRSNotice(cerebralTest);
  petitionsClerkChangesCaseCaptionDuringQC(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case #2', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsDeficiencyStatisticToCase(cerebralTest);
  petitionsClerkCancelsAddingDeficiencyStatisticToCase(cerebralTest);
  petitionsClerkEditsDeficiencyStatistic(cerebralTest);
  petitionsClerkDeleteDeficiencyStatistic(cerebralTest);

  petitionsClerkAddsOtherStatisticsToCase(cerebralTest);
  petitionsClerkEditOtherStatisticToCase(cerebralTest);
  petitionsClerkDeletesOtherStatisticToCase(cerebralTest);
});
