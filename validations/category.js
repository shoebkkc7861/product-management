import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow("", null)
});

export const updateCategorySchema = Joi.object({
  uuid: Joi.string().required(),
  name: Joi.string().max(100).optional(),
  description: Joi.string().allow("", null).optional()
});

export const deleteCategorySchema = Joi.object({
  uuid: Joi.string().required()
});
