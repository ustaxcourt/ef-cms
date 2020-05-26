import { docketClerkAddsCorrespondence } from './journey/docketClerkAddsCorrespondence';
import { docketClerkNavigatesToAddCorrespondence } from './journey/docketClerkNavigatesToAddCorrespondence';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();
let caseDetail;

describe('Adds correspondence to a case', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('create case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  docketClerkNavigatesToAddCorrespondence(test);
  docketClerkAddsCorrespondence(test);
});
