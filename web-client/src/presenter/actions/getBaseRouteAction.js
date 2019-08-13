export const getBaseRouteAction = ({ path, props }) => {
  return path[props.baseRoute || 'dashboard']();
};
