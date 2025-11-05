import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  summary: { type: String },
  category: { type: String, enum: ['support', 'bug', 'feature', 'feedback'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;