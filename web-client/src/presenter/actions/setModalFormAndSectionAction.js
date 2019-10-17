/**
 * composes new values into the props stream for use in updateMessageValueInModalSequence
 *
 * @returns {object} new props values
 */
export const setModalFormAndSectionAction = ({ props }) => ({
  form: 'modal.form',
  section: props.value,
});
