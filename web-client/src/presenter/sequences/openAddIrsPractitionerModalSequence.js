import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getDefaultServiceIndicatorForPractitionerMatchesAction } from '../actions/getDefaultServiceIndicatorForPractitionerMatchesAction';
import { getIrsPractitionersBySearchKeyAction } from '../actions/ManualAssociation/getIrsPractitionersBySearchKeyAction';
import { isRespondentInCaseAction } from '../actions/isRespondentInCaseAction';
import { setDefaultServiceIndicatorAction } from '../actions/setDefaultServiceIndicatorAction';
import { setRespondentsAction } from '../actions/ManualAssociation/setRespondentsAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openAddIrsPractitionerModalSequence =
  showProgressSequenceDecorator([
    clearAlertsAction,
    clearModalStateAction,
    setDefaultServiceIndicatorAction('modal'),
    getIrsPractitionersBySearchKeyAction,
    {
      error: [setValidationErrorsAction],
      success: [
        setRespondentsAction,
        getDefaultServiceIndicatorForPractitionerMatchesAction(
          'respondentMatches',
        ),
        setDefaultServiceIndicatorAction('modal'),
        isRespondentInCaseAction,
        {
          no: [setShowModalFactoryAction('AddIrsPractitionerModal')],
          yes: [setShowModalFactoryAction('RespondentExistsModal')],
        },
      ],
    },
  ]);
