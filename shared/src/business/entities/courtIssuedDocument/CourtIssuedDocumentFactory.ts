import { CourtIssuedDocument } from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { CourtIssuedDocumentTypeA } from './CourtIssuedDocumentTypeA';
import { CourtIssuedDocumentTypeB } from './CourtIssuedDocumentTypeB';
import { CourtIssuedDocumentTypeC } from './CourtIssuedDocumentTypeC';
import { CourtIssuedDocumentTypeD } from './CourtIssuedDocumentTypeD';
import { CourtIssuedDocumentTypeE } from './CourtIssuedDocumentTypeE';
import { CourtIssuedDocumentTypeF } from './CourtIssuedDocumentTypeF';
import { CourtIssuedDocumentTypeG } from './CourtIssuedDocumentTypeG';
import { CourtIssuedDocumentTypeH } from './CourtIssuedDocumentTypeH';

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
    }
  }

  return new CourtIssuedDocumentBase(documentMetadata);
}
