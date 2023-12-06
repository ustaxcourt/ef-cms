/**
 * get the role associated with the user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the section value
 * @param {object} providers.props the cerebral store used for getting the props.value
 * @returns {object} the path to call based on the section value
 */
export const isChambersPathAction = ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { CHAMBERS_SECTION } = applicationContext.getConstants();

  if (props.value === CHAMBERS_SECTION) {
    return path.yes();
  }

  return path.no();
};
