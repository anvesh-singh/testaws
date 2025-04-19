//@ts-nocheck

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import teacherrouter from "../routes/teacherroute";
import studentrouter from "../routes/studentroute";
dotenv.config();
const SECRET = process.env.JWT_SECRET;

// Middleware to check the user role
export const checkRole = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: 'No token provided',
        type : "check role"
       });
    }

    try {
      const decoded = jwt.verify(token, SECRET) as { id: string; role: string };
      if (decoded.role == "teacher") {
        return teacherrouter(req, res, next);
      }
      else {
        return studentrouter(req, res, next);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };
};
