import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { put } from '../../dynamodbClientService';

export const updateIrsPractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  leadDocketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  leadDocketNumber?: string;
  practitioner: RawIrsPractitioner;
  userId: string;
}): Promise<void> => {
  const item: any = {
    ...practitioner,
    pk: `case|${docketNumber}`,
    sk: `irsPractitioner|${userId}`,
  };
  if (leadDocketNumber) {
    item.gsi1pk = `leadCase|${leadDocketNumber}`;
  }

  await put({
    Item: item,
    applicationContext,
  });
};

export const updatePrivatePractitionerOnCase = async ({
  applicationContext,
  docketNumber,
  leadDocketNumber,
  practitioner,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  leadDocketNumber?: string;
  practitioner: RawPractitioner;
  userId: string;
}): Promise<void> => {
  const item: any = {
    ...practitioner,
    pk: `case|${docketNumber}`,
    sk: `privatePractitioner|${userId}`,
  };
  if (leadDocketNumber) {
    item.gsi1pk = `leadCase|${leadDocketNumber}`;
  }

  await put({
    Item: item,
    applicationContext,
  });
};
