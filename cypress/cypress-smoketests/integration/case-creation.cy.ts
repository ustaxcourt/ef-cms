import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { createEletronicCase } from '../../helpers/create-electronic-case';
import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';

describe('users should be able to create cases', () => {
  it('a petitioner should be able to create a case', () => {
    loginAsPetitioner();
    createEletronicCase();
  });

  it('a practitioner should be able to create a case', () => {
    loginAsPrivatePractitioner();
    createEletronicCase();
  });

  it('a petitionsclerk should be able to create and serve a paper case', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition();
  });
});
