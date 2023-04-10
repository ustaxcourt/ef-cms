import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsCaseNote } from './journey/petitionsClerkAddsCaseNote';
import { petitionsClerkDeletesCaseNote } from './journey/petitionsClerkDeletesCaseNote';

describe('petitions clerk case notes journey', () => {
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
  petitionsClerkAddsCaseNote(cerebralTest);
  petitionsClerkDeletesCaseNote(cerebralTest);
});
