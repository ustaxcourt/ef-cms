import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const clearDocumentSequence = [set(state.document, {})];
