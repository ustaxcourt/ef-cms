import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../state';
import { login } from '../auth/login';
import { logout } from '../auth/logout';
import { petitionerCreatesElectronicCase } from '../../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../helpers/petitionsclerk-serves-petition';

Given('I am party to a case', () => {
  const { email } = cypressState.currentUser;
  login({ email });

  petitionerCreatesElectronicCase().then(docketNumber => {
    petitionsClerkServesPetition(docketNumber);

    cypressState.docketNumber = docketNumber;

    logout();
  });

  login({ email });
});
