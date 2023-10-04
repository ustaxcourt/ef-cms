import { genericHandler } from '../../genericHandler';

export const logWarningLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    const { context, key } = JSON.parse(event.body);
    applicationContext.logger.warn(key, context);
  });
