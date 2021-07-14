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
import { petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox } from './journey/petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox';
import { petitionsClerkVerifiesOrderForOdsCheckbox } from './journey/petitionsClerkVerifiesOrderForOdsCheckbox';
import { petitionsClerkVerifiesPetitionPaymentFeeOptions } from './journey/petitionsClerkVerifiesPetitionPaymentFeeOptions';

const cerebralTest = setupTest();

describe('Petitions clerk case journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkVerifiesOrderForOdsCheckbox(cerebralTest, fakeFile);
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
