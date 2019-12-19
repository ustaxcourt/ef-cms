import { state } from 'cerebral';

export const orderTypesHelper = (get, applicationContext) => {
  const { ORDER_TYPES_MAP, USER_ROLES } = get(state.constants);
  const user = applicationContext.getCurrentUser();

  let orderTypes = ORDER_TYPES_MAP;

  if (user.role === USER_ROLES.petitionsClerk) {
    orderTypes = orderTypes.filter(order => order.eventCode === 'O');
  }

  return {
    orderTypes,
  };
};
