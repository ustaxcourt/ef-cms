import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * takes the petitioner counsel using the barNumber in props and puts onto the form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props
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
  const representingMap = {};
  privatePractitioner.representing.forEach(contactId => {
    representingMap[contactId] = true;
  });
  store.set(state.form.representingMap, representingMap);
};
