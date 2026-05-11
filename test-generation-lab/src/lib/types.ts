export type UserStatus = 'active' | 'locked' | 'suspended';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  status: UserStatus;
  lockout_until: Date | null;
  failed_login_attempts: number;
  lockout_count_24h: number;
  lockout_window_start: Date | null;
  last_login_at: Date | null;
  password_changed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  jti: string;
  token_hash: string;
  issued_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface ResetRequest {
  id: number;
  user_id: number;
  reset_token_hash: string;
  issued_at: Date;
  expires_at: Date;
  used_at: Date | null;
  redeemed_by_user_id: number | null;
  created_at: Date;
}

export interface AuthEvent {
  id: number;
  user_id: number | null;
  event_type:
    | 'registration'
    | 'login_success'
    | 'login_failure'
    | 'logout'
    | 'reset_request'
    | 'reset_completed'
    | 'session_revoked'
    | 'lockout_triggered'
    | 'reset_email_failed';
  status: 'success' | 'failure' | 'pending';
  ip_address: string | null;
  user_agent: string | null;
  error_code: string | null;
  correlation_id: string;
  created_at: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: {
    id: number;
    email: string;
  };
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface CompletePasswordResetRequest {
  reset_token: string;
  new_password: string;
}

export interface AuthTokenPayload {
  sub: string;
  jti: string;
  email: string;
  iat: number;
  exp: number;
}
