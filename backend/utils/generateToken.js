import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // Payload của token sẽ chứa ID của user
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;