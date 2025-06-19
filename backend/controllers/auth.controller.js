import User from '../models/user.model.js';

export const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });
    return res.status(201).json({ user, message: 'You created successfully' });
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  res.send('login route');
};
export const logout = async (req, res) => {
  res.send('logout route');
};
