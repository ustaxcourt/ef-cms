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

const test = setupTest();

describe('Petitions clerk case journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(test, fakeFile);
  petitionsClerkVerifiesOrderForOdsCheckbox(test, fakeFile);
  petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox(test, fakeFile);
  petitionsClerkVerifiesPetitionPaymentFeeOptions(test, fakeFile);

  loginAs(test, 'petitioner@example.com');
  it('Create case #1', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkEditsPetitionInQCIRSNotice(test);
  petitionsClerkChangesCaseCaptionDuringQC(test);

  loginAs(test, 'petitioner@example.com');
  it('Create case #2', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.docketEntryId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsDeficiencyStatisticToCase(test);
  petitionsClerkCancelsAddingDeficiencyStatisticToCase(test);
  petitionsClerkEditsDeficiencyStatistic(test);
  petitionsClerkDeleteDeficiencyStatistic(test);

  petitionsClerkAddsOtherStatisticsToCase(test);
  petitionsClerkEditOtherStatisticToCase(test);
  petitionsClerkDeletesOtherStatisticToCase(test);
});
