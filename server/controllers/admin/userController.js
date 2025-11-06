import User from '../../models/User.js';

export const listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  res.json(user);
};

export const listAdmins = async (req, res) => {
  const admins = await User.find({ role: 'admin' }).select('-password');
  res.json(admins);
};