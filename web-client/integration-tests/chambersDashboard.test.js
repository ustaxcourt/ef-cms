import { chambersUserViewsDashboard } from './journey/chambersUserViewsDashboard';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';

const cerebralTest = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesMessageToChambers(cerebralTest);

  loginAs(cerebralTest, 'colvinsChambers@example.com');
  chambersUserViewsDashboard(cerebralTest);
});
