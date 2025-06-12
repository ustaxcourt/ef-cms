import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets contactSecondary with contact prop
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setFormContactSecondaryAddressAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { contact } = props;

  store.set(state.form.contactSecondary, {
    ...get(state.form.contactSecondary),
    address1: contact.address1,
    address2: contact.address2,
    address3: contact.address3,
    city: contact.city,
    countryType: contact.countryType,
    phone: contact.phone,
    postalCode: contact.postalCode,
    state: contact.state,
  });
};
