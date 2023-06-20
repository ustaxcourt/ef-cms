import { updateAdvancedSearchFormAction } from '../actions/AdvancedSearch/updateAdvancedSearchFormAction';
import { validateCaseAdvancedSearchFormSequence } from './validateCaseAdvancedSearchFormSequence';

export const updateCaseAdvancedSearchByNameFormValueSequence = [
  updateAdvancedSearchFormAction('caseSearchByName'),
  validateCaseAdvancedSearchFormSequence,
];
