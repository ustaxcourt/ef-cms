import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { setModalFormValueAction } from '../actions/setModalFormValueAction';
import { setPropsForUpdateSectionInCreateCaseModalAction } from '../actions/setPropsForUpdateSectionInCreateCaseModalAction';

export const updateChambersInCreateMessageModalSequence = [
  setModalFormValueAction,
  setPropsForUpdateSectionInCreateCaseModalAction,
  getUsersInSectionSequence,
];
