CapitalMatch Automated MCA Brokerage Platform
System Documentation for Admin Portal Development
Last Updated: April 2026


1. SYSTEM ARCHITECTURE OVERVIEW

CapitalMatch is a fully automated Merchant Cash Advance (MCA) brokerage platform. It receives merchant funding applications, scores them, matches them to lenders, submits deals, parses lender responses, and manages the full lifecycle through funding.


1.1 Services and Their Roles

Service              | Technology               | Location           | Purpose
---------------------|--------------------------|--------------------|---------
Website              | Next.js 14, TypeScript    | Vercel             | Public-facing application form, file upload
Database             | Supabase (PostgreSQL)     | Supabase Cloud     | Central data store, Storage buckets, service role auth
Pipeline Runner      | TypeScript (tsx)          | Mac Mini (cron)    | Runs every 5 min: polls Gmail, advances pipeline stages
Gmail API            | OAuth2                    | Google Cloud       | Send/receive lender submissions, merchant confirmations
Telegram Bot API     | 3 separate bots           | Telegram           | Operator alerts across 3 channels
Google Sheets API    | OAuth2                    | Google Workspace   | Deal tracker spreadsheet sync
Google Drive API     | OAuth2                    | Google Workspace   | Organized deal folder storage
Anthropic Claude API | claude-haiku-4-5          | Anthropic          | Bank statement analysis, underwriting summaries, offer parsing, industry classification
Resend               | REST API                  | Resend.com         | Internal notification email on new web submissions


1.2 How They Connect

                 +-------------------+
                 |   Merchant/ISO    |
                 |   (Web Browser)   |
                 +--------+----------+
                          |
                 POST /api/submit
                 POST /api/upload-statement
                          |
                 +--------v----------+
                 |   Next.js on      |
                 |   Vercel           |
                 +--------+----------+
                          |
              Writes to Supabase (applications, documents, storage)
              Sends email via Resend to subs@
                          |
                 +--------v----------+
                 |   Supabase        |
                 |   (PostgreSQL +   |
                 |    Storage)       |
                 +--------+----------+
                          |
          Polled every 5 min by pipeline runner
                          |
                 +--------v----------+
                 |   Pipeline Runner |
                 |   (Mac Mini cron) |
                 +--------+----------+
                    |     |     |
        +-----------+     |     +------------+
        |                 |                  |
   Gmail API        Claude API         Telegram Bots
   (send/poll)      (AI analysis)      (alerts)
        |                                    |
   Google Drive                        Google Sheets
   (file storage)                      (deal tracker)


2. DATABASE SCHEMA

All tables are in the Supabase PostgreSQL database. The following is reconstructed from the codebase -- every column referenced in any INSERT, UPDATE, or SELECT across all source files.


2.1 Table: applications (Primary Deal Table)

Column                        | Type              | Notes
------------------------------|-------------------|------
deal_id                       | text (PK)         | Format: "BUSINESS-NAME-{timestamp}" or "BizOwnerLastName-{timestamp}" for manual
status                        | text              | See Section 9 for all values
created_at                    | timestamptz       | Auto-set on insert
business_name                 | text              |
dba                           | text              | nullable
business_address              | text              | "street, city, ST zip"
business_phone                | text              |
ein                           | text              | "XX-XXXXXXX" format
date_started                  | text              | ISO date string
entity_type                   | text              | LLC, Corp, Sole Prop, etc.
business_email                | text              |
business_description          | text              |
monthly_revenue_range         | text              | Dropdown range: "Under $10,000" ... "$250,000 or more"
requested_amount_range        | text              | Dropdown range: "$5,000 - $15,000" ... "$300,000 or more"
use_of_funds                  | text              | Dropdown
owner_name                    | text              |
owner_cell_phone              | text              |
owner_title                   | text              |
ownership_pct                 | integer           |
home_address                  | text              | "street, city, ST zip"
ssn_full                      | text              | "XXX-XX-XXXX" -- NEVER sent to lenders
ssn_last4                     | text              | Last 4 digits only
dob                           | text              |
fico_range                    | text              | "Below 500", "500-579", etc.
open_positions                | text              | "No existing advances - 1st position", etc.
mca_balance                   | text              |
submitted_by                  | text              | "CMF Website", "broker", "iso", "operator"
manual_submission             | boolean           | true if submitted via email (not website)
broker_id                     | uuid              | FK to brokers.id, nullable
broker_code                   | text              | Referral code used
broker_name                   | text              |
broker_gmail_thread_id        | text              | Gmail thread for broker updates
iso_id                        | uuid              | FK to isos.id, nullable
iso_email                     | text              |
iso_name                      | text              |
iso_gmail_thread_id           | text              | Gmail thread for ISO updates
merchant_gmail_thread_id      | text              | Gmail thread for merchant communication
second_owner_name             | text              | nullable
second_owner_title            | text              |
second_owner_pct              | integer           |
second_owner_address          | text              |
second_owner_ssn_full         | text              |
second_owner_ssn_last4        | text              |
second_owner_dob              | text              |
second_owner_fico             | text              |
signature_timestamp           | timestamptz       |
ip_address                    | text              |
deal_score                    | integer           | 0-100, computed by underwriting
risk_tier                     | text              | A, B, C, or D
flags                         | text[]            | Array of flag strings
deal_summary                  | text              | 3-sentence AI-generated summary
bs_analyzed                   | boolean           | true after bank statement AI analysis
bs_avg_monthly_deposits       | numeric           |
bs_negative_days              | integer           |
bs_detected_positions         | integer           |
bs_balance_trend              | text              | "growing", "stable", "declining", "unknown"
bs_flags                      | text[]            | Array of bank statement flag strings
bs_analysis_summary           | text              |
google_drive_folder_id        | text              |
google_drive_folder_url       | text              |
new_deal_alert_sent           | boolean           | Prevents duplicate Telegram alerts
priority_window_expires_at    | timestamptz       | When priority lender window ends


