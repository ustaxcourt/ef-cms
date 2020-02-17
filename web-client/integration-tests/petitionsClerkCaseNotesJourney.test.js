import { setupTest, uploadPetition } from './helpers';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAddsCaseNote from './journey/petitionsClerkAddsCaseNote';
import petitionsClerkDeletesCaseNote from './journey/petitionsClerkDeletesCaseNote';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('petitions clerk case notes journey', () => {
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
  petitionsClerkAddsCaseNote(test);
  petitionsClerkDeletesCaseNote(test);
  userSignsOut(test);
});
