# YABATECH Student Screening and Clearance System — Front-end Prototype

A React + JavaScript + Vite demonstration prototype inspired by YABATECH's green-and-yellow institutional colours.

## Run the project

1. Install Node.js (LTS) if it is not already installed.
2. Extract this ZIP file.
3. Open the extracted `yabatech-clearance-system` folder in VS Code.
4. Open **Terminal → New Terminal** and run:

```bash
npm install
npm run dev
```

5. Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

## Demo accounts

**Student**
- Matriculation number: `YCT/23/1234`
- Password: `Student@123`

**Admin**
- Username: `admin`
- Password: `Admin@123`

These are invented demonstration credentials only.

## Included features

- Responsive landing page
- Demo student/admin sign-in and sign-out
- Student dashboard
- Bio-data form
- Seven-document submission interface
- Fee-verification demo status
- Screening status and reviewer feedback
- Admin student list, review, approve/reject workflow
- Printable clearance slip
- Browser localStorage persistence for demo data

## Important limitations

This is a front-end-only academic prototype. Demo credentials are stored in client-side code and are not secure. Data is stored in the browser and can be changed by the user. File uploads save file names and metadata only; the actual files are not uploaded to a server. Fee verification is simulated. Do not enter real student records or sensitive documents.

For production use, implement a backend, database, secure authentication and role-based authorisation, server-side file validation/storage, audit logs, and an authorised fee-verification integration. The YABATECH branding mark in this prototype is a text placeholder, not the official logo.
