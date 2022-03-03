import { docketClerkVerifiesPetitionReceiptLength } from './journey/docketClerkVerifiesPetitionReceiptLength';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';

const cerebralTest = setupTest();

describe('Petitions Clerk creates a paper case which should have a clinic letter appended to the receipt', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(
    cerebralTest,
    fakeFile,
    'Los Angeles, California',
    'Regular',
  );
  docketClerkVerifiesPetitionReceiptLength(cerebralTest, 2);

  petitionsClerkCreatesNewCaseFromPaper(
    cerebralTest,
    fakeFile,
    'Los Angeles, California',
    'Small',
  );
  docketClerkVerifiesPetitionReceiptLength(cerebralTest, 1);
});
