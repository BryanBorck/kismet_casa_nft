/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import { questions } from '@/data/questions'

import { ApplicantDataType } from '@/data/answer'

// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   doc,
//   addDoc,
//   getDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);


import { db, addDoc, collection } from "../../../utils/firebaseConfig"

const mockApplicantData: ApplicantDataType = {
  // rn, this id is the same as the fid
  id: "",
  
  q01: "",
  q02: "",
  q03: "",
  q04: "",
  q05: "",
  
  // some user data
  fid: "",
  displayName: "",
  followerCount: 0,
  pfpUrl: "",
  username: "",
  //added this q00 because its being created somewhere, and the db doesn't know how to handle it
  q00: "",
};

// const db = firebase.firestore();

// async function createApplicant(applicantData: ApplicantDataType) {
//   try {
//     const response = await fetch('http://localhost:5000/api/new', { // Adjust the URL to your actual API endpoint
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(applicantData),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create applicant');
//     }

//     const result = await response.text(); // or response.json() if your server responds with JSON
//     console.log(result); // Handle success
//     alert('Applicant created successfully'); // Simple success feedback
//   } catch (error) {
//     console.error("Error creating applicant:", error);
//     alert('Error creating applicant'); // Simple error feedback
//   }
// }

// Function to add applicant data to Firestore
async function addApplicant(applicantData: ApplicantDataType) {
  try {
    const docRef = await addDoc(collection(db, 'applicants'), applicantData);
    console.log('Applicant written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error creatinng applicant: ', error);
  }
}

const neynarMiddleware = neynar({
  apiKey: 'NEYNAR_FROG_FM',
  features: ['interactor', 'cast'],
})

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  imageAspectRatio: '1.91:1',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
}).frame('/', (c) => {
  return c.res({
    action: '/page/0',
    image: 'https://pbs.twimg.com/media/GF7ZvQRXEAAIH6C.jpg',
    intents: [
      <Button>Support</Button>,
    ],
  })
}).frame('/page/0', neynarMiddleware, (c) => {
  const { displayName } = c.var.interactor || {}
  return c.res({
    action: '/page/1',
    image: (
      <div
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to right, red, blue)',
          fontSize: 36,
          height: '100%',
          width: '100%',
          padding: 20,
        }}
      >
        <p>Hello {displayName || 'there'}, welcome to Kismet Casa!</p>
        <p style={{
          marginTop: 20,
        }}>Let's start the application to our Hacker House!</p>
      </div>
    ),
    intents: [
      <Button>Let`s Go!</Button>,
    ],
  })
}).frame('/page/:id', (c) => {
  const { id } = c.req.param();
  const { buttonValue, inputText } = c;
  const value = inputText || buttonValue;
  (mockApplicantData as any)[`q0${parseInt(id) - 1}` as keyof ApplicantDataType] = value as string;
  return c.res({
    action: (
      parseInt(id) < (questions.length) ? `/page/${parseInt(id) + 1}` : '/finish'
      // `/page/${parseInt(id) + 1}`
    ),
    image: (
      <div
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignContent: 'center',
          backgroundImage: 'linear-gradient(to right, red, blue)',
          fontSize: 36,
          height: '100%',
          width: '100%',
          padding: 20,
        }}
      >
        <p style={{
          fontSize: 36,
          fontWeight: 'bold',
          marginTop: 20,
          paddingLeft: 100,
          paddingRight: 100,
          wordWrap: 'break-word', // This is correct for breaking long words
          whiteSpace: 'normal', // Ensures that the whitespace inside the <p> element behaves normally
          overflowWrap: 'break-word', // Use this for breaking onto the next line, ensures compatibility
          textAlign: 'center', // This centers your text
        }}>
          {questions[parseInt(id) - 1].question}
        </p>
      </div>
    ),
    intents: [
      ...(questions[parseInt(id) - 1].type === 'options'
        ? questions[parseInt(id) - 1].options.map((option) => <Button value={option}>{option}</Button>)
        : [
          <TextInput placeholder="Type your answer here" />,
          <Button>Submit Answer</Button>,
        ]
      )
    ]
  })
}).frame('/finish', neynarMiddleware, (c) => {
  const { buttonValue, inputText } = c;
  const value = inputText || buttonValue;
  const {
    username,
    displayName,
    followerCount,
    pfpUrl,
  } = c.var.interactor || {}
  const { frameData } = c
  const { fid }: any = frameData

  mockApplicantData.q05 = value as string;
  mockApplicantData.id = fid;
  mockApplicantData.fid = fid;

  mockApplicantData.username = username as string;
  mockApplicantData.displayName = displayName as string;
  mockApplicantData.followerCount = followerCount as number;
  mockApplicantData.pfpUrl = pfpUrl as string;

  mockApplicantData.q00 = "this is a bug";

  // createApplicant(mockApplicantData);
  console.log('mockApplicantData', mockApplicantData);
  addApplicant(mockApplicantData);

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to right, red, blue)',
          fontSize: 36,
          height: '100%',
          width: '100%',
          padding: 20,
        }}
      >
        <p style={{
          fontSize: 36,
          marginTop: 20,
        }}>
          {/* Thank you, now share with your {followerCount || 'many'} followers! */}
          Application Submitted 📨
        </p>
      </div>
    ),
    intents: [
      <Button.Reset>Reset</Button.Reset>,
      <Button.Redirect location="https://kismetcasa.xyz/">Telegram</Button.Redirect>,
      <Button.Redirect location="https://kismetcasa.xyz/">Website</Button.Redirect>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
