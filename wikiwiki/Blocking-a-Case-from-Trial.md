[Return to Directory](./README.md)

## Manually Blocking a Case from Trial
* Users can manually block a case from trial from the Case Detail > Case Information > Overview screen
* When blocking, user must enter a reason for the block (which displays on the Case Detail screen and also the Blocked Report)

#### Removing a Manual Block
* Users can manually remove a manual block by clicking the Remove Block link on the Case Detail page
* This will remove the manual block on the case, but any system generated blocks will remain until resolved

## System Blocks
* An automatic system block is added to a case whenever the case has a Pending Item or a Deadline
* Deadlines and pending items do not block a case if case status = Calendared
* System blocks can only be removed by removing the Pending Item, or Deadline directly
* The "System blocked from trial mm/dd/yy" displays the date the deadline or pending item was added.
* Users can add and remove manual blocks independent of any system blocks

#### System block on "High Priority" case
* If a case has been set as High Priority for a trial session, and then receives a system block, once the system block is removed, the case should return to [High Priority](https://github.com/flexion/ef-cms/wiki/Setting-a-Case-for-Trial) status

## Viewing Blocked Cases
* "Blocked" indicator (red label) displays in docket header
* Case is excluded from eligible cases for any trial session
* Warning is displayed on Case Detail > Case Info tab stating if the block is manual or system, the date the block was added, and the reason
