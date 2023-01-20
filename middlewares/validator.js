const yup = require("yup");

class Validator {
  static signup = async (req, res, next) => {
    const schema = yup.object().shape({
      username: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    });
    await validate(schema, req.body, res, next);
  };
}

const validate = async (schema, req, res, next) => {
  try {
    await schema.validate(req, { abortEarly: false });
    next();
  } catch (e) {
    const errors = e.inner.map(({ path, message, value }) => ({
      path,
      message,
      value,
    }));
    res.status(400).json(errors);
  }
};

module.exports = Validator;
