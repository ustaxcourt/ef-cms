import { TrialSessionFactory } from '../../../../../../shared/src/business/entities/trialSessions/TrialSessionFactory';
import { createApplicationContext } from '../../../../../src/applicationContext';

const applicationContext = createApplicationContext({});

const isTrialSession = item => {
  return (
    item.pk.startsWith('trial-session|') && item.sk.startsWith('trial-session|')
  );
};

export const migrateItems = items => {
  const itemsAfter: any[] = [];

  for (const item of items) {
    if (isTrialSession(item)) {
      const trialSessionEntity = TrialSessionFactory(item, applicationContext);

      trialSessionEntity.validateWithLogging(applicationContext);

      itemsAfter.push({
        ...trialSessionEntity.toRawObject(),
        pk: item.pk,
        sk: item.sk,
      });
    } else {
      itemsAfter.push(item);
    }
  }

  return itemsAfter;
};
