import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCaseWithAttachmentsToPetitionFiles } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../helpers/petitions-clerk-qcs-and-serves-electronic-case';
import { practitionerCreatesEletronicCase } from '../../helpers/practitioner-creates-electronic-case';

describe('users should be able to create cases', () => {
  it('a petitioner should be able to create a case and petitions clerk QCs and serves it', () => {
    const w3Dummy = 'w3-dummy.pdf';
    const atpFilesToAttach = [w3Dummy, w3Dummy, w3Dummy, w3Dummy, w3Dummy];

    loginAsPetitioner();
    petitionerCreatesEletronicCaseWithAttachmentsToPetitionFiles({
      atpFilesToAttach,
    }).then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(
        docketNumber,
        atpFilesToAttach.length,
      );
    });
  });

  it('a practitioner should be able to create a case', () => {
    loginAsPrivatePractitioner();
    practitionerCreatesEletronicCase();
  });

  it('a petitionsclerk should be able to create and serve a paper case', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition();
  });
});
