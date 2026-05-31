import jwt from 'jsonwebtoken';
import AuthenticationError from '../exceptions/authentication-error.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }),

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token telah kedaluwarsa. Silakan login kembali.');
      }
      throw new AuthenticationError('Token tidak valid.');
    }
  },

  buildAuthResponse: (user, token) => ({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      provider: user.provider,
    },
  }),
};

export default TokenManager;
