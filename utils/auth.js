import jwt from 'jsonwebtoken'
const createJWT = (email, userId, duration) => {
   const payload = {
      email,
      userId,
      duration
   };
   return jwt.sign(payload, "correct horse battery staple", {
     expiresIn: duration,
   });
};

export default createJWT
