import Joi from 'joi';

export const predictPayloadSchema = Joi.object({
  include_ai_insight: Joi.boolean().default(false),
  name_label: Joi.string().optional().allow(null, ''),
}).unknown(true);
