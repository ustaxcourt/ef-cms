import { isNumber } from 'lodash';

/**
 * used to determine if the trial session is calendared and has more cases.
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path and set the info for next item.
 */
export const hasAnotherCalendaredCaseAction = ({ path, props }) => {
  let { calendaredCaseIndex, calendaredCases } = props;

  calendaredCaseIndex = isNumber(calendaredCaseIndex)
    ? calendaredCaseIndex + 1
    : 0;

  if (
    !calendaredCases ||
    !calendaredCases.length ||
    calendaredCaseIndex >= calendaredCases.length
  ) {
    return path.no();
  }

  return path.yes({
    calendaredCaseIndex,
    docketNumber: calendaredCases[calendaredCaseIndex].docketNumber,
  });
};
