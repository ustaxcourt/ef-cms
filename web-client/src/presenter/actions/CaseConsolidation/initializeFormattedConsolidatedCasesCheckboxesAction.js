import { state } from 'cerebral';
//TODO: fix jsdocs
/**
 * call to consolidate cases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const initializeFormattedConsolidatedCasesCheckboxesAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  let formattedCaseDetail = get(state.formattedCaseDetail);

  console.log('formattedCaseDetail: ', formattedCaseDetail);

  const consolidatedCases = formattedCaseDetail.consolidatedCases.map(
    consolidateCase => {
      return {
        ...consolidateCase,
        checked: true,
      };
    },
  );
  console.log('consolidatedCases', consolidatedCases);
  store.set(state.formattedCaseDetail.consolidatedCases, consolidatedCases);
  formattedCaseDetail = get(state.formattedCaseDetail);
};