2.2 Table: documents

Column     | Type         | Notes
-----------|--------------|------
id         | uuid (PK)    | Auto-generated
deal_id    | text (FK)    | References applications.deal_id
type       | text         | "bank_statement", "month_to_date", "merchant_doc"
file_name  | text         |
file_path  | text         | Path within the Supabase storage bucket
file_url   | text         | Signed URL (temporary)
bucket     | text         | "bank-statements", "applications", "merchant-docs"


2.3 Table: lenders

Column                      | Type       | Notes
----------------------------|------------|------
id                          | uuid (PK)  |
name                        | text       |
submission_email            | text       | Where deal packages are sent
cc_emails                   | text       | CC addresses for submissions
active                      | boolean    | Only active lenders are matched
min_fico                    | integer    | nullable -- hard stop if 30+ below
min_monthly_revenue         | integer    | nullable -- hard stop if deposits < min * 0.6
max_advance                 | integer    | nullable
excluded_industries         | text[]     | Array of excluded industry names
funded_states               | text[]     | nullable -- null means all states
factor_rate_min             | numeric    |
factor_rate_max             | numeric    |
funding_speed_hours         | integer    |
iso_agreement_on_file       | boolean    | MUST be true to submit deals
notes                       | text       |
max_negative_days           | integer    | nullable
max_positions               | integer    | nullable
min_time_in_business_months | integer    | nullable
max_term_days               | integer    | nullable
priority                    | boolean    | Gets exclusive first-look window
priority_window_minutes     | integer    | Duration of exclusive window (default 30)


2.4 Table: deal_matches

Column       | Type       | Notes
-------------|------------|------
id           | uuid (PK)  | Auto-generated
deal_id      | text (FK)  | References applications.deal_id
lender_id    | uuid (FK)  | References lenders.id
match_score  | integer    | 0-100 match quality
match_reason | text       |
shortfalls   | text       | Comma-separated warnings


2.5 Table: deal_submissions

Column                          | Type         | Notes
--------------------------------|--------------|------
id                              | uuid (PK)    |
deal_id                         | text (FK)    | References applications.deal_id
lender_id                       | uuid (FK)    | References lenders.id
lender_name                     | text         |
gmail_thread_id                 | text         | Used to match inbound lender replies
submitted_at                    | timestamptz  |
lender_response                 | text         | "declined" or JSON for pending large deals
offer_received_at               | timestamptz  |
offer_amount                    | numeric      |
offer_term_days                 | integer      |
lender_buy_rate                 | numeric      |
our_sell_rate                   | numeric      |
merchant_daily_payment          | numeric      |
payment_frequency               | text         | "daily" or "weekly"
offer_number_shown_to_merchant  | integer      |
funded                          | boolean      |
funded_at                       | timestamptz  |
commission_amount               | numeric      |
created_at                      | timestamptz  |


2.6 Table: offers

Column            | Type         | Notes
------------------|--------------|------
id                | uuid (PK)    |
deal_id           | text (FK)    | References applications.deal_id
lender_id         | uuid (FK)    | References lenders.id, nullable
offer_number      | integer      | Sequential per deal (1, 2, 3...)
approved_amount   | numeric      |
term_days         | integer      |
lender_buy_rate   | numeric      | The factor rate from the lender (buy rate)
our_sell_rate     | numeric      | The rate shown to the merchant (sell rate)
daily_payment     | numeric      | Calculated: (approved_amount * sell_rate) / term_days
payment_frequency | text         | "daily" or "weekly"
received_at       | timestamptz  |
selected          | boolean      | Whether merchant chose this offer


2.7 Table: brokers

Column        | Type       | Notes
--------------|------------|------
id            | uuid (PK)  |
name          | text       |
email         | text       | Used for whitelisting and communication
referral_code | text       | Used in website application form
active        | boolean    |


2.8 Table: isos (Independent Sales Organizations)

Column | Type       | Notes
-------|------------|------
id     | uuid (PK)  |
name   | text       |
email  | text       | Used for sender detection and whitelisting
active | boolean    |


2.9 Table: email_log

