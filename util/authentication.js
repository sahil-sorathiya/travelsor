import jwt from "jsonwebtoken";
export const generateJWTToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRETKEY);
};
export const verifyJWTToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
    if (err) throw err;
    if (decoded.email) {
      return decoded.email;
    } else {
      return undefined;
    }
  });
};
