import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      set({ loading: false });
      return;
    }
    try {
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password,
      });
      set({ user: response.data.user, loading: false });
      toast.success('Signup successful!');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Signup failed');
      } else {
        toast.error('An unexpected error occurred');
      }
      set({ loading: false });
    }
  },
}));
