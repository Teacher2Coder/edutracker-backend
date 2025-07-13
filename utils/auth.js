import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const secret = process.env.AUTH_SECRET; // Need to store this in .env
const expiration = '2h';

const AuthenticationError = new GraphQLError('Could not authenticate user.', {
  extensions: {
    code: 'UNAUTHENTICATED',
  },
});

const authMiddleware = function ({ req }) {
  // allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;
  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
};

const signTokenTeacher = function ({ teacherName, teacherEmail }) {
  const payload = { teacherName, teacherEmail };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

const signTokenStudent = function ({ studentName, studentEmail }) {
  const payload = { studentName, studentEmail };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

export default {
  AuthenticationError,
  authMiddleware,
  signTokenTeacher,
  signTokenStudent,
};