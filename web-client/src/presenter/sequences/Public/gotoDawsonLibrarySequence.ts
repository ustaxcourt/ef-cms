import { setupCurrentPageAction } from '../../actions/setupCurrentPageAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';

export const gotoDawsonLibrarySequence = showProgressSequenceDecorator([
  setupCurrentPageAction('DawsonLibrary'),
]);
