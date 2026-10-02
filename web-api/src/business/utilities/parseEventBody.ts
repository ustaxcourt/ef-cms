export const parseEventBody = (body: string): any => {
  const parsedBody = Object.create(null);
  Object.assign(parsedBody, JSON.parse(body));
  return parsedBody;
};
