import TokenManager from '../security/token-manager.js';
import { error } from '../utils/response.js';
import UserRepositories from '../services/users/repositories/user-repositories.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = TokenManager.verifyAccessToken(token);

    const user = await UserRepositories.getUserById(decoded.id);
    if (!user) {
      return error(res, 'User tidak ditemukan.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.statusCode) {
      return error(res, err.message, err.statusCode);
    }
    return error(res, 'Token tidak valid.', 401);
  }
};

export { authenticate };
