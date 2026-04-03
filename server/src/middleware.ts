import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { IUser } from "../../interface/UserInterface";
import * as UserRepository from "./repository/UserRepository.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      res.status(401).json({ message: "Action non autorisée" });
      return;
    }

    const secret =
      process.env.APP_SECRET || "dgjshdfguykdshgdfkjhgfjdsf0011231141.20231$$";
    const tokenDecode = jwt.verify(token, secret) as {
      user_id: string;
      user_email: string;
      role: string;
    };

    const userIfExist = await UserRepository.getUserByEmail(
      tokenDecode.user_email,
    );

    if (!userIfExist) {
      res.status(401).json({ message: "Action non autorisée" });
      return;
    }

    req.user = userIfExist;
    next();
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Erreur du serveurs" });
  }
};
