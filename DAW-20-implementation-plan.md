# DAW-20 implementation plan

Give GitHub Actions read-only access to the production images in ECR, using GitHub's OIDC login instead of stored keys. DAW-20 is a subtask of DAW-21 (the production scan job) and covers production only; `stg` and `dev` get the same setup in their own tickets. `dev` is used to test this ticket's Terraform before it is applied to prod.

## 0. What exists today

| Area | What exists | What it means for DAW-20 |
| --- | --- | --- |
| CI identities | [modules/ci-cd](web-api/terraform/modules/ci-cd/) holds the `CircleCI` IAM user (static keys, broad policy including `ecr:*` on `*`) and the `ef-cms-us-east-1` ECR repo. | The new role goes here, separate from the CircleCI user. |
| How it's applied | [account-specific.tf](web-api/terraform/applyables/account-specific/account-specific.tf) is applied by a person, once per account, with `npm run deploy:account-specific`. CircleCI never applies it. The apply covers everything in the file (Kibana, Route53, VPCs and more). | Every rollout is a manual apply, and its plan must be checked for unrelated changes. |
| Per-account settings | [deploy-account-specific.sh](web-api/terraform/bin/deploy-account-specific.sh) sets `ENV="account"`, loads the `account_deploy` secret, and exports `TF_VAR_*`. Optional values use `[[ -n … ]] && export …`. | A per-account switch fits the existing pattern. |
| Accounts | One environment per account (`dawson-workloads-[env]`). | Each account's role can only read that account's images. |
| Existing OIDC | No `aws_iam_openid_connect_provider` in the repo, and no GitHub workflow uses AWS. | Starting from nothing, but one may have been created by hand (step 1). |
| Images | `ef-cms-us-east-1` ([ci-cd/ecr.tf](web-api/terraform/modules/ci-cd/ecr.tf)). `docket-entry-zipper-<env>-<color>-us-east-1` (`blue` and `green` applyables, us-east-1 only). | Two repo name patterns, one region. |
| Live color | `/DAWSON/<env>/current-color`, an SSM `String` parameter written by [switch-colors.sh](web-client/switch-colors.sh). | Reading it needs no KMS permission. |
| Checkov | Runs per applyable folder with a `.checkov.baseline`. It fails the build only for `CKV_AWS_57,20,23,7`. | New findings won't block but show in the Security tab. Goal: none. |
| GitHub | The repo is public. Default branch `staging`. Existing environments: `copilot`, `github-pages`. | Who can use the role must be limited tightly. |

A Checkov skip comment in `ci-cd-permissions.tf` mentions moving CircleCI to OIDC. That uses CircleCI's own login provider, so there's no conflict. Don't reuse this role for it.

## 1. Pre-checks (per account: `dev`, then `prod`)

- [ ] Run `aws iam list-open-id-connect-providers`. If a provider for `token.actions.githubusercontent.com` exists, bring it into Terraform with `terraform import` instead of creating it. AWS allows only one provider per URL per account.
- [ ] Confirm no role named `github_actions_image_scan` exists.

## 2. Terraform (PR: new file `modules/ci-cd/github-actions-image-scan.tf`)

Every resource uses `count = var.github_image_scan_environment == null ? 0 : 1`, so accounts that don't opt in get no changes.

- [ ] `aws_iam_openid_connect_provider.github_actions`: url `https://token.actions.githubusercontent.com`, `client_id_list = ["sts.amazonaws.com"]`. Leave out `thumbprint_list`: AWS now checks GitHub's certificate itself, and the field is optional in our provider version (6.69.1). Confirm in the plan output.
- [ ] `aws_iam_role.github_actions_image_scan`, default 1-hour session. Trust policy through `aws_iam_policy_document`, as in `dawson-developer-permissions`:
  ```hcl
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions[0].arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals" # exact match, no wildcards
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:environment:${var.github_image_scan_environment}"]
    }
  }
  ```
- [ ] `aws_iam_policy.github_actions_image_scan` and its attachment, with only these permissions:

  | Action | Resource | Why |
  | --- | --- | --- |
  | `ecr:GetAuthorizationToken` | `*` | Needed to log in to ECR. AWS doesn't allow limiting it to repos; the login only grants what the rows below allow. |
  | `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer` | `arn:aws:ecr:us-east-1:<acct>:repository/ef-cms-us-east-1`, `…:repository/docket-entry-zipper-*-us-east-1` | Pull the image's manifest and layers. |
  | `ecr:DescribeImages` | Same two | Look up the digest behind a tag, so DAW-21 can record exactly which image it scanned. |
  | `ssm:GetParameter` | `arn:aws:ssm:us-east-1:<acct>:parameter/DAWSON/*/current-color` | Find the live batch color. |

  Left out on purpose: AWS's managed `AmazonEC2ContainerRegistryReadOnly` (covers every repo, adds list and describe actions), and `ecr:BatchCheckLayerAvailability` (a push-side check; add only if validation shows Trivy needs it). The `*` in the patterns is the environment name; with one environment per account, it only matches that account's own repos and parameter.
