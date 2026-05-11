CREATE TABLE IF NOT EXISTS auth_events (
  id SERIAL PRIMARY KEY,
  user_id INT,
  event_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent VARCHAR(500),
  error_code VARCHAR(100),
  correlation_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_events_event_type ON auth_events(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_events_created_at ON auth_events(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_events_correlation_id ON auth_events(correlation_id);
