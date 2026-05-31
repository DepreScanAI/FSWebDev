import Joi from 'joi';

export const createFeedbackPayloadSchema = Joi.object({
  session_id: Joi.string().uuid().optional().allow(null, ''),
  is_helpful: Joi.boolean().required().messages({
    'any.required': 'is_helpful diperlukan.',
    'boolean.base': 'is_helpful harus berupa true atau false.',
  }),
  name_label: Joi.string().optional().allow(null, ''),
});
