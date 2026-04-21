# Welcome to My Backend Dropbox
***

## Task
The goal of this project was to build a fully hosted, serverless file synchronization service (a Dropbox clone) with user authentication, file uploading, versioning, and DNS/routing. The main challenge was integrating a serverless backend architecture to handle load and scaling automatically without managing traditional servers, while connecting it securely to a modern, responsive ReactJS frontend.

## Description
I solved this problem by utilizing AWS Amplify Gen 2 to define our infrastructure as code. The frontend is built with ReactJS and Vite, featuring a premium glassmorphism design where each component has its own associated CSS file. 

The backend handles user authentication securely via Amazon Cognito and provides private, isolated file storage for each user via Amazon S3. The entire application is deployed and hosted using the AWS Amplify Console, which handles our DNS and continuous routing.

**Deployed URL:** [Insert your Amplify Console URL here]

## Installation
To set up this project locally, clone the repository and install the necessary dependencies using Node Package Manager:

```bash
git clone https://github.com/sanniadeiza/serverless-dropbox.git
cd serverless-dropbox
npm install
```

## Usage
To run the project locally and interact with your AWS backend:

First, spin up a temporary cloud sandbox environment for your backend resources:
```bash
npx ampx sandbox
```

Then, open a new terminal window and start the local React development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser. You can create an account, verify your email, and start securely uploading and managing your files!

### The Core Team
Sanni Adeiza

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
