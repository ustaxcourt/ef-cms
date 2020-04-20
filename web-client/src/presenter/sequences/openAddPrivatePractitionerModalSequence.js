import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getPrivatePractitionersBySearchKeyAction } from '../actions/ManualAssociation/getPrivatePractitionersBySearchKeyAction';
import { isPractitionerInCaseAction } from '../actions/isPractitionerInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setPractitionersAction } from '../actions/ManualAssociation/setPractitionersAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openAddPrivatePractitionerModalSequence = showProgressSequenceDecorator(
  [
    clearAlertsAction,
    clearModalStateAction,
    setDefaultServiceIndicatorAction('modal'),
    getPrivatePractitionersBySearchKeyAction,
    {
      error: [setValidationErrorsAction],
      success: [
        setPractitionersAction,
        isPractitionerInCaseAction,
        {
          no: [setShowModalFactoryAction('AddPrivatePractitionerModal')],
          yes: [setShowModalFactoryAction('PractitionerExistsModal')],
        },
      ],
    },
  ],
);
