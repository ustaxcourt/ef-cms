import { defaultUpdateCaseModalValuesAction } from '../actions/defaultUpdateCaseModalValuesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';

export const openUpdateCaseModalSequence = [
  defaultUpdateCaseModalValuesAction,
  getUsersInSectionAction({ section: 'judge' }),
  setUsersByKeyAction('modal.judgeUsers'),
  setShowModalFactoryAction('UpdateCaseModalDialog'),
];