Column           | Type         | Notes
-----------------|--------------|------
id               | uuid (PK)    |
direction        | text         | "inbound" or "outbound"
from_address     | text         |
to_address       | text         |
subject          | text         |
deal_id          | text         | nullable
gmail_thread_id  | text         | nullable
gmail_message_id | text         | nullable
status           | text         | "sent", "failed", "received_and_routed", "lender_email_received", "merchant_reply_received", "received_no_deal_match", "manual_submission_processed"
created_at       | timestamptz  | Auto


2.10 Table: security_log

Column             | Type         | Notes
-------------------|--------------|------
id                 | uuid (PK)    |
inbox              | text         | "submissions", "lenders", "replies"
sender_email       | text         |
subject            | text         |
threat_type        | text         | "prompt_injection", "format_mismatch", "unknown_sender", "offer_parse_failure"
action_taken       | text         | "quarantined", "operator_approved", "operator_blocked"
operator_notified  | boolean      |
operator_response  | text         | "approved" or "blocked" (set later by operator)
created_at         | timestamptz  | Auto


2.11 Table: error_log

Column        | Type         | Notes
--------------|--------------|------
id            | uuid (PK)    |
source        | text         | e.g., "googleDrive.createDealFolder"
error_message | text         |
stack_trace   | text         | nullable
deal_id       | text         | nullable
created_at    | timestamptz  | Auto


3. PIPELINE FLOW (Step by Step)


3.1 Application Submission (Website Path)

1. Merchant fills out multi-step form on capitalmatchfunding.com
2. Bank statements uploaded individually via POST /api/upload-statement
   - Each file uploaded to Supabase Storage bucket "bank-statements"
   - Returns a signed URL
3. Full application submitted via POST /api/submit
   - Server-side Zod validation of all fields
   - Duplicate EIN check (same EIN within 30 days = rejected)
   - Application row inserted with status = "draft"
   - PDF generated via @react-pdf/renderer, uploaded to "applications" bucket
   - Document rows inserted for bank statements
   - Status flipped: draft -> processing -> submitted
   - Internal notification email sent via Resend to subs@capitalmatchfunding.com
   - Response: { success: true, reference: dealId }

3.2 Application Submission (Email/Manual Path)

1. Operator, ISO, or broker emails subs@capitalmatchfunding.com
   - Subject: "NEW DEAL -- BUSINESS NAME"
   - Attachments: application PDF + bank statements
2. Gmail poller picks it up on next 5-minute cycle
3. Email security check runs (injection scan, format check, sender whitelist)
4. If from a known ISO (checked against isos table): auto-tagged as ISO deal
5. First attachment extracted with Claude Haiku vision (OCR/parsing)
6. Application row inserted with status = "submitted", manual_submission = true
7. Remaining attachments stored as bank statements

3.3 Pipeline Runner (poll-runner.ts)

Runs every 5 minutes via cron on Mac Mini. Execution order:

1. Poll Gmail inboxes (subs@ and lenders@)
2. Process pipeline stages in order:

   Stage 1: INTAKE (status = "submitted")
   - Sends merchant confirmation email via Gmail
   - Stores merchant_gmail_thread_id for future thread replies
   - Checks for bank statements in documents table
   - If 0 statements: status -> "pending_documents", alert operator
   - If 1+ statements: runs AI bank statement analysis, status -> "intake_complete"
   - Creates Google Drive folder (year/month/business hierarchy)
   - Sends new application alert to Telegram (main ops + new deals channel)
   - If broker deal: sends broker confirmation email, stores broker_gmail_thread_id
   - Syncs to Google Sheet

   Stage 2: UNDERWRITING (status = "intake_complete")
   - Scores deal using lookup tables:
     - FICO: 0-30 points
     - Revenue: 0-25 points
     - Time in Business: 0-20 points
     - Position: 0-15 points (based on existing MCA advances)
   - Applies bank statement deductions if analysis exists:
     - Revenue gap (stated vs actual): -5 points
     - Negative balance days > 3: -5 points
     - Hidden positions: -10 points
     - Declining balance: -3 points
   - Total score mapped to risk tier: A (70+), B (50-69), C (30-49), D (0-29)
   - Red flags detected: fico_below_500, high_stacking, new_business, low_revenue, large_gap, bs_revenue_gap, bs_negative_days, bs_hidden_positions, bs_declining_balance
   - Generates 3-sentence deal summary via Claude Haiku (with fallback to template)
   - Status -> "underwriting_complete"

   Stage 3: MATCHING (status = "underwriting_complete")
   - Loads all active lenders from lenders table
   - Classifies business industry via Claude Haiku (single-word response)
   - For each lender, checks HARD BLOCKS:
     - No ISO agreement on file -> skip entirely
     - Industry excluded -> block
     - State not funded -> block
     - Negative days > max * 1.5 -> block
     - Positions > max * 2 -> block
     - Revenue < min * 0.6 -> block
     - FICO gap > 30 points -> block
     - Requested amount > max advance -> block
   - For passing lenders, applies SOFT FLAGS (score deductions):
     - Negative days above max: -10
     - Positions above max: -10
     - Revenue 60-85% of min: -10
     - FICO 1-30 below min: -15
     - Amount near max advance: -5
     - Declining balance: -5
     - Detected > stated positions: flagged
     - NSF fees: -5
   - Uses bank statement data over stated values when available
   - Inserts rows into deal_matches table
   - Sorts by funding_speed_hours (fastest first), then factor_rate_min
   - 0 matches: status -> "needs_manual_match", alert operator
   - 1+ matches: status -> "matching_complete"

   Stage 4: SUBMISSION (status = "matching_complete" or "priority_released")
   - Separates priority lenders from regular lenders
   - If priority lender exists AND status is "matching_complete":
     - Only sends to priority lender first
     - Status -> "priority_window" with expiry timestamp
   - Otherwise sends to ALL matched lenders
   - For each lender:
     - Duplicate guard: checks deal_submissions to prevent re-sends
     - Downloads application PDF from storage
     - Watermarks PDF (diagonal "CAPITALMATCH" + deal ID + "ISO PROTECTED")
     - Downloads and watermarks bank statements
     - Builds email body with business details (contact info OMITTED)
     - Sends via Gmail with all PDFs attached
     - Inserts deal_submissions row with gmail_thread_id
   - Non-priority: status -> "submitted_to_lenders"
   - Syncs to Google Sheet

   Priority Window Check:
   - Checks applications where status = "priority_window"
   - If priority_window_expires_at has passed: calls releaseToRemainingLenders()
   - This sets status to "priority_released" and re-runs submission for remaining lenders


