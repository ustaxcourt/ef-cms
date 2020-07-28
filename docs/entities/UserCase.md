# UserCase
 ```
---
  type: "object"
  keys: 
    caseCaption: 
      type: "string"
      flags: 
        presence: "required"
        description: "The name of the party bringing the case, e.g. \"Carol Williams, Petitioner,\" \"Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner,\" or \"Estate of Test Taxpayer, Deceased, Petitioner.\" This is the first half of the case title."
      rules: 
        - 
          name: "max"
          args: 
            limit: 4700
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Auto-generated from docket number and the suffix."
    leadDocketNumber: 
      type: "string"
      flags: 
        presence: "optional"
        description: "If this case is consolidated, this is the docket number of the lead case. It is the lowest docket number in the consolidated group."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    status: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
        description: "Status of the case."
      allow: 
        - "Assigned - Case"
        - "Assigned - Motion"
        - "Calendared"
        - "CAV"
        - "Closed"
        - "General Docket - Not at Issue"
        - "General Docket - At Issue (Ready for Trial)"
        - "Jurisdiction Retained"
        - "New"
        - "On Appeal"
        - "Rule 155"
        - "Submitted"
      metas: 
        - 
          tags: 
            - "Restricted"

 ```
