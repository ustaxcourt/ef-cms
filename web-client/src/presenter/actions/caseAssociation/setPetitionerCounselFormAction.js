import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * takes the petitioner counsel using the barNumber in props and puts onto the form
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.applicationContext the applicationContext
 * @returns {object} props object
 */

export const setPetitionerCounselFormAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const { barNumber } = props;

  const privatePractitioners = cloneDeep(caseDetail.privatePractitioners);
  const privatePractitioner = privatePractitioners.find(
    practitioner => practitioner.barNumber === barNumber,
  );

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail);

  privatePractitioner.representingPrimary = !!privatePractitioner.representing.find(
    r => r === contactPrimary.contactId,
  );

  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail);

  privatePractitioner.representingSecondary =
    !!contactSecondary &&
    !!privatePractitioner.representing.find(
      r => r === contactSecondary.contactId,
    );

  store.set(state.form, privatePractitioner);
};
