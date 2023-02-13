import { state } from 'cerebral';

/**
 * takes the yes path if form field passed into the factory function is set;
 * takes the no path otherwise
 *
 * @param {string } formField the value to set the modal to
 * @returns {Function} the primed action
 */
export const hasUpdatedEmailFactoryAction = formField => {
  /**
   * takes the yes path if form.updatedEmail is set; takes the no path otherwise
   *
   * @param {object} providers the providers object
   * @param {object} providers.get the cerebral get function
   * @param {object} providers.path the cerebral path function
   * @returns {object} continue path for the sequence
   */
  const hasUpdatedEmailAction = ({ get, path }) => {
    const updatedEmail = get(state.form[formField]);

    return updatedEmail ? path.yes() : path.no();
  };

  return hasUpdatedEmailAction;
};
