import {
  WAFV2Client,
  ListResourcesForWebACLCommand,
  DisassociateWebACLCommand,
  ListWebACLsCommand,
} from '@aws-sdk/client-wafv2';
import { sleep } from '@shared/tools/helpers';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

/*
We have resources that are dependent on our WAF ACLs, but we defined these dependencies implicitly.
That means Terraform does not know how to destroy the WAF stuff in the right order.
In order for Terraform to properly delete our WAF stuff in the west, we need to manually disassociate resources first.
*/

const scriptConfig: ScriptConfig = {
  description:
    'disassociateResourcesFromWebAcl - Disassociates resources from WAF ACLs',
  environment: {
    env: 'ENV',
    deployingColor: 'DEPLOYING_COLOR',
  },
  requireActiveAwsSession: false,
};
const { env } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  deployingColor: string;
};

async function getWebAclInfo(
  name: string,
): Promise<{ arn: string; id: string } | null> {
  const waf = new WAFV2Client({ region: 'us-west-1' });
  let nextMarker: string | undefined = undefined;

  console.log(`Getting web acl arn for ${name}`);
  do {
    const resp = await waf.send(
      new ListWebACLsCommand({
        Scope: 'REGIONAL',
        NextMarker: nextMarker,
      }),
    );
    nextMarker = resp.NextMarker;
    for (const w of resp.WebACLs ?? []) {
      if (w.Name === name) {
        console.log(`Got web acl arn for ${name}: ${w.ARN!}`);
        return { arn: w.ARN!, id: w.Id! };
      }
    }
  } while (nextMarker);

  console.warn(`Web ACL named "${name}" not found`);
  return null;
}

const client = new WAFV2Client({ region: 'us-west-1' });

const RESOURCE_TYPES = ['API_GATEWAY'] as const;

export async function disassociateResourcesFromWebAcl() {
  const webAclInfo = await getWebAclInfo(`apis_${env}`);
  if (!webAclInfo) {
    return;
  }
  console.log(`About to disassociate resources from ${webAclInfo.arn}`);
  for (const type of RESOURCE_TYPES) {
    // 1. List all ARNs for this resource type
    const { ResourceArns } = await client.send(
      new ListResourcesForWebACLCommand({
        WebACLArn: webAclInfo.arn,
        ResourceType: type,
      }),
    );
    console.log(`Resources to disassociate: ${ResourceArns?.join(', ')}`);
    // 2. Disassociate each ARN
    for (const arn of ResourceArns ?? []) {
      console.log(`Disassociating ${arn}`);
      await client.send(new DisassociateWebACLCommand({ ResourceArn: arn }));
      await sleep(3000);
      console.log(`Disassociated ${arn} (${type})`);
    }
  }
}
