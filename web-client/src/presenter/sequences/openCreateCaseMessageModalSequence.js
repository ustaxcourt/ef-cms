import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const openCreateCaseMessageModalSequence = showProgressSequenceDecorator(
  [
    clearFormAction,
    clearAlertsAction,
    setShowModalFactoryAction('CreateCaseModal'),
  ],
);