3.4 Lender Response Handling

When a lender replies to a deal submission email:

1. Gmail poller picks up the reply on the next 5-minute cycle
2. Email matched to deal via gmail_thread_id in deal_submissions (or subject-line fallback)
3. Passed to lenderOfferParser.ts:

   OFFER FLOW:
   a. Claude Haiku extracts: approved_amount, term_days/term_weeks, factor_rate
   b. Validation: amount 1-10M, term 1-3650 days, factor rate 1.05-2.00
   c. Sell rate applied from table:
      - Up to $75K: sell rate 1.50
      - $75K-$150K: sell rate 1.45
      - $150K-$250K: sell rate 1.40
      - Above $250K: paused, operator must supply rate
   d. Daily/weekly payment calculated: (approved_amount * sell_rate) / term
   e. Offer inserted into offers table
   f. deal_submissions row updated
   g. Telegram alert to main ops channel + approvals channel
   h. ISO update email sent (if ISO deal) -- buy rate included
   i. Broker update email sent (if broker deal) -- lender email included
   j. Google Sheet updated

   DECLINE FLOW:
   a. If offer extraction fails (no amount/term found)
   b. Claude Haiku checks if email is a decline
   c. If decline: deal_submissions.lender_response = "declined"
   d. Telegram decline alert sent
   e. If this was the priority lender declining: immediately releases to remaining lenders
   f. Broker decline notification sent (if broker deal)

   PARSE FAILURE FLOW:
   a. If neither offer nor decline detected
   b. Logged to security_log as offer_parse_failure
   c. Telegram alert: operator must check lenders@ inbox manually


3.5 Merchant Reply Handling

When a merchant replies to their confirmation email:

1. Matched by business_email or merchant_gmail_thread_id
2. Any attachments saved to "merchant-docs" bucket + documents table
3. Operator alerted via Telegram (no auto-response)
4. All merchant replies are handled manually by the operator


4. SUPABASE STORAGE BUCKETS

Bucket           | Contents                                 | Path Convention
-----------------|------------------------------------------|-----------------
applications     | Application PDFs (generated from form)   | applications/{dealId}.pdf
bank-statements  | Bank statement uploads                   | statements/{timestamp}-{uuid}-{filename} (web uploads) or {dealId}-statement-{n}.pdf (manual)
merchant-docs    | Documents merchants send via email reply  | {dealId}/{filename}


5. EMAIL SYSTEM


5.1 Email Addresses

Address                              | Purpose
-------------------------------------|--------
subs@capitalmatchfunding.com         | Merchant confirmations sent FROM here; new application notifications sent TO here; ISOs/brokers submit deals TO here
lenders@capitalmatchfunding.com      | OAuth account (all Gmail API calls use this); lender replies arrive here
replies@capitalmatchfunding.com      | Reserved for future reply-to routing
noreply@capitalmatchfunding.com      | FROM address on Resend transactional emails


5.2 Gmail OAuth Setup

- All Gmail API operations go through the lenders@ account (userId: 'me')
- subs@ and lenders@ both FORWARD to the lenders@ Gmail account
- Routing is by the To: header in the original message
- Gmail query pattern: "to:{address} is:unread"
- OAuth credentials: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN

5.3 Outbound Emails (via Gmail API)

Email Type              | From                    | To                   | When
------------------------|-------------------------|----------------------|------
Merchant confirmation   | subs@                   | merchant email       | Intake stage
Broker confirmation     | subs@                   | broker email         | Intake stage (broker deals only)
Lender deal submission  | subs@                   | lender submission_email (+ cc_emails) | Submission stage
ISO offer update        | subs@                   | ISO email            | When offer received
Broker offer update     | subs@                   | broker email         | When offer received
Broker decline notice   | subs@                   | broker email         | When lender declines

