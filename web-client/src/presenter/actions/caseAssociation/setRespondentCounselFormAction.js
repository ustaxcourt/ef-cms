import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * takes the respondent counsel using the barNumber in props and puts onto the form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */

export const setRespondentCounselFormAction = ({ get, props, store }) => {
  const caseDetail = get(state.caseDetail);
  const { barNumber } = props;

  const irsPractitioners = cloneDeep(caseDetail.irsPractitioners);
  const irsPractitioner = irsPractitioners.find(
    practitioner => practitioner.barNumber === barNumber,
  );

  store.set(state.form, irsPractitioner);
};
