import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getDocumentTitleForNoticeOfChange } from '@shared/business/utilities/getDocumentTitleForNoticeOfChange';
import { getDocumentTitleWithAdditionalInfo } from '@shared/business/utilities/getDocumentTitleWithAdditionalInfo';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { applicationContext } from '@web-api/applicationContext';

export const getOriginalNoticeValues = ({
  docketEntry,
}: {
  docketEntry: RawDocketEntry;
}): {
  documentTitleForNotice: string;
  filedBy?: string;
} => {
  let { filedBy } = docketEntry;
  let documentTitleForNotice = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry,
  });

  if (
    docketEntry.editState &&
    typeof docketEntry.editState === 'string' &&
    docketEntry.editState !== '{}'
  ) {
    try {
      const parsedEditState = JSON.parse(docketEntry.editState);

      const parsedTitle = getDocumentTitleForNoticeOfChange({
        applicationContext,
        docketEntry: parsedEditState,
      });

      if (parsedTitle) {
        documentTitleForNotice = parsedTitle;
      }

      filedBy = parsedEditState.filedBy ?? filedBy;
    } catch (err) {
      getDawsonLogger().error(
        'Failed to parse docketEntry.editState for notice of docket change',
      );
    }
  }

  return { documentTitleForNotice, filedBy };
};

export const buildUpdatedDocketEntry = ({
  authorizedUser,
  docketEntry,
  editableFields,
  petitioners,
}: {
  authorizedUser: any;
  docketEntry: any;
  editableFields: Record<string, unknown>;
  petitioners: any[];
}) =>
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
}) => {
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
