# DAWSON Team Charter (Updated 01/24)

### Vision Statement:

For parties, practitioners, Court staff, and the public at large, DAWSON is a one-stop app that makes working with the USTC secure, efficient, and reliable. DAWSON empowers all of its users with an accessible, frictionless experience and sets the standard for how to engage with and manage the administration of justice.

### Mission Statement:

The mission of the DAWSON Product Team is to continue to add and improve functionality that gives the US Tax Court, its constituents and the public an easy, efficient and simple way to access and manage cases. The DAWSON team uses Agile principles, clean architecture practices, test driven development, and team collaboration to identify, ideate on and deliver high-quality solutions that give users confidence in the system and increase transparency for the US Tax Court. Unlike previous legacy systems, DAWSON empowers petitioners and the Court by providing increased accessibility into Court data, is web-based and can be accessed from anywhere there’s Internet, and is built for scalability.

### Team Members:

Jenna Hansen - Delivery Manager

Jason Fu - Software Engineer

Rachel Rogers - Software Engineer

Sui Wong - User Experience Design and Research 

Katie Cissell - User Experience - Lean

Cody Seibert - Software Engineer

Joshua Abu - Software Engineer

Tom Elliott- Software Engineer

Jonathan Cruz - Software Engineer

Zach Rogers - Software Engineer

Nechama Krigsman - Software Engineer

Kaitlyn Swann - Software Engineer

Mike Marcotte (USTC) - Senior Software Developer/Tech Lead

Jim Lerza (USTC) - IT Specialist

Jim deVos (USTC) - IT Specialist

Tenille Lenard (USTC) - Product Specialist

Chris Holly (USTC)- Product Owner

### Core Values:

**Respect and Appreciation**: Be excellent to one another. We respect and appreciate our teammates as individual people and as co-workers. We take time to give regular feedback and accept that our differences can also be a strength.

**Assume Positive Intent**: We encourage trust and default to assuming our teammates are working to the best of their ability with the resources and information they have now. We approach each situation on its own terms and respond accordingly.

**Communication:** We value open and honest communication and go out of our way to understand one another to provide context and clarity. We believe cooperation and communication are keys to our success.

**Knowledge Sharing:** We share as much knowledge as possible with one another to allow us to continuously build, grow and improve our capabilities.

**Experimentation**: Because _we don’t know what we don’t know_. By experimenting, we increase optionality which helps us learn/reveal what we don’t know through the process of elimination. Sometimes multiple experiments are needed and failures can inform successes. Sometimes experiments will fail no matter what and that is okay, too. All experiments should be time boxed and have a concrete set of goals.

**Quality**: We embrace exceptions, backtracking and refactoring code. Producing high quality software (low defects, easy to manage and understand) is far more important than quickly delivering features. We use the refinement meeting as our first point of quality assurance and have defined what it means for a story to be READY and DONE so that we have guard rails for our minimum standards. Mistakes are valued as learning opportunities and failure generates more knowledge. We retrospect on failures and success to make improvements for the future. We work on stories in collaboration with one another because it produces higher quality software, shortens feedback loops, increases creativity, and strengthens knowledge sharing.

**Psychological Safety**: Team members should feel safe to explore their ideas and expect a diversity of opinions. We can disagree and still be respectful and open to ideas.

**Embrace and drive change**. We recognize that this work requires constant learning on the part of all participants, and embrace the state of not-knowing that must precede learning.

**Feedback**: Feedback is a function of respect whether you are the giver or the receiver. We maintain a list of how people prefer to receive feedback and try to default to that style when possible and make room to formally offer and receive feedback.

### Working Agreements:

