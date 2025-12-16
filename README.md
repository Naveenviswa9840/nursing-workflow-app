🏥 Nursing Workflow Management Application
📌 Overview

- The Nursing Workflow Management Application is a full-stack healthcare support system designed to streamline nursing operations in a hospital environment.
- It enables nurses and doctors to manage patients, record vitals, track investigations, attach documents, and maintain clinical notes, with built-in alerts for critical patient conditions.

- This project was developed as part of a Full Stack Developer Case Study, focusing on clean architecture, real-world workflows, and scalability.

🎯 Key Objectives

- Reduce manual paperwork in nursing workflows

- Provide real-time visibility of patient vitals

- Highlight critical patients automatically

- Secure authentication using OTP & JWT

- Modular and scalable system design

🧩 Core Features
🔐 Authentication Module

- Mobile number login (Indian format +91)

- OTP-based authentication

- OTP validity: 5 minutes

- Max OTP attempts: 3

- JWT-based authentication (24-hour expiry)

- Secure token storage (AsyncStorage / SecureStore)

👩‍⚕️ Patient Management

- Add & view patients

- Basic demographic details

- Patient overview screen

❤️ Vitals Management

Record vitals:

- Blood Pressure (Sys / Dia)

- Temperature

- SpO₂

- Pulse Rate

- Respiratory Rate

- Weight

- Automatic critical condition detection

- Visual highlighting of critical patients

- Vitals history screen (chronological)

📄 Documents Module

- Upload patient documents (reports, images)

- View & download documents

- Server-side file storage

- Metadata stored in database

🧪 Investigations Module

- Add investigations/tests

 Track status:

- PENDING

- COMPLETED

Mark investigations as completed

📝 Notes Module

- Add nursing/doctor notes

- Chronological display

- Author identification

🚨 Critical Patient Detection Logic

A patient is marked CRITICAL if any of the following conditions are met:

Vital	Critical Threshold
- Systolic BP	< 90 or > 180
- Diastolic BP	< 60 or > 120
- Temperature	< 35°C or > 38°C
- SpO₂	< 92%
- Pulse Rate	< 50 or > 120
- Respiratory Rate	< 12 or > 25

Critical patients are:

- Highlighted in red

- Flagged in patient list

- Shown with warning indicators