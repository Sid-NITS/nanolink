import { Request, Response, NextFunction } from "express";

type AuthRequest = Request & { user?: any }; // Create a new type 'AuthRequest' that extends the 'Request' type
type Sync = (
  req: Request,
  res: Response,
  next: NextFunction
) => Response | void;

type Async = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

type Auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

export type { Sync, Async, Auth };
