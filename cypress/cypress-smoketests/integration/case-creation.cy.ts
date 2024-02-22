import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../helpers/petitions-clerk-qcs-and-serves-electronic-case';
import { practitionerCreatesElectronicCase } from '../../helpers/practitioner-creates-electronic-case';

describe('users should be able to create cases', () => {
  it('a petitioner should be able to create a case and petitions clerk QCs and serves it', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
    });
  });

  it('a practitioner should be able to create a case', () => {
    loginAsPrivatePractitioner();
    practitionerCreatesElectronicCase();
  });

  it('a petitionsclerk should be able to create and serve a paper case', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition();
  });
});
