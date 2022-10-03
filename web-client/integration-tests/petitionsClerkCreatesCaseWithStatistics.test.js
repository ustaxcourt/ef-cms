import { CASE_TYPES_MAP } from '../../shared/src/business/entities/EntityConstants';
import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';

describe('Petitions clerk creates case with statistics', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(cerebralTest, fakeFile);
  petitionsClerkEditsSavedPetition(cerebralTest);

  it('should do stuff', async () => {
    // select yes for irs notice

    // select deficiency for case type

    await cerebralTest.runSequence('updateStartCaseFormValueSequence', {
      key: 'caseType',
      value: CASE_TYPES_MAP.deficiency,
    });

    // enter year, amount, total penalites
    // click on 'calculate penalties'
    // submit case
    // expect no validation errors
  });
});
