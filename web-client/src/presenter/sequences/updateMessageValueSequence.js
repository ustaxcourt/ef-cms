/* eslint-disable sort-keys-fix/sort-keys-fix */
import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { props, state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { set } from 'cerebral/factories';
import { updateFormValueWithoutEmptyStringAction } from '../actions/updateFormValueWithoutEmptyStringAction';

export const updateMessageValueSequence = [
  runKeyPathAction,
  {
    section: [
      isChambersPathAction,
      {
        yes: [
          set(state.modal.showChambersSelect, true),
          set(state.form.section, ''),
          set(state[props.form].assigneeId, ''),
          clearUsersAction,
        ],
        no: [
          set(state.modal.showChambersSelect, false),
          updateFormValueWithoutEmptyStringAction,
          ...getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [
      set(state.form.section, props.value),
      ...getUsersInSectionSequence,
    ],
    default: [updateFormValueWithoutEmptyStringAction],
  },
];
