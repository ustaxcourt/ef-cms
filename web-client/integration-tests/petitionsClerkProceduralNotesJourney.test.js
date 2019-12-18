import { setupTest, uploadPetition } from './helpers';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAddsProceduralNote from './journey/petitionsClerkAddsProceduralNote';
import petitionsClerkDeletesProceduralNote from './journey/petitionsClerkDeletesProceduralNote';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('petitions clerk procedural notes journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogin(test);
  it('Create case', async () => {
    await uploadPetition(test);
  });
  petitionerViewsDashboard(test);
  userSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkAddsProceduralNote(test);
  petitionsClerkDeletesProceduralNote(test);
  userSignsOut(test);
});
