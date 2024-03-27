import firebase from "../firebase.js";
import Applicant from "../Models/applicant.js";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const db = getFirestore(firebase);


export const createApplicant = async (req, res, next) => {
    try {
        const data = req.body;
        await addDoc(collection(db, "applicants"), data);
        res.status(200).send("applicant created successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getApplicants = async (req, res, next) => {
    try {
        const applicants = await getDocs(collection(db, "applicants"));
        const applicantArray = [];

        if (applicants.empty) {
            res.status(400).send("No Applicants found");
        } else {
            applicants.forEach((doc) => {
                const applicant = new Applicant(
                    doc.id,
                    doc.data().fid,
                    doc.data().q01,
                    doc.data().q02,
                    doc.data().q03,
                    doc.data().q04,
                    doc.data().q05
                );
                applicantArray.push(applicant);
            });

            res.status(200).send(applicantArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getApplicant = async (req, res, next) => {
    try {
        const id = req.params.id;
        const applicant = doc(db, "applicants", id);
        const data = await getDoc(applicant);
        if (data.exists()) {
            res.status(200).send(data.data());
        } else {
            res.status(404).send("applicant not found");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updateApplicant = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const applicant = doc(db, "applicants", id);
        await updateDoc(applicant, data);
        res.status(200).send("applicant updated successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const deleteApplicant = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, "applicants", id));
        res.status(200).send("applicant deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
};
