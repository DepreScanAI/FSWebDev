import TokenManager from '../../../security/token-manager.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import { sendPasswordResetEmail } from '../../emailService.js';
import { success, created, error } from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated;

    const emailExists = await UserRepositories.verifyEmail(email);
    if (emailExists) {
      return next(new InvariantError('Email sudah terdaftar. Silakan login.'));
    }

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name.trim().split(/\s+/).slice(0, 2).join(' '),
    )}&background=1d8a5e&color=fff&bold=true&size=128`;

    const user = await UserRepositories.createUser({
      name,
      email,
      password,
      avatarUrl,
    });

    const accessToken = TokenManager.generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    const authData = TokenManager.buildAuthResponse(user, accessToken);

    return created(
      res,
      authData,
      'Registrasi berhasil! Selamat datang di DepreScan.',
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const user = await UserRepositories.verifyCredential(email, password);
    if (!user) {
      return next(new AuthenticationError('Email atau password salah.'));
    }

    if (user.provider !== 'local' || !user.password_hash) {
      return next(
        new InvariantError(
          `Akun ini terdaftar via ${user.provider}. Silakan login dengan ${user.provider}.`,
        ),
      );
    }

    const accessToken = TokenManager.generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    const authData = TokenManager.buildAuthResponse(user, accessToken);

    return success(res, authData, 'Login berhasil!');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/google
// Menerima access_token dari @react-oauth/google (flow: 'implicit')
// Fetch data user dari Google userinfo endpoint menggunakan access_token
export const googleAuth = async (req, res, next) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return next(new InvariantError('Google access token diperlukan.'));
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return error(res, 'Google OAuth belum dikonfigurasi di server.', 503);
    }

    // Fetch user info dari Google menggunakan access_token
    const googleRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    if (!googleRes.ok) {
      return error(
        res,
        'Google access token tidak valid atau sudah kedaluwarsa.',
        401,
      );
    }

    const payload = await googleRes.json();
    const { sub: googleId, email, name, picture: avatarUrl } = payload;

    if (!email) {
      return next(
        new InvariantError('Tidak dapat mengambil email dari akun Google.'),
      );
    }

    let user = await UserRepositories.getUserByGoogleIdOrEmail(googleId, email);

    if (user) {
      user = await UserRepositories.upsertGoogleUser({
        googleId,
        avatarUrl,
        name,
        existingId: user.id,
      });
    } else {
      user = await UserRepositories.insertGoogleUser({
        name,
        email,
        googleId,
        avatarUrl,
      });
    }

    const accessToken = TokenManager.generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    const authData = TokenManager.buildAuthResponse(user, accessToken);

    return success(res, authData, 'Login dengan Google berhasil!');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.validated;

    const user = await UserRepositories.getUserByEmailForAuth(email);

    if (!user || user.provider !== 'local') {
      return success(
        res,
        {},
        'Jika email terdaftar, kami akan mengirimkan link reset password.',
      );
    }

    await AuthenticationRepositories.invalidateOldResetTokens(user.id);
    const token = await AuthenticationRepositories.createResetToken(user.id);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, user.name, resetLink);

    return success(
      res,
      {},
      'Jika email terdaftar, kami akan mengirimkan link reset password.',
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/reset-password/verify?token=xxx
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.validatedQuery;

    const isValid =
      await AuthenticationRepositories.verifyResetTokenExists(token);
    if (!isValid) {
      return next(
        new InvariantError('Token tidak valid atau sudah kedaluwarsa.'),
      );
    }

    return success(res, { valid: true }, 'Token valid.');
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.validated;

    const row = await AuthenticationRepositories.getValidResetToken(token);
    if (!row) {
      return next(
        new InvariantError(
          'Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta link baru.',
        ),
      );
    }

    if (row.provider !== 'local') {
      return next(
        new InvariantError(
          `Akun ini terdaftar via ${row.provider}. Tidak dapat mereset password.`,
        ),
      );
    }

    const client = await AuthenticationRepositories.pool.connect();
    try {
      await client.query('BEGIN');
      await UserRepositories.updatePassword({
        userId: row.user_id,
        password,
        client,
      });
      await client.query(
        'UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1',
        [row.id],
      );
      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    return success(
      res,
      {},
      'Password berhasil direset. Silakan login dengan password baru Anda.',
    );
  } catch (err) {
    next(err);
  }
};
