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
    ...contact,
    contactId: get(state.form.contactSecondary.contactId),
    hasConsentedToElectronicService: get(
      state.form.contactSecondary.hasConsentedToElectronicService,
    ),
    inCareOf: get(state.form.contactSecondary.inCareOf),
    name: get(state.form.contactSecondary.name),
    paperPetitionEmail: get(state.form.contactSecondary.paperPetitionEmail),
  });
};
