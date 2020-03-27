# How We Work

## Principles

Our basic principles drive team decision-making.

1.  **Build using agile and iterative practices.** We use iterative software development to deliver features to users and reduce risk.

2.  **Understand what people need.** We practice human-centered design to inform technical and design decisions. We continually explore and pinpoint the needs of the people who use the service and build functionality to meet their needs. We design an intuitive system that allows users to succeed the first time, unaided, and follow accessibility best practices to ensure all people can use the service.

3.  **Own and manage our data.** We ensure that all Court data remains in the Court's care, custody, and control.

4.  **Own and manage our software.** We retain control over our mission-critical custom software, ensuring portability and flexibility by using service-oriented architecture.

5.  **Default to open.** We build secure, open source software, creating and maintaining it in public repositories, where it may be inspected by the public who places their trust in it, and where it is available for use by other courts.

6.  **Build atop a modern technology stack.** We use cloud-based hosting infrastructure, modular software frameworks, containerization, and automated testing to increase efficiency, allow the team to work effectively, and scale the service on demand.

7.  **Favor emergent architecture over "big up-front design."** Consistent with agile, we optimize for serving the emergent needs of users, instead of planning and executing an architecture that cannot respond to those changing needs.

8.  **Deliver incremental value.** We deliver value to users as often as possible.

9.  **Rely on DevSecOps.** This allows us to rapidly develop and deploy improvements to our systems, infrastructure-as-code, configuration-as-code, and CI/CD, to ensure that our work is high-quality and secure.

10. **Embrace and drive change.** We recognize that this work requires constant learning on the part of all participants, and embrace the state of not-knowing that must precede learning.

## Product Team

There is a cross functional product team for the U.S. Tax Court case management system, comprised of business, policy, security, procurement and technical specialists who are working together to move the entire enterprise forward towards its goals. This product team is comprised of the following roles:

-   Product owner: U.S. Tax Court
-   User Experience designer: vendor
-   Visual designer: vendor
-   Researcher: vendor
-   Developers (Front-end, Back-end, Full-stack): vendor
-   Technical lead: vendor
-   Scrum Master: vendor

This team will participate in all scrum ceremonies in service of prioritizing, defining and delivering value to the Court and the stakeholders it serves.

## Tech Strategy

We plan to deploy "minimal viable product" functionality by July 2020 to move away from our legacy system, and then move to an indefinite phase of continually adding functionality for users.

## Design Research

We recognize that the Court staff and members of the public will be critical to helping us develop solutions that will deliver better service to petitioners, practitioners, and Court staff. We will continuously perform observational research and usability testing, and create lightweight prototypes, to iterate on designs and develop a system that meets end-user needs.

## Meetings

There are two basic meeting rhythms: daily design calls/standups and bi-weekly agile sprint rituals.

Every day, at 10 AM Eastern, we hold a design call where the UX/UI designers can present new designs and get feedback from stakeholders and approval from the Product Owner. The development team also demos any new work at the design meeting to get immediate, iterative feedback. The daily design meeting is followed by a tight 15-minute standup.

Every two weeks we hold sprint ceremonies. Before the start of a sprint, we ensure the backlog is groomed (prioritizing the work in the backlog). Each two-week sprint begins with sprint planning (define the work to be done over the next two weeks). Each sprint ends with a sprint review (demonstrate work done, and accept or reject that work) and a sprint retro (review the process of how the team performed in this sprint).

All meetings are held via video teleconference. A telephone bridge is maintained as a backup method of connecting, but participants are strongly encouraged to join via video.

## Definition of Done

Documented in the current vendor's "[definition of
done](https://docs.google.com/document/d/1KO1Gh1bHo3TaeRhr6inPqqC-op00XkqiyTxYIOQVE6g/edit?ts=5c93ef23)" (internal doc, access may be limited to Court, vendor, and [18F](https://18f.gov/) staff).

## Accepting Vendor Work

Acceptance of work happens through the sprint as work is completed. The
procedure is as follows:

1.  Development team completes work — see "[definition of done](https://docs.google.com/document/d/1KO1Gh1bHo3TaeRhr6inPqqC-op00XkqiyTxYIOQVE6g/edit?ts=5c93ef23)" (internal doc, access may be limited to Court, vendor, and 18F staff)
2.  The product team verifies the functionality against acceptance criteria in a deployed instance for a feature-level pull request
3.  Development team creates pull request to the Court's staging environment — see [Pull Request Process](https://github.com/ustaxcourt/ef-cms#sprint-prs)
4.  The code is reviewed by the Court for compliance with the contract's [performance and deliverable standards](https://github.com/ustaxcourt/case-management-rfq/blob/master/02_SOW.md#deliverables-and-performance-standards), and for general technical quality — see [Code Review Process](https://github.com/ustaxcourt/ef-cms/blob/staging/docs/CODE_REVIEW.md)
5.  The development team responds to the Court’s code review feedback
6.  Pull request merged to staging branch and deployed to the staging environment by the Court
7.  User testing is performed
8.  Court creates pull request to master branch
9.  Court CISO, or their appointee, reviews the pull request before accepting the pull request and deploying to production

## Testing Strategy

We test at three levels: unit tests, integration tests, and feature tests. For details about how we create and maintain unit, integration and feature tests, see [18F's "Automated Testing Playbook."](https://automated-testing-playbook.18f.gov/)

-   Unit: Unit tests must be created for all new code, during the sprint in which the code is written, with total coverage of at least 90%.
-   Integration: Whenever two systems or components interface, there must be automated tests to ensure that they're interfacing correctly.
-   Feature: New features must have functional definitions of what they do, and a description of human-performable actions to verify that they perform that thing.

## Code Review Process

Documented in [our Code Review
Process](https://github.com/ustaxcourt/ef-cms/blob/staging/docs/CODE_REVIEW.md).

## Tools

-   GitHub: We use our [GitHub organization](https://github.com/ustaxcourt/ef-cms) for storing both software and collaboratively-maintained text.
-   ZenHub: We use the vendor's [ZenHub organization](https://github.com/flexion/ef-cms#workspaces/ef-cms-5bbe4bed4b5806bc2bec65d3/boards?repos=152320868&showPipelineDescriptions=false) for storing the product backlog.
-   Zoom: We use both the Court's and vendor's Zoom accounts for video teleconferences.
-   Slack: We use both the Court's and vendor's Slack for communication that falls outside of the structure of GitHub or ZenHub, but that doesn't rise to the level of email, or for communication that it's helpful for everybody else to be able to observe.