**Flexion Specific Agreements:** Flexion uses its [<u>Flexion Fundamentals</u>](https://docs.google.com/document/d/1kaPsF-HnKgPao1V_DZhtaFhW-9ADoVprsmF-jyR7Puc/edit?usp=sharing) as a “north star” guide to how we operate as an organization and our [<u>Accountabilities</u>](https://sites.google.com/flexion.us/advising-group/how-we-work/accountabilities) list to assign team specific responsibilities.

**Agile First:** We run agile meetings and use iterative processes as a framework for how we operate and get work done. We consistently deliver working, prioritized features to stakeholders. We value continuous improvement, inspection and adaptation.

**Core Team Hours**: Our team runs across four time zones and we all have responsibilities outside our core team. To this end, we keep core hours (10AM-3PM Eastern) open for team members to collaborate.

**Time Away**:

- If you step away from your desk for more than a few minutes, update your status in Slack.

- If you plan to be gone for a half-day or longer, add the time away to the team calendar, block off your calendar, and decline meetings.

- Before your planned absence, update Slack and your calendar with OOO notifications.

**Methods of Communication**

- We use the **Clarion zoom room** to start all collaborative and informal meetings.

- We use **Slack** to update our whereabouts, ask questions and post general announcements. Slack should be on and checked regularly throughout the day.

- We use Google **email** and **calendars** to send agendas and schedule/decline meetings.

- **Stand up** We meet daily to communicate our goals and/or blockers for the day. We demonstrate work in progress and strive to understand our team priorities.

- We track our work on **GitHub** and **Trello**; updating daily as we complete tasks.

**Meetings**

We meet regularly to provide feedback, refine, retrospect, make decisions, communicate and iterate.

- Meetings have an agenda and clear expectations of the goal.

- Cameras should be on in meetings when facilitating, presenting, or working with end users. Cameras are optional for team meetings, but we try to balance zoom fatigue and the value of communication via facial expressions.

- We respect the start and finish times of meetings so that we are not disruptive to other commitments.

- We decline meetings we will not attend. We decline/do not attend meetings that bring us no value.

**Voting**

As a team we use multiple methods of voting for decision making within the team.

- **Roman voting**: for quick feedback from the group on a singular topic.

- **Planning Poker**: for estimation voting and on the urgency and importance in regards to the DevEx/OpEx backlog.

### Technical Working Agreements:

- We default to collaborative working styles. We do this because it produces higher quality software, helps developers find defects in a shorter feedback loop, increases creativity, and strengthens knowledge sharing. Working style is determined by each story’s needs and may change due to unforeseen circumstances. Stories are self assigned and anyone can join or leave as needed. The preference is for the group to remain together until the story is completed but can be fluid. Taking breaks from cameras/mics/groups are acceptable whenever the need arises as long as it’s communicated to the group.
    - **Ensembles:** 2+ people actively working toward a shared goal in a structured, highly-engaged environment; Utilized when tight, frequent feedback loops are needed or desired; High expectations from contributing members with regard to engagement and communication
    - **Swarming:** 2+ people working on independent tasks in a Zoom; Utilized when you need or desire more frequent feedback than when working independently; Relies on speaking up when you need assistance or to bounce ideas off each other
    - **Async:** 1 person working asynchronously on one task at a time; Utilized when live/in-person feedback is not needed; Small, frequent PRs expected from other team members; Design debt/devex are good examples of this type of work
    - **Ensembles** of 3+ can merge to test without external code reviews. Groups of two or individuals require at least one code review from a team member who didn't work on the PR.

- We practice human-centered design to inform technical and design decisions. UX are embedded members of the development team and perform usability tests, interviews, brainstorming sessions and collaborate with devs and the PO throughout the SDLC.

- Favor emergent architecture over "big up-front design." Consistent with agile, we optimize for serving the emergent needs of users, instead of planning and executing an architecture that cannot respond to those changing needs.

- Refactoring is a regular and expected part of story work because we work in a mature application.

- We strive to iteratively add vertical slices of functionality to the DAWSON application using clean code principles and test coverage standards.

- We maintain and prioritize package dependencies and perform regular security audits.

- We follow agreed upon guidelines and processes for code review, code merge, refactoring, definitions of ready/done and test coverage.

- We Identify and fix technical risk within the system.

- Default to open. We build secure, open source software, creating and maintaining it in public repositories, where it may be inspected by the public who places their trust in it, and where it is available for use by other courts.

- Own and manage our data. We ensure that all Court data remains in the Court's care, custody, and control.

- Own and manage our software. We retain control over our mission-critical custom software, ensuring portability and flexibility by using service-oriented architecture.

- Build atop a modern technology stack. We use cloud-based hosting infrastructure, modular software frameworks, containerization, and automated testing to increase efficiency, allow the team to work effectively, and scale the service on demand.

- Rely on DevSecOps. This allows us to rapidly develop and deploy improvements to our systems, infrastructure-as-code, configuration-as-code, and CI/CD, to ensure that our work is high-quality and secure.

- Embrace and drive change. We recognize that this work requires constant learning on the part of all participants, and embrace the state of not-knowing that must precede learning.
