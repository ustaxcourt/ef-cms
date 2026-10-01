export const parseEventBody = (
  body: Record<string, any>,
): Record<string, any> => {
  const parsedBody = Object.create(null);
  Object.assign(parsedBody, body);
  return parsedBody;
};
