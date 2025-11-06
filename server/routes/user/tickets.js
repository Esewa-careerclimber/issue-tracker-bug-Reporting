import express from 'express';
import { summarize } from '../../services/ai/summarizer.js';
import { identifySeverity } from '../../services/ai/severity.js';
import { protect as authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validator.js';
import { upload } from '../../middleware/upload.js';
import {
  createTicket,
  getUserTickets,
  getSingleTicket
} from '../../controllers/user/ticketController.js';

const router = express.Router();

// Create ticket
router.post(
  '/',
  authenticate,
  upload.single('image'),
  validate(['title', 'description', 'category']),
  async (req, res) => {
    // req.body.summary = await summarize(req.body.description);
    // req.body.severity = await identifySeverity(req.body.description);
    // Only call AI services in non-test environments
    if (process.env.NODE_ENV !== 'test') {
      req.body.summary = await summarize(req.body.description);
      req.body.severity = await identifySeverity(req.body.description);
    } else {
      // Use defaults for testing
      req.body.summary = 'Test summary';
      req.body.severity = 'medium';
    }
    if (req.file) {
      req.body.image = req.file.path.replace(/\\/g, '/');
    }
    return createTicket(req, res);
  }
);

// Get all tickets for the logged-in user
router.get('/', authenticate, getUserTickets);

// Get a single ticket (if owned by user)
router.get('/:id', authenticate, getSingleTicket);

// Debug route to inspect req.body for form-data requests
router.post('/debug', upload.none(), (req, res) => {
  res.json(req.body);
});

export default router;