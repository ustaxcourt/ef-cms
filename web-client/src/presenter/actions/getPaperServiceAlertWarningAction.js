/**
 * sets the alertError on props for paper service warning
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alertWarning
 */
export const getPaperServiceAlertWarningAction = ({
  applicationContext,
  props,
}) => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const hasPartyWithElectronicService = applicationContext
    .getUtilities()
    .hasPartyWithServiceType(
      props.caseDetail,
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

  const documentNotElectronicallyServedMessage = hasPartyWithElectronicService
    ? ''
    : 'This document has not been electronically served. ';

  return {
    alertWarning: {
      message: `${documentNotElectronicallyServedMessage}Print and mail to complete paper service.`,
    },
  };
};
