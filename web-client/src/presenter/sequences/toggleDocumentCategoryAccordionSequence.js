import { state } from 'cerebral';
import { toggle } from 'cerebral/factories';

export const toggleDocumentCategoryAccordionSequence = [
  toggle(state.form.showDocumentCategoryAccordion),
];
