import { CaseAssociationRequestDocument } from './CaseAssociationRequestDocument';
import { CaseAssociationRequestDocumentBase } from './CaseAssociationRequestDocumentBase';
import { CaseAssociationRequestDocumentTypeA } from './CaseAssociationRequestDocumentTypeA';
import { CaseAssociationRequestDocumentTypeB } from './CaseAssociationRequestDocumentTypeB';
import { CaseAssociationRequestDocumentTypeC } from './CaseAssociationRequestDocumentTypeC';
import { CaseAssociationRequestDocumentTypeD } from './CaseAssociationRequestDocumentTypeD';

export function CaseAssociationRequestFactory(
  rawProps,
): CaseAssociationRequestDocument {
  switch (rawProps.documentType) {
    case 'Notice of Intervention':
    case 'Notice of Election to Participate':
    case 'Notice of Election to Intervene':
      return new CaseAssociationRequestDocumentTypeA(rawProps);
    case 'Substitution of Counsel':
      return new CaseAssociationRequestDocumentTypeB(rawProps);
    case 'Motion to Substitute Parties and Change Caption':
      return new CaseAssociationRequestDocumentTypeC(rawProps);
    case 'Entry of Appearance':
    case 'Limited Entry of Appearance':
      return new CaseAssociationRequestDocumentTypeD(rawProps);
    default:
      return new CaseAssociationRequestDocumentBase(rawProps);
  }
}
