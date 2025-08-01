import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const goToDawsonUIComponentSequence = showProgressSequenceDecorator([
  setupCurrentPageAction('DawsonUIComponents'),
]);
