import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stepsToReproduce: { type: String },
  summary: { type: String },

  // FIX 1: Renamed 'category' to 'ticketType' and updated the allowed values
  // to match the "Issue Type" dropdown on your form.
  ticketType: { type: String, enum: ['bug', 'feature', 'feedback'], required: true },

  // FIX 2: Added a new 'category' field with the correct allowed values
  // to match the "Category" dropdown on your form.
  category: { type: String, enum: ['general', 'ui-ux', 'backend', 'frontend', 'performance'], required: true },

  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

  // FIX 3: Renamed 'image' to 'attachment' to match what the controller is sending.
  attachment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;