import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleDocumentCategoryAccordionSequence = [
  toggle(state.form.showDocumentCategoryAccordion),
];
