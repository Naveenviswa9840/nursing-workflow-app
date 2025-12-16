## System Architecture

The system follows a client-server architecture.

Frontend:
- Built using React Native with Expo Router
- Handles UI, navigation, and API interactions
- Stores JWT securely on login

Backend:
- Built using NestJS
- Handles authentication, business logic, and validations
- Prisma ORM communicates with PostgreSQL database

Authentication Flow:
1. User enters mobile number
2. OTP generated and stored with expiry
3. OTP verification generates JWT
4. JWT used for protected API calls
