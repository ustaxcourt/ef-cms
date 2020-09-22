const AWS = require('aws-sdk');

const check = (value, message) => {
  if (!value) {
    console.log(message);
    process.exit(1);
  }
};

const { CURRENT_COLOR, DEPLOYING_COLOR, ENV } = process.env;

check(CURRENT_COLOR, 'You must have CURRENT_COLOR set in your environment');
check(DEPLOYING_COLOR, 'You must have DEPLOYING_COLOR set in your environment');
check(ENV, 'You must have ENV set in your environment');

const cloudfront = new AWS.CloudFront();
const route53 = new AWS.Route53();

const run = async () => {
  const { Items: distributions } = await cloudfront
    .listDistributions({})
    .promise();

  console.log('Got here, 1');

  const currentColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias =>
        alias === `app-${CURRENT_COLOR}-${ENV}.ustc-case-mgmt.flexion.us`,
    ),
  );
  console.log('Got here, 2');

  const deployingColorDistribution = distributions.find(distribution =>
    distribution.Aliases.Items.find(
      alias =>
        alias === `app-${DEPLOYING_COLOR}-${ENV}.ustc-case-mgmt.flexion.us`,
    ),
  );
  console.log('Got here, 3');

  const currentColorConfig = await cloudfront
    .getDistributionConfig({
      Id: currentColorDistribution.Id,
    })
    .promise();
  console.log('Got here, 4');

  const deployingColorConfig = await cloudfront
    .getDistributionConfig({
      Id: deployingColorDistribution.Id,
    })
    .promise();
  console.log('Got here, 5');

  currentColorConfig.DistributionConfig.Aliases.Items = [
    `app-${CURRENT_COLOR}-${ENV}.ustc-case-mgmt.flexion.us`,
  ];
  currentColorConfig.DistributionConfig.Aliases.Quantity = 1;

  deployingColorConfig.DistributionConfig.Aliases.Quantity = 2;
  deployingColorConfig.DistributionConfig.Aliases.Items = [
    `app-${DEPLOYING_COLOR}-${ENV}.ustc-case-mgmt.flexion.us`,
    `app-${ENV}.ustc-case-mgmt.flexion.us`,
  ];

  await cloudfront
    .updateDistribution({
      DistributionConfig: currentColorConfig.DistributionConfig,
      Id: currentColorDistribution.Id,
      IfMatch: currentColorConfig.ETag,
    })
    .promise();
  console.log('Got here, 6');
  try {
    await cloudfront
      .updateDistribution({
        DistributionConfig: deployingColorConfig.DistributionConfig,
        Id: deployingColorDistribution.Id,
        IfMatch: deployingColorConfig.ETag,
      })
      .promise();
  } catch (e) {
    console.log('error: ', e);
    setTimeout(async () => {
      await cloudfront
        .updateDistribution({
          DistributionConfig: deployingColorConfig.DistributionConfig,
          Id: deployingColorDistribution.Id,
          IfMatch: deployingColorConfig.ETag,
        })
        .promise();
    }, 60000);
  }
  console.log('Got here, 7');

  const zone = await route53
    .listHostedZonesByName({ DNSName: 'ustc-case-mgmt.flexion.us.' })
    .promise();
  console.log('Got here, 8');

  const zoneId = zone.HostedZones[0].Id;

  await route53
    .changeResourceRecordSets({
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              AliasTarget: {
                DNSName: deployingColorDistribution.DomainName,
                EvaluateTargetHealth: false,
                HostedZoneId: 'Z2FDTNDATAQYW2', // this magic number is the zone for all cloud front distributions on AWS
              },
              Name: `app-${ENV}.ustc-case-mgmt.flexion.us`,
              Type: 'A',
            },
          },
        ],
        Comment: `The UI for app-${ENV}.ustc-case-mgmt.flexion.us`,
      },
      HostedZoneId: zoneId,
    })
    .promise();
  console.log('Got here, 9');
};

run();
