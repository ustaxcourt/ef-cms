[Return to Directory](./README.md)

# Messages

## Message sorting
* Inbox - oldest to newest by Received date
* Sent - newest to oldest by Sent date
* Completed - newest to oldest by Completed date

## Unread messages
* When a new message is received, a closed envelope icon is displayed on page refresh (not in real time) next to the Messages link in the header
* Total number of unread messages is displayed next to the My Messages page title
* Unread messages are indicated by bold text (Document Title) and a closed envelope icon
* Messages are considered “read” when the user clicks on the item into the Document Detail page from their My Messages inbox  
* Section Messages inbox does not indicate unread messages with an icon
* Message count shown on Section Messages should be number of TOTAL messages in box

## Sent messages
* Sent messages are visible in the Sent box for 7 days

## Message icons
* If Unread - Bold with blue envelope icon
* If High Priority - Red exclamation point (not implemented yet)
* If High Priority and Unread - Red exclamation point and bold (not implemented yet)

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
