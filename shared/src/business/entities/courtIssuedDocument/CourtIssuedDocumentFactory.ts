import { CourtIssuedDocumentPartial } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentPartial';
import { CourtIssuedDocument } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { CourtIssuedDocumentTypeA } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeA';
import { CourtIssuedDocumentTypeB } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeB';
import { CourtIssuedDocumentTypeC } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeC';
import { CourtIssuedDocumentTypeD } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeD';
import { CourtIssuedDocumentTypeE } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeE';
import { CourtIssuedDocumentTypeF } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeF';
import { CourtIssuedDocumentTypeG } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeG';
import { CourtIssuedDocumentTypeH } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeH';
import { CourtIssuedDocumentTypeI } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeI';

export function CourtIssuedDocumentFactory(
  documentMetadata,
): CourtIssuedDocument {
  if (documentMetadata && documentMetadata.scenario) {
    const scenario = documentMetadata.scenario.toLowerCase().trim();
    switch (scenario) {
      case 'type a':
        return new CourtIssuedDocumentTypeA(documentMetadata);
      case 'type b':
        return new CourtIssuedDocumentTypeB(documentMetadata);
      case 'type c':
        return new CourtIssuedDocumentTypeC(documentMetadata);
      case 'type d':
        return new CourtIssuedDocumentTypeD(documentMetadata);
      case 'type e':
        return new CourtIssuedDocumentTypeE(documentMetadata);
      case 'type f':
        return new CourtIssuedDocumentTypeF(documentMetadata);
      case 'type g':
        return new CourtIssuedDocumentTypeG(documentMetadata);
      case 'type h':
        return new CourtIssuedDocumentTypeH(documentMetadata);
      case 'type i':
        return new CourtIssuedDocumentTypeI(documentMetadata);
      default:
        return new CourtIssuedDocumentPartial(documentMetadata);
    }
  } else {
    return new CourtIssuedDocumentPartial(documentMetadata);
  }
}
