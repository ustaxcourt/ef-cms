import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox } from './journey/petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox';
import { petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox } from './journey/petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox';

describe('Docket clerk consolidated case messages journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const leadCaseDocketNumber = '111-19';
  const consolidatedCaseDocketNumber = '112-19';

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    docketNumber: leadCaseDocketNumber,
    preserveCreatedMessage: false,
  });
  petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox(cerebralTest, {
    docketNumber: leadCaseDocketNumber,
  });

  createNewMessageOnCase(cerebralTest, {
    docketNumber: consolidatedCaseDocketNumber,
    preserveCreatedMessage: false,
  });
  petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox(cerebralTest, {
    docketNumber: consolidatedCaseDocketNumber,
  });
});
