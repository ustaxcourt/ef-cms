// create a paper case as a petitionsClerk
// set payment status to "unpaid"
// go to review and serve page
// verify alert warning banner displays "OFF" stuff
// serve the case
// check that OFF is on the docket record
// verify that filing fee due date is set to Today+60 (no holidays or weekends)

import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerk1ServesPetitionFromMessageDetail } from './journey/petitionsClerk1ServesPetitionFromMessageDetail';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Petitions Clerk Serves Paper Petition With System Generated Documents', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  // expect
  //   loginAs(cerebralTest, 'petitionsclerk1@example.com');
  //   petitionsClerk1ViewsMessageInbox(cerebralTest);
  //   petitionsClerk1ViewsMessageDetail(cerebralTest);
  //   petitionsClerk1ServesPetitionFromMessageDetail(cerebralTest);
});
