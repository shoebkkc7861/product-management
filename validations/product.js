import Joi from "joi";

export const createProductSchema = Joi.object({
  product_name: Joi.string().required(),
  // sku: Joi.string().required(),
  image: Joi.string().allow(null, ""),
  price: Joi.number().positive().required(),
  category_id: Joi.number().required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow("", null),
});

export const updateProductSchema = Joi.object({
  unique_id: Joi.string().required(),
  product_name: Joi.string(),
  sku: Joi.string(),
  image: Joi.string().allow(null, ""),
  price: Joi.number().positive(),
  category_id: Joi.number(),
  stock: Joi.number().integer().min(0),
  description: Joi.string().allow("", null),
  is_active: Joi.number().valid(0, 1),
});

export const deleteProductSchema = Joi.object({
  unique_id: Joi.string().required(),
});
