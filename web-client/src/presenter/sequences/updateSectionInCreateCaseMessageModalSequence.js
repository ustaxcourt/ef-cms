import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { setCreateCaseMessageModalForChambersSelectAction } from '../actions/setCreateCaseMessageModalForChambersSelectAction';
import { setModalFormValueAction } from '../actions/setModalFormValueAction';
import { setPropsForUpdateSectionInCreateCaseModalAction } from '../actions/setPropsForUpdateSectionInCreateCaseModalAction';
import { unsetCreateCaseMessageModalForChambersSelectAction } from '../actions/unsetCreateCaseMessageModalForChambersSelectAction';

export const updateSectionInCreateCaseMessageModalSequence = [
  setModalFormValueAction,
  setPropsForUpdateSectionInCreateCaseModalAction,
  isChambersPathAction,
  {
    no: [
      unsetCreateCaseMessageModalForChambersSelectAction,
      getUsersInSectionSequence,
    ],
    yes: [setCreateCaseMessageModalForChambersSelectAction, clearUsersAction],
  },
];
