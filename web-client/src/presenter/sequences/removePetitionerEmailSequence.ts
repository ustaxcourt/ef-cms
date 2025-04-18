import { removePetitionerEmailAction } from '@web-client/presenter/actions/CaseAssociation/removePetitionerEmailAction';
import { clearModalAction } from '../actions/clearModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { navigateToCaseDetailCaseInformationActionFactory } from '@web-client/presenter/actions/navigateToCaseDetailCaseInformationActionFactory';
import { setSaveAlertsForNavigationAction } from '@web-client/presenter/actions/setSaveAlertsForNavigationAction';
import { clearModalStateAction } from '@web-client/presenter/actions/clearModalStateAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { state } from '@web-client/presenter/app.cerebral';

export const removePetitionerEmailSequence = showProgressSequenceDecorator([
  clearModalAction,
  removePetitionerEmailAction,
  {
    error: [setAlertErrorAction, clearModalAction, clearModalStateAction],
    success: [
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      // This is a workaround to force the router (in navigateToCaseDetailCaseInformationActionFactory)
      // to re-run the router handler in the event that the user is removing the email
      // immediately after having edited the petitioner details via the edit form.
      ({ get, router }) => {
        const { docketNumber } = get(state.caseDetail);
        router.route(`/case-detail/${docketNumber}`);
      },
      navigateToCaseDetailCaseInformationActionFactory('parties'),
    ],
  },
]) as unknown as () => void;
