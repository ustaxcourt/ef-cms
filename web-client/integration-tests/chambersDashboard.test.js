import { chambersUserViewsDashboard } from './journey/chambersUserViewsDashboard';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesCaseMessageToChambers } from './journey/petitionsClerkCreatesCaseMessageToChambers';

const test = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesCaseMessageToChambers(test);

  loginAs(test, 'armensChambers@example.com');
  chambersUserViewsDashboard(test);
});
