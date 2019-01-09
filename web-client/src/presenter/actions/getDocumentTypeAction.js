import { state } from 'cerebral';
import Case from '../../../../shared/src/business/entities/Case';

export default async ({ get, path }) => {
  const documentType = get(state.document.documentType);
  switch (documentType) {
    case Case.documentTypes.answer:
      return path['answer']();
    case Case.documentTypes.stipulatedDecision:
      return path['stipulatedDecision']();
    default:
      return path['generic']();
  }
};
