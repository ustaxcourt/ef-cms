# Container Finding Triage

## Overview

This document defines how DAWSON evaluates container vulnerabilities to distinguish actionable security risks from inherited, build-only, or non-exploitable findings.

Scanner severity alone does not determine priority. Findings must also be evaluated based on where the affected software is used, whether the vulnerable functionality is reachable, and the potential impact of exploitation.

For details on how scans are performed, see [container-scanning.md](container-scanning.md).

## 1. DAWSON Container Image Inventory

Understanding where each image is used is the first step in evaluating its findings.

| Image | Purpose | Deployment / Exposure |
|---|---|---|
| `ef-cms-us-east-1` | CircleCI environment used for builds, tests, Terraform, and deployments | Not a production application container, but has access to AWS deployment credentials |
| `docket-entry-zipper` | AWS Batch job that retrieves and packages court documents | Runs in production on Fargate with access to case documents |
| Puppeteer image | Temporary environment for packaging dependencies into a Lambda layer | The Docker image is not deployed; the generated ZIP is |
| `efcms-local` | Local development and CI testing | Runs on developer machines and in testing workflows |

**Scanning coverage:** Trivy builds each image from its Dockerfile and scans the result, so findings include packages the Dockerfiles add on top of the base image: `awscli` and the global `ts-node`/`typescript` in the batch image, and `zip` in the Puppeteer image. The images are built fresh in CI, so they can differ from what is deployed: CircleCI runs the `ef-cms-us-east-1` tag pinned in `.circleci/config.yml`, and batch runs the image last pushed to ECR.

## 2. Evaluating Container Findings

Each finding should follow five steps:

1. Confirm the vulnerable package is present.
2. Classify the dependency.
3. Evaluate the actual security risk.
4. Determine whether to fix, accept, or escalate.
5. Record the decision as a VEX statement.

### Step 1: Confirm the Vulnerable Package Is Present

Before investigating exploitability, verify that the affected package and vulnerable version exist in the image or artifact being evaluated.

Consider the following:

- **Correct artifact:** Is the scanner examining the actual deployed image, a base image, or a temporary build image?
  - For `ef-cms-us-east-1`, Trivy scans an image built from the current `Dockerfile`, while CircleCI uses the version pinned in `.circleci/config.yml`. These may differ, so verify findings against the image CircleCI actually uses.
- **Package presence:** Is the affected package installed in the relevant image or included in the deployed artifact?
- **Package version:** Is the installed version vulnerable, or has the distribution already applied a security patch?
- **Build output:** Does the vulnerable package remain in the final image, or is it excluded after the build process?

Useful commands include:

```bash
# Check installed Debian packages
docker run --rm <image> dpkg -l

# Check Node.js dependencies, from the npm project directory in the built image
# (Puppeteer layer: /home/build/nodejs; Batch: /usr/src/app)
docker run --rm --workdir <project-directory> <image> npm ls --all

# List detected packages, versions, and locations. Use grep to filter by package.
trivy image --list-all-pkgs --format json --quiet <image> \
  | jq -r '.Results[] | .Target as $t | .Packages[]?
      | "\(.Name)\t\(if .Epoch then "\(.Epoch):" else "" end)\(.Version)\(if .Release then "-\(.Release)" else "" end)\t\($t)"'

# Scan the ECR image used by CircleCI
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"
TAG=$(grep -m1 'docker-image:' .circleci/config.yml | awk -F':' '{print $3}')
trivy image "${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:${TAG}"
```

