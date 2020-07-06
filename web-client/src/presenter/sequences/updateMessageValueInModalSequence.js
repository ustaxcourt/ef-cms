/* eslint-disable sort-keys-fix/sort-keys-fix */
import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { props, state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { set } from 'cerebral/factories';

export const updateMessageValueInModalSequence = [
  ({ props: sequenceProps }) => ({
    form: 'modal.form',
    section: sequenceProps.value,
  }),
  runKeyPathAction,
  {
    section: [
      isChambersPathAction,
      {
        yes: [
          set(state.modal.showChambersSelect, true),
          set(state.modal.form.section, ''),
          set(state.modal.form.assigneeId, ''),
          clearUsersAction,
        ],
        no: [
          set(state.modal.showChambersSelect, false),
          set(state.modal.form.section, props.value),
          getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [
      set(state.modal.form.section, props.value),
      getUsersInSectionSequence,
    ],
    default: [set(state.modal.form[props.key], props.value)],
  },
];
