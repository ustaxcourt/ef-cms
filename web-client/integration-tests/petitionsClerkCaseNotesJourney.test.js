import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkAddsCaseNote } from './journey/petitionsClerkAddsCaseNote';
import { petitionsClerkDeletesCaseNote } from './journey/petitionsClerkDeletesCaseNote';

const test = setupTest();

describe('petitions clerk case notes journey', () => {
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
  petitionsClerkAddsCaseNote(test);
  petitionsClerkDeletesCaseNote(test);
});
