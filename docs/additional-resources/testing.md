# Testing

We maintain a extensive test suite to ensure application stability, usability, and data integrity. This document outlines the kinds of testing in play and what they test.

## Automated testing

```
       👤
    Browser
       ↓
 React component ⎫
       ↓         ⎪
     Event       ⎬ Frontend
       ↓         ⎪
    Sequence     ⎭
       ↓
    JSON API       (REST, WebSockets)
       ↓
    Handler      ⎫
       ↓         ⎪
   Interactor    ⎪
       ↓         ⎬ Backend
    Gateway      ⎪
       ↓         ⎪
     Client      ⎭
       ↓
   Data storage
       💾
```

This is a general layer diagram, representing the majority of requests and responses, to aide in the descriptions below. For a more accurate system diagram, see the [README](./README.md).

### Local application testing

These tests run locally on developer machines and in CI against a locally-running application, using mocked AWS services as needed.

| Type | Tool | Purpose and notes
|------|------|------------------
| Lint | [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) | Ensures consistent formatting of code, and catches common errors in syntax. Covers all layers of the application.
| Unit | [jest](https://jestjs.io/) | Ensures functions and code paths behave as expected in isolation. There are separate test runs against `web-api`, `web-client`, and `shared`, and cover their area of code (Event, Sequence, Handler, Interactor, Gateway, or Client).
| Integration | [jest](https://jestjs.io/) | Covers layers from Events to Data storage and back, using a simulated browser environment. Ensures layers interact with each other and mocked data storage layers correctly.
| Accessibility | [pa11y](https://pa11y.org/) | Scanning of web interfaces to catch common accessibility mistakes.
| Accessibility | [Manual](#accessibility) | Manual testing of the application ensures it is accessible through common screen readers.

### Testing run in an AWS environment

| Type | Tool | Purpose and notes
|------|------|------------------
| Smoke (end-to-end) | [cypress](https://www.cypress.io/) | Run daily. Ensures user flows work from browser down through application components using real AWS services.
| End-to-end | [Manual](#manual-end-of-sprint-qa) | Manual testing of common user workflows happens at the end of sprints.
| Smoke (security) | [pa11y](https://pa11y.org/) | Run daily. Assets security headers are appropriately configured. Would be included in the Cypress test suite, but cannot due to Cypress stripping the security headers.

#### Production testing

The above tests run before code is introduced into the production environment to ensure the code meets quality standards. In the production environment, monitoring and alerting ensures the application is configured and available.

## Manual testing

### Manual end of sprint QA

At the end of a sprint PR, we'd like to run manual smoke tests over our system in an attempt to reduce bugs sent to the court's system.  The following manual tests can be ran by following the steps provided:

#### Verify Cognito Registration
- go to the cognito UI
- create a new user with your email, i.e. cseibert+petitioner1@flexion.us
- verify you received a verify email
- login to your petitioner account

#### Verify Email Notifications
- If you already have a petitioner account, login and create a case
- keep track of that docket number
- login as a petitions clerk
- upload a pdf to the case created by your petitioner
- sign the pdf
- add a docket entry
- serve
- verify the petitioner got an email notification

#### Verify Web Sockets - Batch Download Case as Judge

- If you already created that case above, you should be able to just add it to a trial session
- login as a docketclerk
- navigate to case created above, or a case with an electronic service party
- manually add the case to a trial session
- this should make a request to the websocket endpoint
- if web sockets fail, you will see it in the console

### Accessibility

The best form of manual accessibility testing is performed by those who are expert and routine users of assistive technologies. Routine or new users of assistive technology should also feel comfortable testing the application, as it will catch the most obvious and severe accessibility issues.

Developers and designers are encouraged to use accessibility tools to test their web applications during development and when reviewing changes.

- On Windows, [NVDA (free)](https://www.nvaccess.org/download/) and [JAWS (monthly or annual license)](https://www.freedomscientific.com/Downloads/JAWS) are recommended.
- On MacOS, [VoiceOver](https://www.apple.com/voiceover/info/guide/_1124.html) is built-in to the operating system.

#### MacOS VoiceOver Usage

It is recommended that you use Safari when testing with MacOS VoiceOver.

In the Safari Preferences > Advanced

- [√] Press Tab to Highlight Each Item on a Web page

Open MacOS System Preferences > Keyboard > Shortcuts
At bottom, “Full Keyboard Access…”

- [√] All Controls

| Key Combination        | Action                                                                      |
| ---------------------- | --------------------------------------------------------------------------- |
| `⌘COMMAND` + `F5`      | Turn VoiceOver On                                                           |
| `^CONTROL` + `⌥OPTION` | equals `VO`                                                                 |
| `VO` + `;`             | lock `VO` mode (don't need to press `VO` with other key combinations below) |
| `VO` + `SHIFT` + `↓`   | enter webpage                                                               |
| `VO` + (`←` or `→`)    | navigate through sentences/areas of webpage                                 |
| `VO` + `H`             | reads help                                                                  |
| `VO` + `A`             | read page                                                                   |
| `^CONTROL`             | Stop reading                                                                |
| `VO` + `SPACE`         | click button or link                                                        |
|                        |                                                                             |
| `VO` + `U`             | use `rotor`                                                                 |
| (`rotor`) `←` or `→`   | "rotate" rotor for Tables, Links Web Hot spots, Navigation                  |
| (`rotor`) `↑` or `↓`   | list rotor items                                                            |
| (`rotor`) `ESC`        | turn off rotor menu                                                         |

See Also:

- https://webaim.org/articles/voiceover/
- https://webaim.org/blog/three-things-voiceover/
- https://webaim.org/articles/screenreader_testing/
- https://egghead.io/lessons/tools-using-the-voiceover-screen-reader-to-test-for-accessibility
- http://etc.usf.edu/techease/4all/vision/how-do-i-use-webrotor-in-voiceover/
- http://www.perkinselearning.org/technology/posts/intro-chrome-chrome-os-accessibility-video-series
