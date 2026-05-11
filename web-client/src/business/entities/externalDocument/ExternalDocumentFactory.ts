import { ExternalDocumentBase } from '@shared/business/entities/externalDocument/ExternalDocumentBase';
import {
  ExternalDocumentNonStandardA,
  type RawExternalDocumentNonStandardA,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardA';
import {
  ExternalDocumentNonStandardB,
  type RawExternalDocumentNonStandardB,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardB';
import {
  ExternalDocumentNonStandardC,
  type RawExternalDocumentNonStandardC,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardC';
import {
  ExternalDocumentNonStandardD,
  type RawExternalDocumentNonStandardD,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardD';
import {
  ExternalDocumentNonStandardE,
  type RawExternalDocumentNonStandardE,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardE';
import {
  ExternalDocumentNonStandardF,
  type RawExternalDocumentNonStandardF,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardF';
import {
  ExternalDocumentNonStandardG,
  type RawExternalDocumentNonStandardG,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardG';
import {
  ExternalDocumentNonStandardH,
  type RawExternalDocumentNonStandardH,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardH';
import {
  ExternalDocumentNonStandardI,
  type RawExternalDocumentNonStandardI,
} from '@shared/business/entities/externalDocument/ExternalDocumentNonStandardI';
import {
  ExternalDocumentStandard,
  type RawExternalDocumentStandard,
} from '@shared/business/entities/externalDocument/ExternalDocumentStandard';

export type ExternalDocumentFactoryMetadata =
  | RawExternalDocumentStandard
  | RawExternalDocumentNonStandardA
  | RawExternalDocumentNonStandardB
  | RawExternalDocumentNonStandardC
  | RawExternalDocumentNonStandardD
  | RawExternalDocumentNonStandardE
  | RawExternalDocumentNonStandardF
  | RawExternalDocumentNonStandardG
  | RawExternalDocumentNonStandardH
  | RawExternalDocumentNonStandardI;

export function ExternalDocumentFactory(
  documentMetadata: ExternalDocumentFactoryMetadata,
): ExternalDocumentBase {
  if (
    documentMetadata &&
    'scenario' in documentMetadata &&
    typeof documentMetadata.scenario === 'string'
  ) {
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
