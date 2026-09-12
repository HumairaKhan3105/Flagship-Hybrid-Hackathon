import { Router } from 'express';
import { instrumentController } from '../controllers/instrumentController.ts';

const router = Router();

// Order matters: specific paths before parameterized :id
router.get('/', instrumentController.getAllInstruments);
router.get('/featured', instrumentController.getFeatured);
router.get('/random', instrumentController.getRandom);
router.get('/search', instrumentController.searchInstruments);
router.get('/state/:state', instrumentController.getByState);
router.get('/family/:family', instrumentController.getByFamily);
router.get('/:id', instrumentController.getInstrumentById);

// Admin-ready mutation endpoints
router.post('/', instrumentController.createInstrument);
router.put('/:id', instrumentController.updateInstrument);
router.delete('/:id', instrumentController.deleteInstrument);

export default router;
