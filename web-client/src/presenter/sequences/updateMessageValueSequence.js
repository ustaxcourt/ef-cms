/* eslint-disable sort-keys-fix/sort-keys-fix */
import { set } from 'cerebral/factories';
import { props, state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';

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
          set(state.form[props.key], props.value),
          ...getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [
      set(state.form.section, props.value),
      ...getUsersInSectionSequence,
    ],
    default: [set(state.form[props.key], props.value)],
  },
];
