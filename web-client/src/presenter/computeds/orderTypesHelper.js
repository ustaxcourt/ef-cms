import { state } from 'cerebral';

export const orderTypesHelper = (get, applicationContext) => {
  const { ORDER_TYPES_MAP, USER_ROLES } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const eventCode = get(state.form.eventCode);

  let orderTypes = ORDER_TYPES_MAP;

  if (user.role === USER_ROLES.petitionsClerk) {
    orderTypes = orderTypes.filter(order => order.eventCode === 'O');
  }

  const showDocumentTitleInput = ['O', 'NOT'].includes(eventCode);
  let documentTitleInputLabel;
  if (showDocumentTitleInput && eventCode === 'O') {
    documentTitleInputLabel = 'Order title';
  } else if (showDocumentTitleInput && eventCode === 'NOT') {
    documentTitleInputLabel = 'Notice title';
  }

  return {
    documentTitleInputLabel,
    orderTypes,
    showDocumentTitleInput,
  };
};
