import { chambersUserViewsDashboard } from './journey/chambersUserViewsDashboard';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesMessageToChambers } from './journey/petitionsClerkCreatesMessageToChambers';

describe('Chambers dashboard', () => {
  const cerebralTest = setupTest();

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

  loginAs(cerebralTest, 'colvinschambers@example.com');
  chambersUserViewsDashboard(cerebralTest);
});
