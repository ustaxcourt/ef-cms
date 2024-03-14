import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { cypressState } from '../../state';
import { logout } from '../../../helpers/auth/logout';
import { petitionerCreatesElectronicCase } from '../../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../helpers/petitionsclerk-serves-petition';

Given('I electronically file a petition', () => {
  petitionerCreatesElectronicCase().then(docketNumber => {
    petitionsClerkServesPetition(docketNumber);
    cypressState.docketNumber = docketNumber;
    logout();
  });
});
