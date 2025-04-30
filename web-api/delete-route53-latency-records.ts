import {
  Route53Client,
  ListResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommand,
  ResourceRecordSet,
  ChangeAction,
  ListHostedZonesByNameCommand,
} from '@aws-sdk/client-route-53';

const route53Client = new Route53Client({
  defaultsMode: 'cross-region',
  region: 'us-east-1',
});

const { ZONE_NAME } = process.env;
const RECORD_NAMES = []; // TODO: Fully qualified domain name(s) with trailing dot

const deleteLatencyRecords = async (): Promise<void> => {
  try {
    const zone = await route53Client.send(
      new ListHostedZonesByNameCommand({ DNSName: `${ZONE_NAME}.` }),
    );

    // double check this, too
    const listCommand = new ListResourceRecordSetsCommand({
      HostedZoneId: zone.HostedZones[0].Id,
    });
    const data = await route53Client.send(listCommand);

    if (!data.ResourceRecordSets) {
      console.log('No records found.');
      return;
    }

    const latencyRecords = data.ResourceRecordSets.filter(
      (record: ResourceRecordSet) =>
        RECORD_NAMES.includes(record.Name) &&
        record.Type === 'A' &&
        record.SetIdentifier,
    );

    if (latencyRecords.length === 0) {
      console.log('No latency-based records found.');
      return;
    }

    console.log(`Found ${latencyRecords.length} latency record(s) to delete.`);

    const changes = latencyRecords.map(record => ({
      Action: 'DELETE' as ChangeAction,
      ResourceRecordSet: record,
    }));

    const changeCommand = new ChangeResourceRecordSetsCommand({
      HostedZoneId: zone.HostedZones[0].Id,
      ChangeBatch: {
        Changes: changes,
        Comment: 'Deleting latency-based Route53 records',
      },
    });

    const result = await route53Client.send(changeCommand);
    console.log('Change submitted:', result.ChangeInfo?.Id);
  } catch (error) {
    console.error('Failed to delete latency records:', error);
  }
};

void deleteLatencyRecords();
