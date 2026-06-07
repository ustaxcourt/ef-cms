import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDocumentTitleWithAdditionalInfo } from '@shared/business/utilities/getDocumentTitleWithAdditionalInfo';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';

export const buildUpdatedDocketEntry = ({
  authorizedUser,
  docketEntry,
  editableFields,
  petitioners,
}: {
  authorizedUser: AuthUser;
  docketEntry: RawDocketEntry;
  editableFields: Record<string, unknown>;
  petitioners: RawPetitioner[];
}): DocketEntry =>
  new DocketEntry(
    {
      ...docketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { authorizedUser, petitioners },
  ).validate();

export const needsNewCoversheet = ({
  currentDocketEntry,
  updatedDocketEntry,
}: {
  currentDocketEntry: RawDocketEntry;
  updatedDocketEntry: RawDocketEntry;
}): boolean => {
  const receivedAtUpdated =
    dateStringsCompared(
      currentDocketEntry.receivedAt,
      updatedDocketEntry.receivedAt,
    ) !== 0;
  const certificateOfServiceUpdated =
    currentDocketEntry.certificateOfService !==
    updatedDocketEntry.certificateOfService;
  const documentTitleUpdated =
    getDocumentTitleWithAdditionalInfo({
      docketEntry: currentDocketEntry,
    }) !==
    getDocumentTitleWithAdditionalInfo({
      docketEntry: updatedDocketEntry,
    });

  return (
    receivedAtUpdated || certificateOfServiceUpdated || documentTitleUpdated
  );
};
