import { ExternalDocumentBase } from '@shared/business/entities/externalDocument/ExternalDocumentBase';
import { ExternalDocumentNonStandardA } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardA';
import { ExternalDocumentNonStandardB } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardB';
import { ExternalDocumentNonStandardC } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardC';
import { ExternalDocumentNonStandardD } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardD';
import { ExternalDocumentNonStandardE } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardE';
import { ExternalDocumentNonStandardF } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardF';
import { ExternalDocumentNonStandardG } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardG';
import { ExternalDocumentNonStandardH } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardH';
import { ExternalDocumentNonStandardI } from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardI';
import { ExternalDocumentStandard } from '@shared/business/entities/externalDocument/ExternalDocumentStandard';

export function ExternalDocumentFactory(
  documentMetadata: any,
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
    }
  }

  return new ExternalDocumentStandard(documentMetadata);
}