5.4 Outbound Emails (via Resend)

Email Type              | From                    | To                   | When
------------------------|-------------------------|----------------------|------
Internal new app notice | subs@ or noreply@       | subs@                | Website submission

5.5 Inbound Email Processing

- Polls every 5 minutes for unread messages
- Processes up to 50 messages per inbox per poll
- Marks processed messages as read
- Blocked messages moved to trash

Routing priority:
1. Known safe senders (Google, mailer-daemon) -> silently skip
2. Email security check (injection scan, whitelist, format)
3. Submissions inbox:
   a. "NEW DEAL -- ..." subject -> manual submission workflow
   b. ISO sender with attachments -> manual submission workflow
   c. "NEW APPLICATION -- ..." subject -> log and route to existing deal
4. Lenders inbox:
   a. Thread ID matches deal_submissions -> offer parser
   b. Subject matches "NEW DEAL -- BUSINESS" -> offer parser (fallback)
   c. Sender matches merchant business_email -> merchant reply handler
   d. Thread matches merchant_gmail_thread_id -> merchant reply handler
   e. No match -> logged as received_no_deal_match


6. TELEGRAM CHANNELS


6.1 Channel Configuration

Channel       | Bot Token Env Var                  | Chat ID Env Var               | Chat ID
--------------|------------------------------------|-------------------------------|--------
Main Ops      | TELEGRAM_BOT_TOKEN                 | TELEGRAM_CHAT_ID              | -5296768381
New Deals     | TELEGRAM_NEW_DEALS_BOT_TOKEN       | TELEGRAM_NEW_DEALS_CHAT_ID    | -5282069926
Approvals     | TELEGRAM_APPROVALS_BOT_TOKEN       | TELEGRAM_APPROVALS_CHAT_ID    | -5293959330

Each channel uses its own separate bot token.

6.2 What Goes Where

Main Ops Channel (all operational alerts):
- New application received (business name, owner, revenue, requested amount, Drive link)
- Offer received (all offers listed with amounts, terms, factor rates, merchant contact info)
- Decline received (lender name, preview)
- Missing documents alerts
- Bank statement flags
- Pipeline errors and failures
- Email security quarantine alerts
- Gmail auth revocation warnings
- Manual submission notifications
- Merchant reply notifications (with message preview)
- Priority window alerts
- Weak match warnings
- No match alerts
- Confirmation email failures
- Google Drive failures

New Deals Channel:
- Detailed new deal info: business name, DBA, owner, phone numbers, email, revenue, requested amount, score/tier
- Source tag: ISO (with commission note), Broker, Manual, or CMF Website
- Only fires once per deal (new_deal_alert_sent flag)

Approvals Channel:
- All offers with full detail: business info, owner contact, all offer amounts/terms/rates, lender emails
- Declines also posted here
- ISO/Broker tags included


7. GOOGLE SHEETS INTEGRATION


7.1 Sheet Structure

Sheet Name: "Deals" in spreadsheet titled "CapitalMatch -- Deal Tracker"

Columns (A through Y):
A: Deal ID
B: Date Submitted
C: Business Name
D: Merchant Name
E: Merchant Email
F: Merchant Business Phone
G: Merchant Cell Phone
H: Submitted By
I: ISO Name
J: ISO Email
K: Broker Name
L: Broker Code
M: Monthly Revenue
N: Requested Amount
O: Deal Score
P: Risk Tier
Q: Current Status
R: Funded (YES/NO)
S: Funded By
T: Funded Amount
U: Funded Term (days)
V: Factor Rate
W: Commission Earned
X: Date Funded
Y: Google Drive Folder URL

7.2 When Data Syncs

- On intake completion (new row added)
- On submission to lenders (status update)
- On offer received (status update)
- Daily full sync available via CLI: npx tsx googleSheets.ts sync
- Single deal update: npx tsx googleSheets.ts update {dealId}

7.3 Update Behavior

- New deals: full row appended
- Existing deals: only columns Q-Y (status + funded data) updated
- Lookup is by Deal ID in column A


8. API ENDPOINTS (Website)


8.1 POST /api/submit

Purpose: Submit a complete MCA application
Authentication: None (public form)
Content-Type: application/json

