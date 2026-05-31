import Joi from 'joi';

export const updateMePayloadSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Nama diperlukan.',
    'string.empty': 'Nama tidak boleh kosong.',
  }),
});
