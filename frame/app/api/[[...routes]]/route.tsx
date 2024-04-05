/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { questions } from '@/data/questions'
import { ApplicantDataType } from '@/data/answer'
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// const signerUuid = 'some-uuid';
const neynarApiKey = 'NEYNAR_FROG_FM';
const client = new NeynarAPIClient(neynarApiKey);

// create signer
// const signer = await client.createSigner(
//   developerMnemonic,
// );

// async function publishCast(signerUuid: string, message: string) {
//   const cast = await client.publishCast(signerUuid, message, {
// embeds: [{ url: 'https://kismetnft.vercel.app/api' }],
//   });
//   console.log(cast);
// }

const mockApplicantData : ApplicantDataType = {
  id: "",
  fid: "",
  q01: "",
  q02: "",
  q03: "",
  q04: "",
  q05: "",
};

async function createApplicant(applicantData : ApplicantDataType) {
  try {
      const response = await fetch('http://localhost:5000/api/new', { // Adjust the URL to your actual API endpoint
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicantData),
      });

      if (!response.ok) {
          throw new Error('Failed to create applicant');
      }

      const result = await response.text(); // or response.json() if your server responds with JSON
      console.log(result); // Handle success
      alert('Applicant created successfully'); // Simple success feedback
  } catch (error) {
      console.error("Error creating applicant:", error);
      alert('Error creating applicant'); // Simple error feedback
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
    image: 'https://i.imgur.com/RTYtwuB.jpg',
    intents: [
      <Button>Apply</Button>,
    ],
  })
}).frame('/page/0', neynarMiddleware, (c) => {
  const { displayName } = c.var.interactor || {}
  // const { frameData } = c
  // const { fid } : any = frameData
  // publishCast(fid, 'TEST BRY');
  return c.res({
    action: '/page/1',
    image: (
      <div
      style={{
        alignItems: 'center',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: 'url(https://i.imgur.com/0sCVKCi.jpg)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        fontSize: 36,
        overflow: 'hidden', 
      }}
    >
     <p>Hola {displayName || 'there'}, welcome to Kismet Casa 🏡</p>

     {/* Modify this to any name of house */}

     <p style={{
        marginTop: 20,
      }}>Let's start the application to our Energy Hacker House!</p>

    </div>
    ),
    intents: [
      <Button>Yeah, for sure</Button>,
    ],
  })
}).frame('/page/:id', (c) => {
  const { id } = c.req.param();
  const { buttonValue, inputText } = c;
  const value = inputText || buttonValue;
  mockApplicantData[`q0${parseInt(id) - 1}` as keyof ApplicantDataType] = value as string;
  return c.res({
    action: (
      parseInt(id) < (questions.length) ? `/page/${parseInt(id) + 1}` : '/finish'
      // `/page/${parseInt(id) + 1}`
    ),
    image: (
      <div
      style={{
        alignItems: 'center',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: 'url(https://i.imgur.com/0sCVKCi.jpg)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        fontSize: 36,
        overflow: 'hidden', 
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
          <Button>
            {(parseInt(id) === questions.length) ? 'Submit Application' : 'Send Answer'}
          </Button>,
        ]
      )
    ]
  })
}).frame('/finish', neynarMiddleware, (c) => {
  const { buttonValue, inputText } = c;
  const value = inputText || buttonValue;
  const { followerCount } = c.var.interactor || {}
  const { frameData } = c
  const { fid } : any = frameData
  mockApplicantData.q05 = value as string;
  mockApplicantData.fid = fid;
  createApplicant(mockApplicantData);
  return c.res({
    image: (
      <div
      style={{
        alignItems: 'center',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: 'url(https://i.imgur.com/0sCVKCi.jpg)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        fontSize: 36,
        overflow: 'hidden', 
      }}
    >
      <p>Application submitted 📨</p>
      <p style={{
        fontSize: 36,
        marginTop: 20,
      }}>Thank you, now share with your {followerCount || 'many'} followers!</p>
    </div>
    ),
    intents: [
      <Button.Redirect location="https://warpcast.com/~/compose?embeds[]=https://kismetnft.vercel.app/api">Share</Button.Redirect>,
      <Button.Redirect location="https://warpcast.com/~/channel/kismetcasa">Follow us</Button.Redirect>,
      <Button.Redirect location="https://kismetcasa.xyz/">Website</Button.Redirect>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