Request Body (validated by Zod):
{
  // Business info
  businessName: string,          // required, max 200
  dba: string,                   // optional, max 200
  businessAddress: string,       // required, max 200
  businessCity: string,          // required, max 100
  businessState: string,         // 2-letter state code
  businessZip: string,           // 5 or 9 digit zip
  businessPhone: string,         // 10-digit phone
  ein: string,                   // XX-XXXXXXX format
  dateStarted: string,           // YYYY-MM-DD
  entityType: string,            // "LLC" | "Sole Proprietorship" | "Partnership" | "Corporation" | "Other"
  businessEmail: string,         // valid email
  businessDescription: string,   // max 2000
  monthlyRevenue: string,        // enum: "Under $10,000" | "$10,000 - $25,000" | "$25,000 - $50,000" | "$50,000 - $100,000" | "$100,000 - $250,000" | "$250,000 or more"
  requestedAmount: string,       // enum: "$5,000 - $15,000" | "$15,000 - $30,000" | "$30,000 - $75,000" | "$75,000 - $150,000" | "$150,000 - $300,000" | "$300,000 or more"
  useOfFunds: string,            // enum: "Inventory or Stock" | "Equipment Purchase" | "Payroll or Staffing" | "Marketing or Advertising" | "Renovations" | "Bridge Financing" | "Working Capital" | "Expansion" | "Other"

  // Owner info
  ownerName: string,             // max 200
  ownerCellPhone: string,        // 10-digit
  ownerTitle: string,            // enum: "Owner" | "CEO" | "President" | "Partner" | "Member" | "Other"
  ownershipPct: string,          // "0"-"100"
  homeAddress: string,
  homeCity: string,
  homeState: string,             // 2-letter
  homeZip: string,
  ssnFull: string,               // XXX-XX-XXXX format
  dob: string,                   // YYYY-MM-DD
  ficoRange: string,             // enum: "Below 500" | "500-579" | "580-619" | "620-679" | "680-719" | "720 or above"

  // Documents
  openPositions: string,         // enum: "No existing advances -- 1st position" | "1 open advance -- 2nd position" | "2 open advances -- 3rd position" | "3 or more open advances"
  mcaBalance: string,            // optional
  bankStatementUrls: string[],   // 1-10 signed URLs from upload-statement
  bankStatementNames: string[],  // matching filenames
  signatureName: string,
  authCheck1: true,              // must be literal true
  authCheck2: true,

  // Optional
  brokerCode: string,            // optional referral code
  hasSecondOwner: boolean,
  secondOwner*: ...,             // conditional fields if hasSecondOwner=true
}

Success Response (200):
{ "success": true, "reference": "BUSINESS-NAME-1713027600000" }

Error Responses:
- 400: Validation error
- 409: Duplicate EIN (same business applied within 30 days)
- 500: Server error


8.2 GET /api/upload-token

Purpose: Get an HMAC-signed token to authorize file uploads
Authentication: None (public)

Response (200):
{ "token": "base64url_payload.base64url_signature" }

Token is valid for 1 hour. Signed with UPLOAD_TOKEN_SECRET (HMAC-SHA256).


8.3 POST /api/upload-statement

Purpose: Upload a bank statement file
Authentication: Upload token (from /api/upload-token)
Content-Type: multipart/form-data
Max Duration: 30 seconds (Vercel serverless)

Form Fields:
- uploadToken: string (required, from /api/upload-token)
- file: File (required)

Constraints:
- Allowed types: PDF, JPG, JPEG, PNG (and application/octet-stream with valid extension for iOS Safari)
- Max size: 10 MB per file
- Files stored in "bank-statements" bucket at: statements/{timestamp}-{uuid}-{sanitized-name}

Success Response (200):
{ "path": "statements/...", "signedUrl": "https://..." }

Error Responses:
- 401: Invalid or expired token
- 400: No file or invalid type
- 500: Upload failed


9. KEY STATUS VALUES

Status                   | Set By          | Meaning                                              | Next Stage
-------------------------|-----------------|------------------------------------------------------|------------------
draft                    | /api/submit     | Row created, PDF being generated                     | processing
processing               | /api/submit     | Documents being linked                               | submitted
submitted                | /api/submit or gmailPoller | Ready for pipeline processing               | intake
pending_documents        | intake.ts       | No bank statements found, needs manual follow-up     | (manual intervention)
intake_complete          | intake.ts       | Confirmation sent, bank statements analyzed           | underwriting
underwriting_complete    | underwriting.ts | Scored, tiered, summarized                           | matching
needs_manual_match       | matching.ts     | 0 lenders matched, operator must intervene            | (manual intervention)
matching_complete        | matching.ts     | 1+ lenders matched, ready to submit                  | submission
priority_window          | submission.ts   | Sent to priority lender, waiting for response         | (timer or response)
priority_released        | submission.ts   | Priority window expired or declined, send to all      | submission (re-run)
submitted_to_lenders     | submission.ts   | Deal packages sent to all matched lenders             | (awaiting responses)
submission_failed        | submission.ts   | Application PDF could not be processed                | (manual intervention)
needs_operator_rate      | offerParser     | Offer > $250K, operator must provide sell rate        | (manual intervention)
follow_up_sent           | (manual)        | Follow-up email sent to lenders                      | (awaiting responses)
docs_requested           | (manual)        | Additional docs requested from merchant               | docs_received
docs_received            | (manual)        | Merchant provided requested docs                     | (processing)
funded_pending           | (manual)        | Deal selected for funding, awaiting close             | funded
funded                   | (manual)        | Deal funded and closed                               | (terminal)
declined                 | (manual)        | All lenders declined or deal cancelled                | (terminal)
failed                   | /api/submit     | PDF upload or critical error during submission        | (terminal)


