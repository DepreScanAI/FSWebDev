import Joi from 'joi';

export const registerPayloadSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Nama diperlukan.',
    'string.empty': 'Nama tidak boleh kosong.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email diperlukan.',
    'string.email': 'Email tidak valid.',
    'string.empty': 'Email tidak boleh kosong.',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password diperlukan.',
    'string.min': 'Password minimal 6 karakter.',
    'string.empty': 'Password tidak boleh kosong.',
  }),
});

export const loginPayloadSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email diperlukan.',
    'string.email': 'Email tidak valid.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password diperlukan.',
  }),
});

export const forgotPasswordPayloadSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email diperlukan.',
    'string.email': 'Email tidak valid.',
  }),
});

export const resetPasswordPayloadSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token diperlukan.',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Password baru diperlukan.',
    'string.min': 'Password baru minimal 6 karakter.',
  }),
});

export const verifyResetTokenQuerySchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Token diperlukan.',
  }),
});
