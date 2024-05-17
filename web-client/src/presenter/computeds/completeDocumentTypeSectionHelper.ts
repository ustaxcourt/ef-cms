import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { getOptionsForCategory } from './selectDocumentTypeHelper';
import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';

export const isFirstIrsFiling = (
  applicationContext: ClientApplicationContext,
  caseDetail: RawCase,
): boolean => {
  const isCaseSealed = applicationContext
    .getUtilities()
    .isSealedCase(caseDetail);

  const caseHasRespondent = !!(
    !!(caseDetail as unknown as PublicCase).hasIrsPractitioner ||
    caseDetail.irsPractitioners?.length
  );

  return !caseHasRespondent && !isCaseSealed;
};

export const completeDocumentTypeSectionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  let returnData = {};

  if (isEmpty(caseDetail)) {
    return {};
  }
  const {
    CATEGORY_MAP,
    LEGACY_DOCUMENT_TYPES,
    NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const searchText = get(state.screenMetadata.searchText) || '';
  const documentTypesForSelect = getDocumentTypesForSelect(CATEGORY_MAP);

  const documentTypesForSelectFilterFunction = (documentType): boolean => {
    const legacyDocumentCodes = LEGACY_DOCUMENT_TYPES.map(
      value => value.eventCode,
    );

    const currentUser = applicationContext.getCurrentUser();
    if (
      currentUser.role === USER_ROLES.irsPractitioner &&
      documentType.eventCode === 'EA'
    ) {
      if (!isFirstIrsFiling(applicationContext, caseDetail)) return false;
      documentType.documentTitle += ' for Respondent';
    } else if (documentType.eventCode === 'EA') return false;

    return (
      !NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES.includes(
        documentType.eventCode,
      ) && legacyDocumentCodes.indexOf(documentType.eventCode) === -1
    );
  };

  returnData.documentTypesForSelectSorted = documentTypesForSelect
    .sort(getSortFunction(searchText))
    .filter(documentType => documentTypesForSelectFilterFunction(documentType));
  returnData.documentTypesForSecondarySelectSorted =
    returnData.documentTypesForSelectSorted.filter(
      entry => entry.scenario !== 'Nonstandard H',
    );

  const selectedDocumentCategory = form.category;
  const selectedDocumentType = form.documentType;
  const categoryInformation = (
    CATEGORY_MAP[selectedDocumentCategory] || []
  ).find(entry => entry.documentType === selectedDocumentType);

  const selectedDocketEntryId = get(state.docketEntryId);

  returnData.primary = getOptionsForCategory({
    applicationContext,
    caseDetail,
    categoryInformation,
    selectedDocketEntryId,
  });
  if (returnData.primary.showSecondaryDocumentSelect) {
    returnData.secondary = {};
    returnData.primary.showSecondaryDocumentSelect = false;
  }

  if (form.secondaryDocument) {
    const selectedSecondaryDocumentCategory = form.secondaryDocument.category;
    const selectedSecondaryDocumentType = form.secondaryDocument.documentType;

    if (selectedSecondaryDocumentCategory && selectedSecondaryDocumentType) {
      const secondaryCategoryInformation = CATEGORY_MAP[
        selectedSecondaryDocumentCategory
      ].find(entry => entry.documentType === selectedSecondaryDocumentType);

      returnData.secondary = getOptionsForCategory({
        applicationContext,
        caseDetail,
        categoryInformation: secondaryCategoryInformation,
        selectedDocketEntryId,
      });
    }
  }

  return returnData;
};
