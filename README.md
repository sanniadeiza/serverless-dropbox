# Serverless Dropbox Clone

A fully hosted serverless file synchronization application built with ReactJS, Vite, and AWS Amplify (Gen 2).

## Features
- **User Authentication:** Secure sign-up, sign-in, and password management powered by Amazon Cognito.
- **File Upload:** Upload files to your personal, isolated cloud storage (Amazon S3).
- **Versioning:** Files are tracked with their last modified timestamp to manage versions. (Note: S3 Bucket Versioning can be fully utilized via AWS console).
- **DNS/Routing:** Hosted in the cloud using AWS Amplify Console.
- **Premium Design:** Clean, modern, and responsive user interface.

## Architecture
This project uses AWS Amplify Gen 2, which provides a code-first approach to fullstack development.
- **Frontend:** React, Vite, CSS
- **Backend:** 
  - Amazon Cognito (Auth)
  - Amazon S3 (Storage)
  - Managed via `amplify/backend.ts`

## Deployment Instructions

To deploy this application to the cloud and get a live URL:

### 1. Prerequisites
- An AWS Account
- Node.js (v18+)
- A GitHub account

### 2. Local Setup
1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Deploy via AWS Amplify Console (Recommended)
This will set up continuous deployment and provide a public URL.

1. Push this code to a GitHub repository.
2. Log in to the [AWS Console](https://console.aws.amazon.com/).
3. Navigate to **AWS Amplify**.
4. Click **Create new app**.
5. Connect your GitHub repository and select the branch you pushed to.
6. Amplify will automatically detect the Gen 2 backend (`amplify/backend.ts`) and the Vite frontend.
7. Click **Save and deploy**.

Once deployed, AWS Amplify will provide a public URL (e.g., `https://main.xxxxxxx.amplifyapp.com`) which will handle the DNS/Routing.

**Project URL:** _[Your deployed URL will go here after following the steps above]_

## Running Locally

If you want to test the UI locally before deploying:
1. Run a sandbox environment to provision temporary cloud resources:
   ```bash
   npx ampx sandbox
   ```
2. In a separate terminal, start the Vite development server:
   ```bash
   npm run dev
   ```
