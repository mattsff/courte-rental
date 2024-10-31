import express from 'express';
import { body } from 'express-validator';
import { courtController } from '../controllers/CourtController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Court management routes
router.get('/courts', auth, courtController.getAllCourts);
router.get('/courts/:id', auth, courtController.getCourtById);
router.post('/courts', 
  auth,
  [
    body('name').notEmpty(),
    body('type').notEmpty(),
    body('pricePerHour').isNumeric(),
    body('isAvailable').isBoolean()
  ],
  courtController.createCourt
);
router.put('/courts/:id', auth, courtController.updateCourt);
router.delete('/courts/:id', auth, courtController.deleteCourt);
router.post('/courts/:id/images', auth, courtController.uploadCourtImage);

export default router;