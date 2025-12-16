    Nursing Workflow Application
1. OTP-Based Authentication Algorithm
Objective

To authenticate users securely using a mobile number and One-Time Password (OTP) with time-bound validity, limited attempts, and JWT-based session management.

Algorithm Overview

Authentication is implemented in two phases:

OTP Generation & Delivery

OTP Verification & JWT Token Issuance

This ensures only verified healthcare staff can access the system.

Pseudocode – Send OTP
INPUT: mobile_number

IF mobile_number is not a valid Indian number (10 digits starting 6–9)
    RETURN error "Invalid mobile number"
END IF

GENERATE random 6-digit OTP
SET otp_expiry = current_time + 5 minutes
SET attempt_count = 0

STORE {otp, otp_expiry, attempt_count} against mobile_number

SEND OTP to mobile number via backend service

RETURN success response

Pseudocode – Verify OTP
INPUT: mobile_number, entered_otp

FETCH stored_otp_data for mobile_number

IF no OTP exists
    RETURN error "OTP not requested"
END IF

IF current_time > otp_expiry
    DELETE stored OTP
    RETURN error "OTP expired"
END IF

IF attempt_count >= 3
    DELETE stored OTP
    RETURN error "Maximum attempts exceeded"
END IF

IF entered_otp != stored_otp
    INCREMENT attempt_count
    RETURN error "Invalid OTP"
END IF

GENERATE JWT token (expiry = 24 hours)
DELETE stored OTP

RETURN JWT token

Actual Implementation Notes

OTP validity: 5 minutes

Max attempts: 3

JWT expiry: 24 hours

JWT contains user ID and role (NURSE / DOCTOR)

JWT attached to every API request via Axios interceptor

Why This Algorithm?

Prevents brute-force attacks

Prevents OTP reuse

Secure, stateless authentication

Scales easily across devices

2. JWT Authorization Algorithm
Objective

To protect all sensitive APIs using token-based authorization.

Pseudocode
ON successful login
    ISSUE JWT token
END

FOR every protected API request
    READ Authorization header
    VERIFY JWT signature and expiry
    IF valid
        ALLOW request
    ELSE
        RETURN 401 Unauthorized
END

Actual Implementation

JWT stored securely in local storage

Axios interceptor injects token automatically

NestJS JWT Guard validates token for every request

Benefits

Stateless authentication

Faster API access

Easy role-based access control

3. Patient Creation Algorithm
Objective

To register new patients with validation and proper data normalization.

Pseudocode
INPUT: name, age, gender, mobile, address

IF name is empty
    RETURN error
END IF

IF mobile exists AND not 10 digits
    RETURN error
END IF

STORE patient data in database

RETURN created patient

Implementation Highlights

Mandatory name field

Optional mobile and address

Gender enforced as enum

Data validated at backend

4. Vitals Recording Algorithm
Objective

To record patient vitals and automatically detect critical conditions.

Critical Thresholds
Vital	Critical Condition
Temperature	> 38 °C
SpO₂	< 90%
Pulse Rate	> 120 bpm
Systolic BP	< 90 or > 180
Pseudocode
INPUT: vitals data

SET isCritical = false

IF temperature > 38
    isCritical = true
END IF

IF spo2 < 90
    isCritical = true
END IF

IF pulseRate > 120
    isCritical = true
END IF

IF bloodPressureSys < 90 OR bloodPressureSys > 180
    isCritical = true
END IF

STORE vitals with isCritical flag

Actual Implementation

Executed in backend service

isCritical stored in database

Frontend highlights critical patients

Toast warning shown on patient open

Benefits

Automatic emergency detection

Faster clinical response

Reduced human error

5. Vitals History Retrieval Algorithm
Objective

To retrieve chronological vitals history for patient monitoring.

Pseudocode
INPUT: patient_id

FETCH all vitals ordered by recordedAt DESC

RETURN vitals list

Implementation

Backend returns sorted vitals

Frontend displays history cards

Critical vitals highlighted in red

6. Notes Management Algorithm
Objective

To allow healthcare staff to record patient observations.

Pseudocode – Add Note
INPUT: patient_id, note_content

IF note_content is empty
    RETURN error
END IF

STORE note with staff_id and timestamp

RETURN success

Implementation

Notes linked to staff

Displayed with author name

Chronological ordering

7. Investigations Workflow Algorithm
Objective

To track diagnostic tests and their completion status.

Pseudocode
INPUT: patient_id, test_name, comments

CREATE investigation with status = PENDING

WHEN marked completed
    UPDATE status = COMPLETED

Implementation

Status-based UI

Completed tests highlighted

Backend controlled status updates

8. Document Upload & Retrieval Algorithm
Objective

To securely manage patient documents.

Pseudocode – Upload
INPUT: patient_id, file

IF file missing
    RETURN error
END IF

GENERATE unique filename
STORE file in uploads directory

SAVE metadata:
    patient_id
    original_filename
    file_path
    file_type

RETURN success

Pseudocode – View / Download
INPUT: document_id

FETCH document metadata

IF not found
    RETURN error
END IF

STREAM file to client

Implementation

Multer handles file uploads

Metadata stored in database

Secure view/download endpoint

9. Logout Algorithm
Objective

To securely terminate user sessions.

Pseudocode
ON logout
    DELETE stored JWT token
    REDIRECT to login screen

Implementation

Token removed from storage

User redirected immediately

Protected routes inaccessible