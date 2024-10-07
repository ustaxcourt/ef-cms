import { Logger } from 'winston';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createLogger } from '@web-api/createLogger';

let loggerCache: LoggerType;

export const getLogger = (): LoggerType => {
  if (!loggerCache) {
    const logger = createLogger();
    loggerCache = {
      addContext: (newMeta: Record<string, any>) => {
        logger.defaultMeta = {
          ...logger.defaultMeta,
          ...newMeta,
        };
      },
      addUser: ({ user }: { user: UnknownAuthUser }) => {
        logger.defaultMeta = {
          ...logger.defaultMeta,
          user,
        };
      },
      clearContext: () => {
        logger.defaultMeta = undefined;
      },
      debug: (message, context?) => logger.debug(message, { context }),
      error: (message, context?) => logger.error(message, { context }),
      getContext: () => logger.defaultMeta,
      info: (message, context?) => logger.info(message, { context }),
      warn: (message, context?) => logger.warn(message, { context }),
    };
  }

  return loggerCache;
};

type LoggerType = {
  addUser: (user: { user: UnknownAuthUser }) => void;
  debug: (message: any, context?: any) => Logger;
  error: (message: any, context?: any) => Logger;
  info: (message: any, context?: any) => Logger;
  warn: (message: any, context?: any) => Logger;
  clearContext: () => void;
  addContext: (newMeta: Record<string, any>) => void;
  getContext: () => Record<string, any>;
};
