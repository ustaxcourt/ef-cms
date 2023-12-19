import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCaseForSelfAndDeceasedSpouse } from '../../helpers/petitioner-creates-electronic-case-for-self-and-deceased-spouse.cy';

describe('Petitions clerk QCs a case with petitioner and deceased spouse', () => {
  it('should have the right data', () => {
    // working title
    petitionerCreatesEletronicCaseForSelfAndDeceasedSpouse().then(
      docketNumber => {
        loginAsPetitionsClerk();
        console.log('docket number:', docketNumber);
      },
    );
  });
});
