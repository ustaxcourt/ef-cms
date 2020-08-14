import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { setCreateMessageModalForChambersSelectAction } from '../actions/setCreateMessageModalForChambersSelectAction';
import { setModalFormValueAction } from '../actions/setModalFormValueAction';
import { setPropsForUpdateSectionInCreateCaseModalAction } from '../actions/setPropsForUpdateSectionInCreateCaseModalAction';
import { unsetCreateMessageModalForChambersSelectAction } from '../actions/unsetCreateMessageModalForChambersSelectAction';

export const updateSectionInCreateMessageModalSequence = [
  setModalFormValueAction,
  setPropsForUpdateSectionInCreateCaseModalAction,
  isChambersPathAction,
  {
    no: [
      unsetCreateMessageModalForChambersSelectAction,
      getUsersInSectionSequence,
    ],
    yes: [setCreateMessageModalForChambersSelectAction, clearUsersAction],
  },
];
