import { Router } from 'express';
import { searchController } from '../controllers/SearchController.js';

const router = Router();

// Define API Endpoints
router.post('/search', (req, res, next) => {
  searchController.handleSearch(req, res).catch(next);
});

router.post('/search/switch-path', (req, res, next) => {
  searchController.switchPath(req, res).catch(next);
});

router.get('/history', (req, res, next) => {
  searchController.getHistory(req, res).catch(next);
});

router.get('/search/:id', (req, res, next) => {
  searchController.getSearchById(req, res).catch(next);
});

export default router;
