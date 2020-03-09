import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';

export const gotoAttorneyListSequence = [
  getUsersInSectionAction({ section: 'privatePractitioner' }),
  setUsersByKeyAction('practitionerUsers'),
  getUsersInSectionAction({ section: 'irsPractitioner' }),
  setUsersByKeyAction('respondentUsers'),
  getUsersInSectionAction({ section: 'inactivePractitioner' }),
  setUsersByKeyAction('inactivePractitionerUsers'),
  getUsersInSectionAction({ section: 'inactiveRespondent' }),
  setUsersByKeyAction('inactiveRespondentUsers'),
  setCurrentPageAction('AttorneyList'),
];