10. LENDER MATCHING LOGIC


10.1 Data Sources

The matching engine uses TWO data sources, preferring bank statement data over stated (self-reported) values:

- Monthly revenue: uses bs_avg_monthly_deposits if available, otherwise parses monthly_revenue_range
- Position count: uses max(stated, bs_detected_positions)
- Negative days: uses bs_negative_days if available, otherwise 0
- Balance trend: uses bs_balance_trend if available

10.2 Industry Classification

Before matching, the business description is sent to Claude Haiku to classify into one of these categories:
cannabis, adult entertainment, firearms, cryptocurrency, gambling, tobacco, payday lending, debt collection, escort, strip club, pawn shop, car dealership, auto sales, restaurant, retail, construction, trucking, healthcare, medical, dental, salon, spa, gym, fitness, cleaning, landscaping, plumbing, electrical, hvac, roofing, other

10.3 Hard Blocks (lender excluded entirely)

Check                                  | Condition
---------------------------------------|----------
ISO agreement                          | iso_agreement_on_file must be true
Industry exclusion                     | business industry in lender's excluded_industries
State not funded                       | business state not in lender's funded_states (empty = all states OK)
Negative days extreme                  | negative_days > lender max * 1.5
Positions extreme                      | effective_positions > lender max * 2
Revenue far below minimum              | avg_deposits < lender min * 0.6
FICO too far below                     | merchant FICO 30+ points below lender min
Amount above max                       | requested_amount > lender max_advance

10.4 Soft Flags (score deductions, lender still included)

Check                                  | Deduction
---------------------------------------|----------
Negative days above max                | -10
Positions above max                    | -10
Revenue 60-85% of minimum             | -10
FICO 1-30 below minimum               | -15
Amount close to max advance (>90%)     | -5
Declining balance trend                | -5
NSF fees detected                      | -5

10.5 Ranking

Matched lenders are sorted by:
1. Funding speed (hours) ascending -- fastest lenders first
2. Factor rate minimum ascending -- cheapest lenders as tiebreaker

10.6 Priority Lender System

- Lenders with priority=true get an exclusive window (default 30 minutes)
- During priority_window status, only the priority lender has the deal
- If priority lender sends an offer: normal flow (offer parsed, stored)
- If priority lender declines: deal immediately released to all remaining lenders
- If priority window timer expires (checked every 5 min): deal released to all remaining lenders
- Duplicate guard prevents re-sending to the priority lender when releasing to others


11. SECURITY


11.1 Email Security (emailSecurity.ts)

Every inbound email passes through checkEmailSecurity() before any content is processed.

Three-layer defense:

Layer 1 -- Prompt Injection Scan (all emails):
- 40+ regex patterns detecting: override phrases, role hijacking, task injection markers, jailbreak attempts, leakage probes, encoding tricks
- Scans both subject and full body (up to 50,000 characters)
- Match = quarantine + Telegram alert to operator
- Operator can approve (process normally) or block (trash email)

Layer 2 -- Submissions Inbox Format Check:
- Whitelisted operators (ISOs, brokers in database) bypass this check
- Checks for at least 3 of these keywords: "business name", "owner name", "monthly revenue", "requested amount", "deal reference", "new application", "application pdf", "bank statement", "capitalmatch"
- Mismatch = quarantine + Telegram alert

Layer 3 -- Lenders Inbox Whitelist:
- Sender email checked against lenders.submission_email (active=true)
- Also checks if sender is a merchant (business_email in applications table)
- Unknown sender = quarantine + Telegram alert
- Operator can approve (auto-adds sender to lenders table) or block

Known Safe Senders (silently skipped):
- @google.com, @googlemail.com, @googleapis.com
- no-reply, noreply, mailer-daemon, postmaster

11.2 Security Log

All security events written to security_log table with:
- Inbox, sender, subject, threat type, action taken, whether operator was notified
- Persistent block detection: if same sender blocked 3+ times, flagged as persistent spam

11.3 Upload Security

- HMAC-SHA256 signed tokens with 1-hour TTL
- Server-side file type validation (not just client accept= attribute)
- Handles iOS Safari octet-stream edge case
- 10 MB per-file limit
- Files stored with randomized paths (UUID + timestamp)

11.4 Application Security

- Duplicate EIN check (30-day window) prevents repeat submissions
- SSN is stored but NEVER sent to any lender
- Merchant contact info (phone, email) OMITTED from lender submission emails
- Contact details only provided to lenders upon accepted offer
- All PDFs watermarked with "CAPITALMATCH / ISO PROTECTED" + deal ID
- IP address logged on submission

11.5 Supabase Configuration

- Two client types:
  - Anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY): used client-side for storage uploads
  - Service role key (SUPABASE_SERVICE_ROLE_KEY): used server-side for all DB operations
- Service role bypasses Row Level Security (RLS)
- The admin portal should use service role for read access to all tables


12. GOOGLE DRIVE STRUCTURE

Folder hierarchy created per deal:

