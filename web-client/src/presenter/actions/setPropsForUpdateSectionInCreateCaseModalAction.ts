/**
 * returns props used later in the sequence for updating section in create case modal
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the props used later in the sequence
 */
export const setPropsForUpdateSectionInCreateCaseModalAction = ({
  props,
}: ActionProps) => {
  return { form: 'modal.form', section: props.value };
};
