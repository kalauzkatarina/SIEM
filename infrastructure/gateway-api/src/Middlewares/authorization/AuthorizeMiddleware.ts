import { Request, Response, NextFunction } from "express";

export const ROLES = {
  ADMIN: 0,
  SYS_ADMIN: 1,
  ANALYTICS_MANAGER: 2,
  ANIMATION_WORKER: 3,
  AUDIO_STAGIST: 4,
  PROJECT_MANAGER: 5,
};

export const authorize = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};

export const requireSysAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.isSysAdmin) {
    res.status(403).json({ message: "Forbidden - sysAdmin role required" });
    return;
  }

  next();
};
