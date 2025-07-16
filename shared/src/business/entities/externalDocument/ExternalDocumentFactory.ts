import { ExternalDocumentBase } from './ExternalDocumentBase';
import { ExternalDocumentNonStandardA } from './ExternalDocumentNonStandardA';
import { ExternalDocumentNonStandardB } from './ExternalDocumentNonStandardB';
import { ExternalDocumentNonStandardC } from './ExternalDocumentNonStandardC';
import { ExternalDocumentNonStandardD } from './ExternalDocumentNonStandardD';
import { ExternalDocumentNonStandardE } from './ExternalDocumentNonStandardE';
import { ExternalDocumentNonStandardF } from './ExternalDocumentNonStandardF';
import { ExternalDocumentNonStandardG } from './ExternalDocumentNonStandardG';
import { ExternalDocumentNonStandardH } from './ExternalDocumentNonStandardH';
import { ExternalDocumentNonStandardI } from './ExternalDocumentNonStandardI';
import { ExternalDocumentNonStandardJ } from './ExternalDocumentNonStandardJ';
import { ExternalDocumentStandard } from './ExternalDocumentStandard';

export function ExternalDocumentFactory(
  documentMetadata,
): ExternalDocumentBase {
  if (documentMetadata && documentMetadata.scenario) {
    const scenario = documentMetadata.scenario.toLowerCase().trim();

    switch (scenario) {
      case 'nonstandard a':
        return new ExternalDocumentNonStandardA(documentMetadata);
      case 'nonstandard b':
        return new ExternalDocumentNonStandardB(documentMetadata);
      case 'nonstandard c':
        return new ExternalDocumentNonStandardC(documentMetadata);
      case 'nonstandard d':
        return new ExternalDocumentNonStandardD(documentMetadata);
      case 'nonstandard e':
        return new ExternalDocumentNonStandardE(documentMetadata);
      case 'nonstandard f':
        return new ExternalDocumentNonStandardF(documentMetadata);
      case 'nonstandard g':
        return new ExternalDocumentNonStandardG(documentMetadata);
      case 'nonstandard h':
        return new ExternalDocumentNonStandardH(documentMetadata);
      case 'nonstandard i':
        return new ExternalDocumentNonStandardI(documentMetadata);
      case 'nonstandard j':
        return new ExternalDocumentNonStandardJ(documentMetadata);
    }
  }

  return new ExternalDocumentStandard(documentMetadata);
}
