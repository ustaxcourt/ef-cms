import { Insertable, Selectable, Updateable } from 'kysely';

const DEFAULT = {};

export const practitionerDocumentTableDefinition = {
  practitionerDocumentFileId: DEFAULT as string,
  barNumber: DEFAULT as string,
  categoryName: DEFAULT as string,
  categoryType: DEFAULT as string,
  description: DEFAULT as string,
  fileName: DEFAULT as string,
  location: DEFAULT as string,
  uploadDate: DEFAULT as string,
};

export type PractitionerDocumentTable =
  typeof practitionerDocumentTableDefinition;

export const DW_PRACTITIONER_DOCUMENT_COLUMNS = Object.keys(
  practitionerDocumentTableDefinition,
) as Array<keyof PractitionerDocumentTable>;

export type PractitionerDocumentKysely = Selectable<PractitionerDocumentTable>;
export type NewPractitionerDocumentKysely =
  Insertable<PractitionerDocumentTable>;
export type UpdatePractitionerDocumentKysely =
  Updateable<PractitionerDocumentTable>;
