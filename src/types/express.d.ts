declare namespace Express {
  interface Request {
    correlationId: string;
    auth?: {
      userId: number;
      jti: string;
      email: string;
    };
  }
}
