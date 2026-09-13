import { Router } from 'express';
import { quizController } from '../controllers/quizController.ts';

const router = Router();

router.get('/', quizController.getQuiz);

export default router;
