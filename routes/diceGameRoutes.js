import express from 'express';
import {heroController, battleStartController, battleRoundController, battleResetController} from '../controllers/heroController.js'
import { getStatistics } from '../controllers/statisticController.js'
const router = express.Router();


// GET /api/heroes
router.get('/heroes', heroController);
// POST /api/battle/start
router.post('/battle/start', battleStartController)

// POST /api/battle/round
router.post('/battle/round',battleRoundController)
// POST /api/battle/reset
router.post('/battle/reset',battleResetController )
// GET /api/statistics
router.get('/statistics', getStatistics)
export default router;