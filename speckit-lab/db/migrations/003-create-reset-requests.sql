CREATE TABLE IF NOT EXISTS reset_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  reset_token_hash VARCHAR(255) UNIQUE NOT NULL,
  issued_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  redeemed_by_user_id INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (redeemed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_reset_requests_user_id ON reset_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_reset_requests_token_hash ON reset_requests(reset_token_hash);
CREATE INDEX IF NOT EXISTS idx_reset_requests_expires_at ON reset_requests(expires_at);
