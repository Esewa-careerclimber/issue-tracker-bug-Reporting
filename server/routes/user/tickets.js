import express from 'express';
import { summarize } from '../../services/ai/summarizer.js';
import { identifySeverity } from '../../services/ai/severity.js';
import { protect as authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validator.js';
import { upload } from '../../middleware/upload.js';
import logger from '../../utils/logger.js';
import {
  createTicket,
  getUserTickets,
  getMyTickets,
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
    try {
      // Only call AI services in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        // Call AI services in parallel for better performance
        try {
          const [summary, severity] = await Promise.all([
            summarize(req.body.description || ''),
            identifySeverity(req.body.description || '')
          ]);
          req.body.summary = summary;
          req.body.severity = severity;
          logger.info('AI services processed ticket successfully');
        } catch (aiError) {
          // If AI services fail, use fallbacks (already handled in services)
          logger.warn('AI services encountered errors, using fallbacks');
          // The services themselves handle fallbacks, so we can continue
          if (!req.body.summary) {
            req.body.summary = (req.body.description || '').slice(0, 100) + '...';
          }
          if (!req.body.severity) {
            req.body.severity = 'medium';
          }
        }
      } else {
        // Use defaults for testing
        req.body.summary = 'Test summary';
        req.body.severity = 'medium';
      }
      
      if (req.file) {
        req.body.image = req.file.path.replace(/\\/g, '/');
      }
      
      return createTicket(req, res);
    } catch (error) {
      logger.error(`Error in ticket creation route: ${error.message}`);
      return res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
  }
);

// Get all tickets (with filters) - ALL users' tickets
router.get('/', authenticate, getUserTickets);

// Get only current user's tickets - for "My Issues" page
router.get('/myissues', authenticate, getMyTickets);

// Get a single ticket (any user can view)
router.get('/:id', authenticate, getSingleTicket);

// Debug route to inspect req.body for form-data requests
router.post('/debug', upload.none(), (req, res) => {
  res.json(req.body);
});

export default router;