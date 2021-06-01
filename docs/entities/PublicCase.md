# PublicCase
 ```
---
  type: "object"
  whens: 
    - 
      is: 
        type: "object"
        flags: 
          unknown: true
        keys: 
          isSealed: 
            type: "any"
            flags: 
              only: true
            allow: 
              - 
                override: true
              - true
      then: 
        type: "object"
        keys: 
          caseCaption: 
            type: "any"
            flags: 
              presence: "forbidden"
          createdAt: 
            type: "any"
            flags: 
              presence: "forbidden"
          docketEntries: 
            type: "array"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 0
          docketNumber: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "pattern"
                args: 
                  regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
          docketNumberSuffix: 
            type: "string"
            flags: 
              only: true
              presence: "optional"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
            allow: 
              - "X"
              - "R"
              - "D"
              - "L"
              - "P"
              - "S"
              - "SL"
              - "W"
          hasIrsPractitioner: 
            type: "boolean"
          isSealed: 
            type: "boolean"
          partyType: 
            type: "any"
            flags: 
              presence: "forbidden"
          petitioners: 
            type: "any"
            flags: 
              presence: "forbidden"
          receivedAt: 
            type: "any"
            flags: 
              presence: "forbidden"
  keys: 
    caseCaption: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 4700
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
        presence: "optional"
    docketEntries: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of DocketEntry Entities for the case."
      items: 
        - 
          type: "object"
          keys: 
            additionalInfo: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            additionalInfo2: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            attachments: 
              type: "boolean"
              flags: 
                presence: "optional"
            certificateOfService: 
              type: "boolean"
              flags: 
                presence: "optional"
            certificateOfServiceDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
              whens: 
                - 
                  ref: 
                    path: 
                      - "certificateOfService"
                  is: 
                    type: "any"
                    flags: 
                      only: true
                      presence: "required"
                    allow: 
                      - 
                        override: true
                      - true
                  then: 
                    type: "any"
                    flags: 
                      presence: "required"
                  otherwise: 
                    type: "any"
                    flags: 
                      presence: "optional"
                    allow: 
                      - null
            createdAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                presence: "optional"
                description: "When the Document was added to the system."
            docketEntryId: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            docketNumber: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Docket Number of the associated Case in XXXXX-YY format."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            documentTitle: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The title of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 3000
            documentType: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The type of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            eventCode: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "A"
                - "AAAP"
                - "AAPN"
                - "AATP"
                - "AATS"
                - "AATT"
                - "ACED"
                - "ADMR"
                - "ADMT"
                - "AFE"
                - "AFF"
                - "AFP"
                - "AMAT"
                - "AMDC"
                - "APA"
                - "APLD"
                - "APPL"
                - "APPW"
                - "APW"
                - "ASAP"
                - "ASUP"
                - "ATAP"
                - "ATSP"
                - "BND"
                - "BRF"
                - "CERT"
                - "CIVP"
                - "COED"
                - "CS"
                - "CTRA"
                - "DCL"
                - "DEC"
                - "DISC"
                - "DSC"
                - "EA"
                - "ES"
                - "EVID"
                - "EXH"
                - "FEE"
                - "FEEW"
                - "FTRL"
                - "HE"
                - "HEAR"
                - "LEA"
                - "LTR"
                - "M000"
                - "M001"
                - "M002"
                - "M003"
                - "M004"
                - "M005"
                - "M006"
                - "M007"
                - "M008"
                - "M009"
                - "M010"
                - "M011"
                - "M012"
                - "M013"
                - "M014"
                - "M015"
                - "M016"
                - "M017"
                - "M018"
                - "M019"
                - "M020"
                - "M021"
                - "M022"
                - "M023"
                - "M024"
                - "M026"
                - "M027"
                - "M028"
                - "M029"
                - "M030"
                - "M031"
                - "M032"
                - "M033"
                - "M034"
                - "M035"
                - "M036"
                - "M037"
                - "M038"
                - "M039"
                - "M040"
                - "M041"
                - "M042"
                - "M043"
                - "M044"
                - "M045"
                - "M046"
                - "M047"
                - "M048"
                - "M049"
                - "M050"
                - "M051"
                - "M052"
                - "M053"
                - "M054"
                - "M055"
                - "M056"
                - "M057"
                - "M058"
                - "M059"
                - "M060"
                - "M061"
                - "M062"
                - "M063"
                - "M064"
                - "M065"
                - "M066"
                - "M067"
                - "M068"
                - "M069"
                - "M070"
                - "M071"
                - "M072"
                - "M073"
                - "M074"
                - "M075"
                - "M076"
                - "M077"
                - "M078"
                - "M079"
                - "M080"
                - "M081"
                - "M082"
                - "M083"
                - "M084"
                - "M085"
                - "M086"
                - "M087"
                - "M088"
                - "M089"
                - "M090"
                - "M091"
                - "M092"
                - "M093"
                - "M094"
                - "M095"
                - "M096"
                - "M097"
                - "M098"
                - "M099"
                - "M100"
                - "M101"
                - "M102"
                - "M103"
                - "M104"
                - "M105"
                - "M106"
                - "M107"
                - "M108"
                - "M109"
                - "M110"
                - "M111"
                - "M112"
                - "M113"
                - "M114"
                - "M115"
                - "M116"
                - "M117"
                - "M118"
                - "M119"
                - "M120"
                - "M121"
                - "M122"
                - "M123"
                - "M124"
                - "M125"
                - "M126"
                - "M129"
                - "M130"
                - "M131"
                - "M132"
                - "M133"
                - "M134"
                - "M135"
                - "M136"
                - "M137"
                - "M218"
                - "MEMO"
                - "MINC"
                - "MIND"
                - "MISC"
                - "MISCL"
                - "MISP"
                - "MOP"
                - "NAJA"
                - "NCA"
                - "NCAG"
                - "NCAP"
                - "NCNP"
                - "NCON"
                - "NCP"
                - "NCTP"
                - "NDC"
                - "NFAR"
                - "NIFL"
                - "NINF"
                - "NIS"
                - "NITM"
                - "NJAR"
                - "NNOB"
                - "NOA"
                - "NOB"
                - "NOC"
                - "NODC"
                - "NOEI"
                - "NOEP"
                - "NOI"
                - "NOST"
                - "NOT"
                - "NOTW"
                - "NOU"
                - "NPB"
                - "NPJR"
                - "NRJD"
                - "NRJR"
                - "NSA"
                - "NSTE"
                - "NTA"
                - "NTD"
                - "NTN"
                - "O"
                - "OAD"
                - "OAJ"
                - "OAL"
                - "OAP"
                - "OAPF"
                - "OAR"
                - "OAS"
                - "OASL"
                - "OAW"
                - "OAX"
                - "OBJ"
                - "OBJE"
                - "OBJN"
                - "OCA"
                - "OD"
                - "ODD"
                - "ODJ"
                - "ODL"
                - "ODP"
                - "ODR"
                - "ODS"
                - "ODSL"
                - "ODW"
                - "ODX"
                - "OF"
                - "OFAB"
                - "OFFX"
                - "OFWD"
                - "OFX"
                - "OIP"
                - "OJR"
                - "OODS"
                - "OP"
                - "OPFX"
                - "OPPO"
                - "OPX"
                - "ORAP"
                - "OROP"
                - "OSC"
                - "OSCP"
                - "OST"
                - "OSUB"
                - "P"
                - "PARD"
                - "PHM"
                - "PMT"
                - "PSDE"
                - "PTE"
                - "PTFR"
                - "PTRL"
                - "RAT"
                - "RATF"
                - "RCOM"
                - "REDC"
                - "REPL"
                - "REQ"
                - "REQA"
                - "RESP"
                - "RFPC"
                - "RJN"
                - "RLRI"
                - "RM"
                - "ROA"
                - "RPT"
                - "RQT"
                - "RSP"
                - "RTP"
                - "RTRA"
                - "S212"
                - "SADM"
                - "SAMB"
                - "SATL"
                - "SDEC"
                - "SEAB"
                - "SEOB"
                - "SERB"
                - "SESB"
                - "SIAB"
                - "SIAM"
                - "SIMB"
                - "SIML"
                - "SIOB"
                - "SIOM"
                - "SIRB"
                - "SISB"
                - "SOC"
                - "SOMB"
                - "SOP"
                - "SORI"
                - "SPAR"
                - "SPD"
                - "SPML"
                - "SPMT"
                - "SPOS"
                - "SPTN"
                - "SPTO"
                - "SRMB"
                - "SSB"
                - "SSRB"
                - "SSRM"
                - "SSTP"
                - "STAR"
                - "STAT"
                - "STBB"
                - "STIN"
                - "STIP"
                - "STP"
                - "STPD"
                - "STS"
                - "STST"
                - "SUPM"
                - "SURP"
                - "TCOP"
                - "TE"
                - "TRAN"
                - "TRL"
                - "USCA"
                - "USDL"
                - "WRIT"
            filedBy: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - ""
                - null
            filingDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                presence: "required"
                description: "Date that this Document was filed."
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            index: 
              type: "number"
              flags: 
                presence: "optional"
                description: "Index of this item in the Docket Record list."
              rules: 
                - 
                  name: "integer"
            isFileAttached: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Has an associated PDF in S3."
            isLegacyServed: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates whether or not the legacy document was served prior to being migrated to the new system."
            isMinuteEntry: 
              type: "boolean"
              flags: 
                presence: "optional"
            isPaper: 
              type: "boolean"
              flags: 
                presence: "optional"
            isSealed: 
              type: "boolean"
              flags: 
                presence: "required"
              invalid: 
                - true
            isStricken: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates the item has been removed from the docket record."
            lodged: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "A lodged document is awaiting action by the judge to enact or refuse."
            numberOfPages: 
              type: "number"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "integer"
              allow: 
                - null
            objections: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "Yes"
                - "No"
                - "Unknown"
            processingStatus: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            receivedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                presence: "required"
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            servedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                presence: "optional"
              rules: 
                - 
                  name: "max"
                  args: 
                    date: "now"
            servedPartiesCode: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
                description: "Served parties code to override system-computed code."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "B"
                - "P"
                - "R"
                - null
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
        - "X"
        - "R"
        - "D"
        - "L"
        - "P"
        - "S"
        - "SL"
        - "W"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Auto-generated from docket number and the suffix."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
    hasIrsPractitioner: 
      type: "boolean"
      flags: 
        presence: "required"
    isPaper: 
      type: "boolean"
      flags: 
        presence: "optional"
    isSealed: 
      type: "boolean"
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Party type of the case petitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - "Conservator"
        - "Corporation"
        - "Custodian"
        - "Donor"
        - "Estate with an executor/personal representative/fiduciary/etc."
        - "Estate without an executor/personal representative/fiduciary/etc."
        - "Guardian"
        - "Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)"
        - "Next friend for a minor (without a guardian, conservator, or other like fiduciary)"
        - "Partnership (as the Tax Matters Partner)"
        - "Partnership (as a partnership representative under the BBA regime)"
        - "Partnership (as a partner other than Tax Matters Partner)"
        - "Petitioner"
        - "Petitioner & deceased spouse"
        - "Petitioner & spouse"
        - "Surviving spouse"
        - "Transferee"
        - "Trust"
    petitioners: 
      type: "array"
      flags: 
        presence: "required"
      items: 
        - 
          type: "object"
          keys: 
            contactType: 
              type: "string"
              flags: 
                only: true
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - "primary"
                - "secondary"
                - "otherFilers"
                - "otherPetitioners"
            name: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            state: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
        presence: "optional"

 ```
