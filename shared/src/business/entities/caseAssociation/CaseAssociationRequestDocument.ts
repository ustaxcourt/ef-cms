import { JoiValidationEntity_New } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity_New';

export abstract class CaseAssociationRequestDocument extends JoiValidationEntity_New {
  abstract getDocumentTitle(
    petitioners?: { contactId: string; name: string }[],
  ): string;
}
