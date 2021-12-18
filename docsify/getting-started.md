## Getting Started with Dawson

To truly understand the Dawson system, it's important to understand the users of the system.  This part of the guide will show you how to login to dawson, the various urls we have with our system, the various user roles we have, and how you could login to one of our running environments using some mock users we create.


## Two Main Web Applications

There are two main applications that we deploy for the Dawson system which try to address the needs of authenticated and unauthenticated users.

### 👪 Public UI

Our **public** web application contains features accessible to the general public, such as *searching for a case*, *searching orders*, *searching opinions*, and *viewing the public docket entries of a case*.  This application does not require any form of authentication to be able to do searches.  The public UI also drives support for the **terminal user** which are users physically inside the Tax Court building needing to search our public records.

### 🔒 Private UI

The majority of our application code and features exist in a private user interface which requires authentication.  The private application contains features specific to the internal operations of the tax court building.  This is the application the Petitions Clerks will login to review and serve petitions, Docket Clerks will create and serve docket entries, and Judges can sign docket entries and message other internal members of the system.  User authentication is handled using [AWS Cognito](https://aws.amazon.com/cognito/); therefore, all the logins are managed in this third party Cognito system.

## Logging into Dawson

Our Dawson application is hosted on a variety of different environments on different domains.  Flexion maintains their own instances of the Dawson system deployed to a Flexion AWS account separate from the Tax Court.  This enabled Flexion to experiment with new features, security settings, new AWS services, etc without the need to ask the Tax Court's tech lead for special permissions or setup.  The following links all redirect to the **public ui**, but you can **click the log in** link in the header to navigate to the private application which should redirect you to a cognito login.

Here is a list of the **Tax Court**'s deployed Dawson instances:

- [https://dawson.ustaxcourt.gov/](https://dawson.ustaxcourt.gov/) (production)
- [https://mig.ef-cms.ustaxcourt.gov/](https://mig.ef-cms.ustaxcourt.gov/) (migration)
- [https://test.ef-cms.ustaxcourt.gov/](https://test.ef-cms.ustaxcourt.gov/) (test)
- [https://irs.ef-cms.ustaxcourt.gov/](https://irs.ef-cms.ustaxcourt.gov/) (irs)

And the **Flexion** environments:

- [https://dev.ustc-case-mgmt.flexion.us/](https://dev.ustc-case-mgmt.flexion.us/) (flexion develop)
- [https://stg.ustc-case-mgmt.flexion.us/](https://stg.ustc-case-mgmt.flexion.us/) (flexion staging)
- [https://exp1.ustc-case-mgmt.flexion.us/](https://exp1.ustc-case-mgmt.flexion.us/) (flexion experimental1)
- [https://exp2.ustc-case-mgmt.flexion.us/](https://exp2.ustc-case-mgmt.flexion.us/) (flexion experimental2)
- [https://exp3.ustc-case-mgmt.flexion.us/](https://exp3.ustc-case-mgmt.flexion.us/) (flexion experimental3)
- [https://exp4.ustc-case-mgmt.flexion.us/](https://exp4.ustc-case-mgmt.flexion.us/) (flexion experimental4)
- [https://exp5.ustc-case-mgmt.flexion.us/](https://exp5.ustc-case-mgmt.flexion.us/) (flexion experimental5)


## Dawson User Roles

The Dawson system is built using a role based authentication system.  Each user in Dawson has different permissions to various features in the application.  For example, only a petitionsclerk has the ability to serve a petition, whereas a docketclerk has the ability to upload a docket entry.  Here is a list of the current roles we have in our system:

?> Check out our [User Roles](/roles) documentation page to learn more about each of the various user roles in the Dawson system.

- adc
- admin
- admissionsclerk
- chambers
- clerkofcourt
- docketclerk
- floater
- general
- inactivePractitioner
- irsPractitioner
- irsSuperuser
- judge
- legacyJudge
- petitioner
- petitionsclerk
- privatePractitioner
- reportersOffice
- trialclerk


## Mock Users

After deploying a brand new Dawson environment, an admin will manually run the [setup-test-users.js](https://github.com/ustaxcourt/ef-cms/blob/staging/shared/admin-tools/user/setup-test-users.js) script to create these mock users in our deployed environments so that members of our team can login and interact with the system to test the various roles.  This script will generate the following test users will allow you to login.

!> **Ask your team lead for the passwords.**

?> the **1** in the emails is an example; you can use adc2@example.com, or adc10@example.com, etc...

| email                         | role            | number of users |
|-------------------------------|-----------------|-----------------|
| adc1@example.com              | adc             | 10              |
| admissionsclerk1@example.com  | admissionsclerk | 10              |
| clerkofcourt1@example.com     | clerkofcourt    | 10              |
| docketclerk1@example.com      | docketclerk     | 10              |
| petitionsclerk1@example.com   | petitionsclerk  | 10              |
| trialclerk1@example.com       | trialclerk      | 10              |
| floater1@example.com          | floater         | 2               |
| general1@example.com          | general         | 2               |
| reportersOffice1@example.com  | reportersOffice | 2               |
| ashfordsChambers1@example.com | chambers        | 5               |
| buchsChambers1@example.com    | chambers        | 5               |
| cohensChambers1@example.com   | chambers        | 5               |

## 💡 Test Your Knowledge

It's time to get your feet wet with Dawson.  Don't worry, I'll walk you through how you can file a petition as a petitioner and then later serve that petition as a petitionsclerk. 

1. Login into to environment as `petitioner4@example.com` and click the `Create a Case` button.
2. Read the instruction and try walking through the start a case wizard and give it a try.
3. When the case is created, you should see it show up on your dashboard! 
4. Write down your docket number (xxx-xx), you'll need it for the next steps
4. Now, try logging in as `petitionsclerk2@example.com`
5. Search for the case by docket number xxx-xx which will take you to the case
6. Click on the `petition` link that's in the case's docket record table
7. Review the petition information to make sure it's correct and press the `Review Petition` button
8. Review on the confirmation page and click `Serve to IRS` (don't worry, it won't really serve anything to the IRS)
9. Congrats 🥳, you filed your first petition as a petitioner and reviewed / served it as a petitionsclerk

This is just one of many user flows we have in our system.  The reason we started you off with a petition is because a petitioner filing their petition is the start of the life cycle of a Case.