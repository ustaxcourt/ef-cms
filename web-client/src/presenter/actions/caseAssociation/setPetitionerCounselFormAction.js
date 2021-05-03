import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * sets petitioner counsel information
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {object} props object
 */

export const setPetitionerCounselFormAction = ({ get, props, store }) => {
  const caseDetail = get(state.caseDetail);
  const { barNumber } = props;

  const privatePractitioners = cloneDeep(caseDetail.privatePractitioners);
  const privatePractitioner = privatePractitioners.find(
    practitioner => practitioner.barNumber === barNumber,
  );

  store.set(state.form, privatePractitioner);
};
