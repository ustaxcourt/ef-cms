import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { NewPractitionerDocumentKysely } from '@web-api/persistence/postgres/practitionerDocuments/schema';
import { isArray } from 'lodash';

function pickFields(
  practitionerDocument,
  barNumber: string,
): NewPractitionerDocumentKysely {
  return {
    barNumber,
    categoryName: practitionerDocument.categoryName,
    categoryType: practitionerDocument.categoryType,
    description: practitionerDocument.description,
    fileName: practitionerDocument.fileName,
    location: practitionerDocument.location,
    practitionerDocumentFileId: practitionerDocument.practitionerDocumentFileId,
    uploadDate: practitionerDocument.uploadDate,
  };
}

export function toKyselyNewPractitionerDocument(
  practitionerDocument: RawPractitionerDocument,
  barNumber: string,
): NewPractitionerDocumentKysely {
  return pickFields(practitionerDocument, barNumber);
}

export function practitionerDocumentEntity(practitionerDocument) {
  if (isArray(practitionerDocument)) {
    const practitionerDocuments = practitionerDocument.map(doc => {
      return {
        ...doc,
        uploadDate: doc.uploadDate?.toISOString(),
      };
    });
    return practitionerDocuments;
  } else {
    return {
      ...practitionerDocument,
      uploadDate: practitionerDocument.uploadDate?.toISOString(),
    };
  }
}
