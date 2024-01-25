import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import { practitionerCreatesEletronicCase } from '../../helpers/practitioner-creates-electronic-case';

describe('users should be able to create cases', () => {
  it('a practitioner should be able to create a case', () => {
    loginAsPrivatePractitioner();
    practitionerCreatesEletronicCase();
  });

  it('a petitionsclerk should be able to create and serve a paper case', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition();
  });
});
