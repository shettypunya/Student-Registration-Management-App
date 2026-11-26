# CampusDesk – Student Registration & Management App

A responsive React.js application created for a student registration and management project.

## Features

- Register new students
- Display student records
- Search by student name, email, phone number or course
- Filter students by course
- Edit existing student details
- Delete student records with confirmation
- Form validation for required fields, email, unique email and 10-digit phone number
- Responsive desktop and mobile layout
- Save records in browser `localStorage`
- Export student records as a CSV file

## Technology used

- React.js
- JavaScript (ES6)
- HTML5
- CSS3
- Vite
- Lucide React icons

## Requirements

Install Node.js (LTS version) on your computer.

## Run the project in VS Code

1. Extract the ZIP file.
2. Open the `student-management-app` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Create a production build

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Data storage note

This learning version uses browser localStorage. Records remain saved in the same browser on the same device. It does not use a server or shared database.

## Suggested GitHub repository name

`student-registration-management-app`

## Suggested project description

A responsive Student Registration and Management Application built with React.js. It allows users to register students, view records, search and filter student information, edit and delete records, validate form inputs, and export student data as CSV.
