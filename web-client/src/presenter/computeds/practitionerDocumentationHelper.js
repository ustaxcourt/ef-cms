import { getConstants } from '../../getConstants';
import { state } from 'cerebral';

const { DESCENDING } = getConstants();

export const practitionerDocumentationHelper = (get, applicationContext) => {
  const permissions = get(state.permissions);
  const practitionerDocuments = get(state.practitionerDocuments);
  const tableSort = get(state.tableSort);

  let formattedPractitionerDocuments = practitionerDocuments.map(document => {
    return {
      ...document,
      formattedUploadDate: applicationContext
        .getUtilities()
        .formatDateString(document.uploadDate, 'MMDDYY'),
    };
  });

  formattedPractitionerDocuments = sortPractitionerDocuments({
    formattedPractitionerDocuments,
    tableSort,
  });

  const practitionerDocumentsCount = practitionerDocuments.length;

  return {
    formattedPractitionerDocuments,
    practitionerDocumentsCount,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};

const sortPractitionerDocuments = ({
  formattedPractitionerDocuments,
  tableSort,
}) => {
  const sortedPractitionerDocuments = formattedPractitionerDocuments.sort(
    (a, b) => {
      const sortA = a[tableSort.sortField] || '';
      const sortB = b[tableSort.sortField] || '';

      return sortA.localeCompare(sortB);
    },
  );

  if (tableSort.sortOrder === DESCENDING) {
    return sortedPractitionerDocuments.reverse();
  }

  return sortedPractitionerDocuments;
};
