
import User from '../models/User.js';
import Joi from 'joi';

exports.createUser = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().required(),
  });
  
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('User not found');
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  