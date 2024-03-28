"use client"

import { ApplicantDataType } from '@/data/answer'
  

export default function Page(): JSX.Element {

    const mockApplicantData : ApplicantDataType = {
        id: "1",
        fid: "1",
        q01: "Answer to question 1",
        q02: "Answer to question 2",
        q03: "Answer to question 3",
        q04: "Answer to question 4",
        q05: "Answer to question 5",
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

    const handleClick = () => {
        createApplicant(mockApplicantData);
    }

    return (
        <div>
            <h1>Hello, Next.js!</h1>
            {/* Using `onClick` to attach the event handler */}
            <button onClick={handleClick}>Click Me</button>
        </div>
    );
};