For Debian packages, consult the [Debian Security Tracker](https://security-tracker.debian.org/tracker/) to verify whether fixes have been backported.

**DAWSON example:** The scans build images fresh in CI, so check presence against the image that actually runs when it may differ (see **Scanning coverage** in [section 1](#1-dawson-container-image-inventory)).

**Outcome:**
- Package absent or vulnerability already patched: document the evidence and classify the finding accordingly.
- Package present and vulnerable: continue to Step 2.
- Unable to confirm: retain the finding for further investigation.

### Step 2: Classify the Dependency

For each finding, identify the dependency's source, origin, and purpose.

**A. Dependency source**

| Type | Description | Examples |
|---|---|---|
| OS dependency | Operating-system package installed through a package manager or inherited from a base image | Java, curl, Ghostscript, OpenSSH |
| Application dependency | Package or library used by application code | npm packages, Python libraries, Java libraries |

**B. Dependency origin**

| Type | Description |
|---|---|
| Inherited | Included in the Docker base image |
| Added | Installed through the project's Dockerfile or build process |

Inherited vulnerabilities are commonly addressed by updating the base image. Added dependencies may require updating or removing the affected packages.

**C. Build-time vs. runtime**

| Type | Description | Examples |
|---|---|---|
| Build-time | Required to compile, package, or test software | `build-essential`, compilers, `node-gyp` |
| Runtime | Required when the application or container executes its workload | Node.js, production npm dependencies, required shared libraries |
| Both | Used during build and runtime | Dependencies used by both build scripts and the running application |

Classification depends on actual usage.

For example, `ts-node` and `typescript` are devDependencies in the root `package.json`, where they are build and test tools. The batch image is different: its Dockerfile installs both globally and starts the job with `CMD ["ts-node", "src/docketEntryBatchDownloader.ts"]`. In that image they are runtime dependencies, because the production job cannot run without them. The same package can be build-time in one place and runtime in another, so classify it by how the image uses it, not by how it is declared elsewhere.

Likewise, a dependency used by CircleCI may be essential while a CI/CD job executes, even if it is not part of the production application.

**Why this matters:** Build-only dependencies may be removable from production images, reducing unnecessary packages and potential vulnerabilities. However, build-environment findings still require evaluation, particularly when CI/CD jobs have access to production credentials.

### Step 3: Evaluate the Security Risk

For findings confirmed to be applicable, evaluate four factors.

| Factor | Questions to ask |
|---|---|
| **Reachability** | Does the application, dependency, or process execute the vulnerable functionality? |
| **Exploitability** | What conditions are required to exploit the vulnerability? Is there a known exploit or evidence of active exploitation? |
| **Exposure** | Can an attacker access the affected functionality or influence its inputs? What systems, credentials, or data could be affected? |
| **Patch availability** | Is a patched version available? If not, are other mitigations possible? |

Useful references include:

- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) — identifies vulnerabilities with known exploitation in the wild.
- [FIRST EPSS](https://www.first.org/epss/) — estimates the probability of exploitation in the next 30 days.
- [Debian Security Tracker](https://security-tracker.debian.org/tracker/) — provides distribution-specific vulnerability and patch information.
- CVE advisories — identify affected functionality, required exploit conditions, and available fixes.

**Factors that increase priority:**
- The vulnerable functionality is reachable.
- The affected component processes untrusted input.
- The vulnerability has known exploitation activity or a public exploit.
- The environment handles sensitive data or has privileged access.
- Exploitation could affect application availability, integrity, or confidentiality.

**Factors that may reduce priority:**
- The vulnerable functionality is demonstrably unused or unreachable.
- The package is absent from the relevant deployed artifact.
- The vulnerability requires conditions that cannot occur in the environment.
- Verified security controls prevent the identified exploitation path.

Lower exposure does not automatically mean a finding is non-exploitable. Conclusions should be supported by evidence rather than assumptions.

### Step 4: Determine the Appropriate Action

After evaluating the risk, classify the finding into one of four outcomes.

| Decision | Criteria | Action |
|---|---|---|
| **Fix** | A vulnerability presents a credible risk and an appropriate remediation is available | Create a remediation ticket, apply the fix, and rescan |
| **Accept** | Evidence supports low or non-applicable risk, with approval from the team’s tech lead | Document the justification and establish a review date |
| **Escalate** | Significant impact, active exploitation, insufficient mitigation, or a required security exception | Escalate to the team's tech lead for further review |
| **False positive** | The scanner incorrectly identifies an affected component, version, or vulnerability | Document supporting evidence and dismiss appropriately |

Every decision is recorded as a VEX statement in Step 5.

Risk acceptance should not be based solely on the absence of an available patch. Vulnerabilities without fixes may require compensating controls or escalation.

Remediation timelines and approval requirements should follow the organization's security policies.

### Step 5: Record a VEX Statement

[VEX (Vulnerability Exploitability eXchange)](https://openvex.dev/) provides a standardized way to document whether a vulnerability affects a specific image or artifact and why.

After completing the triage assessment, record the outcome in an OpenVEX file (proposed location: `.vex/ef-cms.openvex.json`).

Each statement should include:

- **Vulnerability:** The CVE being evaluated.
- **Product:** The affected image or artifact, using an appropriate identifier.
- **Status:** `affected`, `not_affected`, `fixed`, or `under_investigation`.
- **Justification:** Why a finding is `not_affected`, when applicable.
- **Supporting evidence:** A brief explanation and references supporting the assessment.

VEX status should reflect whether the vulnerability affects the product, not simply whether the team has accepted the risk.

To verify a statement against an image:

```bash
trivy image --vex .vex/ef-cms.openvex.json --show-suppressed <image>
```

Review the results to confirm that only the intended findings are suppressed.

**Example:** a minimal statement for [Example 1](#example-1-zlib-in-the-batch-base-image). Tested with Trivy 0.76 against the built batch image (`docket-entry-zipper`): both zlib findings were suppressed and every other finding was still reported.

```json
{
  "@context": "https://openvex.dev/ns/v0.2.0",
  "@id": "https://github.com/ustaxcourt/ef-cms/blob/staging/.vex/ef-cms.openvex.json",
  "author": "U.S. Tax Court DAWSON team",
  "timestamp": "2026-10-20T00:00:00Z",
  "version": 1,
  "statements": [
    {
      "vulnerability": { "name": "CVE-2023-45853" },
      "products": [
        { "@id": "pkg:deb/debian/zlib1g" },
        { "@id": "pkg:deb/debian/zlib1g-dev" }
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_present",
      "impact_statement": "The vulnerability is in MiniZip. Debian bookworm's zlib does not build MiniZip (https://security-tracker.debian.org/tracker/CVE-2023-45853)."
    }
  ]
}
```

Each product is an affected package's package URL (purl). Take it from Trivy's JSON output (`.PkgIdentifier.PURL`). Omit the version, as above, only when the justification holds for every version. Identify packages, not images: the scans build their images locally, so an image identifier such as `pkg:oci/node?...` does not match what CI scans.

**Note:** DAWSON's existing container scans do not currently consume this VEX file. Integrating VEX into the CI/CD scanning workflow would require a separate change.

## 3. DAWSON Worked Examples

The following examples demonstrate how a finding's actual risk may differ from its reported severity.

### Example 1: zlib in the Batch Base Image

**Finding:** CVE-2023-45853 — `zlib1g-dev`

- **Presence:** The package is installed in the base image.
- **Affected functionality:** The vulnerability relates to MiniZip.
- **Evidence:** Debian's security tracker indicates that the affected MiniZip functionality is not built into the relevant Bookworm zlib package.
- **Assessment:** The vulnerable functionality is absent despite the reported package version.
- **Recommended decision:** Classify as not affected, with supporting vendor evidence.
- **VEX statement:** `not_affected` with `vulnerable_code_not_present` (see the [Step 5 example](#step-5-record-a-vex-statement)).

### Example 2: Perl Archive::Tar in the Puppeteer Build Image

**Finding:** CVE-2026-42496 — Perl Archive::Tar path traversal

- **Why it was reported:** Debian tracks the CVE against its `perl` source package, so Trivy flags every package built from that source. In `node:24.21.0-slim`, that is `perl-base`.
- **Presence:** `perl-base` is the only Perl package in the image. Archive::Tar ships in `perl-modules-5.36`, which is not installed, and the image contains no `Archive/Tar.pm`:
  ```bash
  docker run --rm node:24.21.0-slim sh -c 'dpkg -l | grep perl; find / -name Tar.pm 2>/dev/null'
  ```
- **Assessment:** The vulnerable code is not in the image, so the finding does not apply, whatever the image is used for.
- **Recommended decision:** False positive.
- **VEX statement:** `not_affected` with `vulnerable_code_not_present`.

This is also why Step 1 checks the affected component, not just the package name in the alert.

### Example 3: Linux Kernel Headers in the Batch Image

**Finding:** Multiple CVEs associated with `linux-libc-dev`

- **Presence:** The package is inherited from the full Node.js base image.
- **Classification:** OS-level development headers.
- **Exposure:** The headers are used for software compilation; the running container uses its host's Linux kernel.
- **Assessment:** Kernel-header presence alone does not establish that the running kernel is affected.
- **Recommended decision:** Verify the specific CVEs and distinguish header-related findings from vulnerabilities in the actual host kernel before accepting or dismissing them.

### Example 4: ImageMagick in the Batch Image

**Finding:** CVE-2026-109279 — `libmagickwand-dev`

- **Presence:** The package is inherited from the full Node.js image.
- **Classification:** OS-level development dependency.
- **Reachability:** The batch zipper uses the AWS SDK and `fflate` to retrieve and compress files. No image-processing functionality has been identified in that code path.
- **Assessment:** The reported vulnerability appears unlikely to be reachable through the batch workload, pending confirmation of indirect usage.
- **Recommended decision:** Document the limited exposure and consider removing unnecessary packages through a smaller base image.

These examples also highlight a potential improvement: using the `-slim` variant of the current Node tag instead of the full Node.js image for the batch workload could reduce unnecessary OS packages and associated findings, subject to compatibility testing.

## 4. Recording Triage Decisions

Each reviewed finding should include sufficient information for another engineer or security reviewer to understand the conclusion.

Use the following template:

```markdown
### Vulnerability Assessment

**Alert:** <GitHub alert URL>
**CVE:** <CVE ID>
**Severity:** <Scanner severity>
**Image:** <Image name / scan category>
**Package:** <Name and installed version>

**1. Presence**
- Present in relevant artifact: Yes / No / Unknown
- Evidence:

**2. Classification**
- Source: OS / Application
- Origin: Inherited / Added
- Phase: Build-time / Runtime / Both

**3. Risk Assessment**
- Reachability:
- Exploitability:
- Exposure:
- Available patch or mitigation:

**4. Decision**
- Outcome: Fix / Accept / Escalate / False Positive
- Justification:
- Owner:
- Remediation or review date:

**5. VEX Statement**
- Status / justification:
- PR adding the statement:
```

## 5. Review and Maintenance

Vulnerability assessments should be revisited when relevant conditions change, including:

- Base image or dependency updates.
- Changes to Dockerfiles or container execution.
- New application features that introduce additional input or execution paths.
- New exploit intelligence or patches.
- Changes to AWS permissions, network access, or deployment configuration.

Accepted findings should include a review date and supporting justification to prevent outdated risk assessments from remaining indefinitely.

When a reassessment changes a decision, update its VEX statement in `.vex/ef-cms.openvex.json` in the same PR: change the `status`, refresh the statement's `timestamp`, and increment the file's `version`. A `fixed` statement can be removed once the affected package no longer appears in any scanned image.

## Summary

DAWSON container findings should be evaluated based on **package presence, dependency classification, reachability, exploitability, and exposure**, rather than scanner severity alone.

The process provides a consistent way to identify actionable security risks, reduce unnecessary remediation effort, and document defensible decisions to fix, accept, or escalate vulnerabilities.
