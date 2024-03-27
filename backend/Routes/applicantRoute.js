import express from 'express';

import {
  createApplicant,
  getApplicant,
  getApplicants,
  updateApplicant,
  deleteApplicant,
} from '../Controllers/applicantControllers.js';

const router = express.Router();

router.get('/', getApplicants);
router.post('/new', createApplicant);
router.get('/applicant/:id', getApplicant);
router.put('/update/:id', updateApplicant);
router.delete('/delete/:id', deleteApplicant);

export default router;