- [ ] Variables in `modules/ci-cd/variables.tf`: `github_image_scan_environment` (string, default `null`) and `github_repository` (default `"ustaxcourt/ef-cms"`). Pass `github_image_scan_environment` through `applyables/account-specific/variables.tf` and `account-specific.tf`.
- [ ] `deploy-account-specific.sh`: `[[ -n "$GITHUB_IMAGE_SCAN_ENVIRONMENT" ]] && export TF_VAR_github_image_scan_environment="$GITHUB_IMAGE_SCAN_ENVIRONMENT"`. The value comes from the account's `account_deploy` secret.
- [ ] Output `github_image_scan_role_arn` from the module and from `applyables/account-specific/outputs.tf`, so the person applying can copy it into GitHub.
- [ ] `terraform fmt` and `terraform validate`.
- [ ] Run Checkov locally with the flags from [security-sast.yml](.github/workflows/security-sast.yml) on `applyables/account-specific`. No new findings, no new skips.
- [ ] `CHANGES.md` entry and PR description listing the manual steps (secret value, `deploy:account-specific`, GitHub settings). AGENTS.md exempts `web-api/terraform/**` from unit tests, which includes the deploy script.

## 3. GitHub settings (repo admin, no code)

- [ ] One environment per account: `image-scan-dev` for testing, `image-scan-prod` for this ticket. Each account's role trusts only its own environment, so a `dev` job can never get prod credentials.
- [ ] Deployment branches: `staging` only. Pull request runs (`refs/pull/N/merge`) are refused. No required reviewers, because a scheduled job would wait forever.
- [ ] Environment variable (scoped to the environment, not the repo): `AWS_IMAGE_SCAN_ROLE_ARN`. No secrets.

## 4. Rollout

- [ ] **`dev`:** add `GITHUB_IMAGE_SCAN_ENVIRONMENT=image-scan-dev` to the `dev` account's `account_deploy` secret and run `npm run deploy:account-specific`. **Stop if the plan shows anything besides the 3–4 new resources**: unrelated changes waiting in that applyable would go out in the same apply.
- [ ] Create `image-scan-dev` in GitHub and run the validation in section 6.
- [ ] Get security sign-off on the trust policy.
- [ ] **`prod`:** repeat with `image-scan-prod`, then validate again.
- [ ] Hand the role ARN and environment name to DAW-21.

## 5. Security considerations

- **No stored keys.** Each run gets credentials that expire within an hour.
- **Who can get credentials.** Only a job that names the matching environment and runs from `staging`. That leaves anyone who can merge a workflow change to `staging` (PR review is the control, as for any workflow today) and repo admins, who can change the environment's branch rule.
- **Fork PRs.** They don't receive `id-token: write`, and the branch rule refuses them anyway.
- **What a leaked credential could do:** read two image repos and one parameter, for one hour, in one account. The batch image holds public-repo code and two non-secret build values (`AWS_REGION`, `WEBSOCKET_API_GATEWAY_ID`); `ef-cms-us-east-1` holds CI tooling. Validation still confirms no secrets are baked in.
- **Public logs.** The role ARN and image addresses contain the account ID. Set `mask-aws-account-id: true` on `aws-actions/configure-aws-credentials`.
- **Optional hardening:** change the repo's OIDC subject format to include the numeric `repository_id`, so a deleted-and-recreated or renamed repo can't match. This changes the token for every workflow in the repo; nothing else uses OIDC today.
- **Audit trail.** Every use appears in CloudTrail as `AssumeRoleWithWebIdentity`, with the subject.
- **One role, one purpose.** Don't widen this role later; create a new one.

## 6. Validation

Use a temporary `workflow_dispatch` workflow on the DAW-20 branch. For the `dev` test only, add that branch to `image-scan-dev`'s branch rule, and remove it afterward.

- [ ] `aws sts get-caller-identity` inside the environment shows the `github_actions_image_scan` role.
- [ ] `aws ecr describe-images` and a manifest pull succeed on both repo patterns.
- [ ] `aws ssm get-parameter --name /DAWSON/<env>/current-color` succeeds.
- [ ] The same job without `environment:`, or from a branch that isn't allowed, can't get credentials.
- [ ] `ecr:PutImage`, `ecr:DescribeRepositories`, another repo and another SSM parameter all return `AccessDenied`.
- [ ] `aws iam simulate-principal-policy` on the role matches the table in section 2.
- [ ] `docker inspect` and `docker history` on both images show no secrets.
- [ ] CloudTrail shows one `AssumeRoleWithWebIdentity` event per run, with the expected `sub`.
- [ ] Delete the temporary workflow. DAW-21 replaces it.

## 7. Out of scope

- The production scan job (DAW-21).
- Staging and dev scanning, including their prod-style rollout (tickets 5 and 6). They reuse this Terraform with their own environment names.
- Moving CircleCI to OIDC, pinning the batch image version, AWS-side scanning (Inspector).

## 8. Open decisions

- [ ] Environment names `image-scan-<env>`: OK?
- [ ] Include `repository_id` in the OIDC subject (optional hardening)?
- [ ] Who applies the prod Terraform, and who gives security sign-off on the trust policy?
- [ ] Wildcard environment in the ARNs (one environment per account), or an exact name through one more variable?
