export interface SessionData {
  codeVerifier: number
  address: string
  // Add other session properties as needed
}

// request-session.interface.ts
import { Session } from 'express-session'

export interface RequestWithSession extends Request {
  session: Session & Partial<SessionData>
}
export interface ResponseWithSession extends Response {
  session: Session & Partial<SessionData>
}