CapitalMatch Deals/
  2026/
    April/
      BusinessName - DEAL-ID-1713027600000/
        Application - DEAL-ID-1713027600000.pdf
        BankStatement-1.pdf
        BankStatement-2.pdf
        ...

- google_drive_folder_id and google_drive_folder_url saved to applications table
- Drive failures are non-blocking: pipeline continues, error logged, Telegram alert sent
- Uses separate GOOGLE_DRIVE_REFRESH_TOKEN with drive.file scope


13. SELL RATE TABLE

Approved Amount Range     | Sell Rate to Merchant | Action
--------------------------|-----------------------|-------
$0 - $75,000              | 1.50                  | Auto-calculated
$75,001 - $150,000        | 1.45                  | Auto-calculated
$150,001 - $250,000       | 1.40                  | Auto-calculated
Above $250,000            | N/A                   | Pipeline pauses, operator provides rate

Payment calculation:
- Total payback = approved_amount * sell_rate
- Daily payment = total_payback / term_days
- Weekly payment = total_payback / term_weeks
- Rounded to nearest whole dollar
- Merchant NEVER sees the factor/buy rate or total payback amount


14. KEY ENVIRONMENT VARIABLES REFERENCE

Variable                          | Service        | Purpose
----------------------------------|----------------|--------
SUPABASE_URL                      | Supabase       | Database connection
SUPABASE_SERVICE_KEY              | Supabase       | Service role access (bypasses RLS)
NEXT_PUBLIC_SUPABASE_URL          | Supabase       | Client-side database URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     | Supabase       | Client-side anon key
SUPABASE_SERVICE_ROLE_KEY         | Supabase       | Server-side service role key
ANTHROPIC_API_KEY                 | Anthropic      | Claude AI calls
GMAIL_CLIENT_ID                   | Google         | OAuth2 for Gmail + Drive + Sheets
GMAIL_CLIENT_SECRET               | Google         | OAuth2
GMAIL_REFRESH_TOKEN               | Google         | Gmail API access
GOOGLE_DRIVE_REFRESH_TOKEN        | Google         | Drive API (separate token, drive.file scope)
GOOGLE_SHEETS_REFRESH_TOKEN       | Google         | Sheets API
GOOGLE_SHEETS_ID                  | Google         | Target spreadsheet ID
GOOGLE_DRIVE_PARENT_FOLDER_ID     | Google         | Root "CapitalMatch Deals" folder ID
TELEGRAM_BOT_TOKEN                | Telegram       | Main ops bot
TELEGRAM_CHAT_ID                  | Telegram       | Main ops channel
TELEGRAM_NEW_DEALS_BOT_TOKEN      | Telegram       | New deals bot
TELEGRAM_NEW_DEALS_CHAT_ID        | Telegram       | New deals channel
TELEGRAM_APPROVALS_BOT_TOKEN      | Telegram       | Approvals bot
TELEGRAM_APPROVALS_CHAT_ID        | Telegram       | Approvals channel
SUBMISSIONS_EMAIL                 | App config     | subs@capitalmatchfunding.com
LENDERS_EMAIL                     | App config     | lenders@capitalmatchfunding.com
REPLIES_EMAIL                     | App config     | replies@capitalmatchfunding.com
NOREPLY_EMAIL                     | App config     | noreply@capitalmatchfunding.com
RESEND_API_KEY                    | Resend         | Transactional email sending
UPLOAD_TOKEN_SECRET               | App config     | HMAC secret for upload tokens


15. ADMIN PORTAL CONSIDERATIONS

Based on the existing system, an admin portal would need read/write access to:

Tables the portal should READ:
- applications (all deal data, statuses, scores)
- documents (uploaded files per deal)
- lenders (lender directory with criteria)
- deal_matches (which lenders matched which deals)
- deal_submissions (submission status, lender responses)
- offers (parsed offers with amounts, terms, rates)
- brokers (broker directory)
- isos (ISO directory)
- email_log (communication audit trail)
- security_log (security events)
- error_log (system errors)

Tables the portal should WRITE:
- applications (status transitions for manual stages: follow_up_sent, docs_requested, docs_received, funded_pending, funded, declined)
- lenders (add/edit lender criteria, toggle active)
- brokers (add/edit brokers)
- isos (add/edit ISOs)
- offers (mark offer as selected)
- deal_submissions (mark as funded, set commission)

Storage buckets the portal should READ:
- applications (view/download application PDFs)
- bank-statements (view/download bank statements)
- merchant-docs (view/download merchant-submitted docs)

Key workflows for the admin portal:
1. Deal dashboard: view all applications with status, score, tier, offers
2. Deal detail: view full application data, documents, matches, submissions, offers
3. Status management: advance deals through manual stages
4. Lender management: CRUD for lenders with matching criteria
5. Broker/ISO management: CRUD for referral partners
6. Offer management: view parsed offers, manually enter offers for parse failures
7. Email log viewer: audit trail of all sent/received emails
8. Security log viewer: review quarantined emails, approve/block
9. Error log viewer: monitor system health
10. Google Sheet link: direct link to deal tracker
