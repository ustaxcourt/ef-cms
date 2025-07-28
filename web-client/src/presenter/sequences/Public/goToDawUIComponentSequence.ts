import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const goToDawUIComponentSequence = showProgressSequenceDecorator([
  setupCurrentPageAction('DawUIComponents'),
]);
