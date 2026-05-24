# Security Specification: Ironcrest Global Recruitment Portal

This specification defines the access control, data validation, and security invariants for the persistent storage of candidate registration records.

## 1. Data Invariants
- Each candidate record MUST contain a valid alphanumeric identifier matching the document path variable `{registrationId}`.
- Field `status` is restricted to an enumerated list: `Draft`, `Pending Approval`, `Approved`, `Rejected`.
- Sensitive documents and personal details (DOB, address, passport) are stored as encrypted string payloads in the database.
- Direct query listings are blocked on the client side to prevent bulk data collection scraping.

## 2. The Dirty Dozen Payloads
Below are 12 malicious or malformed payloads designed to evaluate the strength and boundaries of the database schema and security rules:

1. **Malicious ID injection**: Attempting to create a record with an invalid ID like `../relative/path` or excessively long ID to cause path traversal.
2. **Field pollution**: Attempting to insert unapproved keys (e.g., `role: "admin"` or `isVerified: true`) during registration creation.
3. **Invalid Email injection**: Setting a non-string or 10MB string value into the email contact field.
4. **Invalid status value**: Submitting status as `ExecutiveOwner` instead of `Draft`/`Pending Approval`.
5. **Unauthorized Status escalation**: Standard client attempting to self-approve a profile status.
6. **Malicious summary size**: Submitting a 10MB candidate professional summary to consume database storage.
7. **Identity spoofing**: Setting the candidate ID field to a different value than the document path ID.
8. **Bypassing validation**: Creating a registration with missing mandatory nested maps like `personal` or `contact`.
9. **Tampering with audit logs**: Modifying `submittedAt` on draft files post-creation.
10. **Type mismatch**: Submitting `isCompleted` as a string `"true"` instead of a boolean.
11. **Direct collection scraping**: Requesting a query list of all registrations without providing an authentication scope.
12. **PII leakage attempt**: A third-party client attempting to read another candidate's private address details directly from a listing.

## 3. Test Cases (Security Rules Verification Audit)
All rules are modeled in `firestore.rules` and assert that:
- Path variable `{registrationId}` matches `isValidId()` regex.
- Non-admin listing requests return `PERMISSION_DENIED`.
- Payload schema properties conform strictly to expected types.
