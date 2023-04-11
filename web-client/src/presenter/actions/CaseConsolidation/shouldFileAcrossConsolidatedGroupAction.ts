import { state } from 'cerebral';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Determines if the docket entry event code is one that can be multi-docketed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if docket entry is multi-docketable
 */
export const shouldFileAcrossConsolidatedGroupAction = ({ get, path }) => {
  const { fileAcrossConsolidatedGroup } = get(state.form);

  if (fileAcrossConsolidatedGroup) {
    console.log('fileAcrossConsolidatedGroup YES');

    return path.yes();
  }
  console.log('fileAcrossConsolidatedGroup NO!');

  return path.no();
};
