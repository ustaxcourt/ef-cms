import { setIrsNoticeFalseAction } from '../actions/setIrsNoticeFalseAction';

/**
 * clear IRS notice date and set hasIrsNotice to false
 * notice date values are not required if hasIrsNotice is false
 */
export const setIrsNoticeFalseSequence = [setIrsNoticeFalseAction];
