import { petitionerCreatesACase } from '../../helpers/petitioner-creates-a-case';
import { petitionsclerkCreatesAndServesPaperPetition } from '../../helpers/petitionsclerk-creates-and-serves-paper-petition';
import { practitionerCreatesACase } from '../../helpers/practitioner-creates-a-case';

describe('users should be able to create cases', () => {
  it('a petitioner should be able to create a case', () => {
    petitionerCreatesACase();
  });

  it('a practitioner should be able to create a case', () => {
    practitionerCreatesACase();
  });

  it('a petitionsclerk should be able to create and serve a paper case', () => {
    petitionsclerkCreatesAndServesPaperPetition();
  });
});
