import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPetitionAction } from '../actions/clearPetitionAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getFilingTypesAction } from '../actions/getFilingTypesAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { prepareFormAction } from '../actions/prepareFormAction';
import { set } from 'cerebral/factories';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFilingTypesAction } from '../actions/setFilingTypesAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { state } from 'cerebral';

export const gotoStartCaseSequence = [
  clearAlertsAction,
  clearPetitionAction,
  clearFormAction,
  clearScreenMetadataAction,
  prepareFormAction,
  set(state.showValidation, false),
  getUserRoleAction,
  {
    docketclerk: [setCurrentPageAction('StartCaseInternal')],
    petitioner: [
      getCaseTypesAction,
      setCaseTypesAction,
      getFilingTypesAction,
      setFilingTypesAction,
      getProcedureTypesAction,
      setProcedureTypesAction,
      setCurrentPageAction('StartCase'),
    ],
    petitionsclerk: [setCurrentPageAction('StartCaseInternal')],
    practitioner: [
      getCaseTypesAction,
      setCaseTypesAction,
      getFilingTypesAction,
      setFilingTypesAction,
      getProcedureTypesAction,
      setProcedureTypesAction,
      setCurrentPageAction('StartCase'),
    ],
  },
];
