[Return to Directory](./README.md)

# Message Actions

## Create New Message
*  "Create New Message" is displayed in the actions dropdown on Case Detail header for all internal users
* On click of Create New Message, the Create New Message modal displays

**Select section/ recipient**
* Required fields

**Subject line**
* Is required
* Free text field

**Add message**
* Is required
* Free text field

**On Save**
* Modal closes and success message displays "Your message has been sent."
* Message is saved and associated with case
* Message Detail screen is created
* Message appears in Sent box for sending user and Section Sent box
* Message appears in the recipient's My Messages Inbox, and the Section Messages Inbox

## Reply to a Message
**Recipient**
* original sender is displayed read-only as recipient

**Subject line**
* current subject is displayed (i.e. the subject line sent in the original message)
* subject line field is editable

**Attachments**
* Displays all documents attached to message in read-only

**On Send**
* App remains on Message Detail with success message displayed
* Sent message displays in My Messages > Sent and Section Messages > Sent box
* Message displays in My Messages > Inbox / Section Messages > Inbox of the recipient
* Message thread displays on Message Detail screen

## Forward a Message
**Select section/ Select recipient**
* User must select section and then recipient from dropdowns

**Subject Line**
* current subject is displayed (i.e. the subject line sent in the original message)
* subject line field is editable

**Attachments**
* Displays all documents attached to message in read-only
* User is able to  add up to five total attached documents

**On Send**
* App remains on Message Detail with success message displayed
* Sent message displays in My Messages > Sent and Section Messages > Sent box
* Message displays in My Messages > Inbox / Section Messages > Inbox of the recipient
* Message thread displays on Message Detail screen

## Complete a Message
**Add Comment**
* Optional field - current functionality

**On Complete**
* App remains on Message Detail with completed warning displayed
* Message no longer displays in any user Inbox
* Completed message displays in My Messages > Completed and Section Messages > Completed
* Message thread displays as Completed on Message Detail screen

## Create Order/Notice From Message
**On click of "Create Order"**
* User selects the title of the order and continues
* User enter/pastes Order text and saves

#### Apply Signature
* On click of Save, app navigates to the Apply Signature screen for all Orders; for Notice, the app navigates back to the Message Detail (because the Clerk of the Court signature is automatically applied)
* User can skip signature and be brought back to the Message Detail
* User can apply and save signature

**On click of Skip or Save Signature**
* App navigates back to Message Detail screen with success message displayed
* Order is added to Drafts documents table
* Order is attached to Message
* Order is displayed as attachment on Message Detail screen
* If signature was added, Remove Signature action is displayed
* If signature was skipped, Apply Signature action is displayed

## Message Thread
* If there is more than one message in a thread, messages are displayed in accordion
* Current ("active") message is displayed as accordion header
* Expanded accordion displays all messages sorted newest to oldest

## Taking Action on a Draft Document from Message

#### Draft Document attached to Message
Users can take any of the  following actions on a Draft Document directly from the Message Detail
**Edit**
* For documents created in the system, this will take users to edit the actual content
* for PDF uploads, this will take users to replace the PDF

**Apply Signature (if no signature has been added)**
* Allows users to add a signature to a document and return to the Message

**Remove Signature  (if the document has been signed)**
* Allows users to add a signature to a document and return to the Message

**View Full PDF**
* opens PDF in new tab

**Add Docket Entry**
* Visible only for docket / petitions / clerk of the court
* Allows user to add docket entry for the draft, save or serve the entry and return to the Message  

#### Deleted documents attached to Message
* A draft document or correspondence document can be deleted while attached to a messages
* Once deleted, the document title still displays in the message attachments list with the indicator "Deleted"
* PDFs for deleted documents do not display in the PDF preview
