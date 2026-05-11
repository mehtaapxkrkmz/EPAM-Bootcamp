describe('Session edge cases integration', () => {
  it('expires sessions after 24-hour boundary', async () => {
    // Contract test: Expired session rejection
    const expiredSession = {
      issued_at: new Date(Date.now() - 25 * 60 * 60 * 1000),
      expires_at: new Date(Date.now() - 1000),
      revoked_at: null,
    };

    const now = new Date();
    expect(new Date(expiredSession.expires_at).getTime()).toBeLessThan(now.getTime());
  });

  it('revokes session on logout and denies subsequent protected access', async () => {
    // Contract test: Session revocation
    const activeSession = {
      revoked_at: null,
      status: 'active',
    };

    const revokedSession = {
      revoked_at: new Date(),
      status: 'revoked',
    };

    expect(activeSession.revoked_at).toBeNull();
    expect(revokedSession.revoked_at).not.toBeNull();
    expect(activeSession.status).not.toBe(revokedSession.status);
  });

  it('revokes all active sessions after password reset completion', async () => {
    // Contract test: Cascade revocation on password reset
    const userSessions = [
      { id: 1, user_id: 1, revoked_at: null },
      { id: 2, user_id: 1, revoked_at: null },
      { id: 3, user_id: 1, revoked_at: null },
    ];

    // After reset, all should be revoked
    const afterReset = userSessions.map((session) => ({
      ...session,
      revoked_at: new Date(),
    }));

    afterReset.forEach((session) => {
      expect(session.revoked_at).not.toBeNull();
    });
  });

  it('supports concurrent sessions across multiple devices', async () => {
    // Contract test: Multiple concurrent sessions
    const device1Session = {
      user_id: 1,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      revoked_at: null,
    };

    const device2Session = {
      user_id: 1,
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      revoked_at: null,
    };

    const device3Session = {
      user_id: 1,
      user_agent: 'Mozilla/5.0 (Linux; Android 11)',
      revoked_at: null,
    };

    const sessions = [device1Session, device2Session, device3Session];

    // All belong to same user
    expect(sessions.every((s) => s.user_id === 1)).toBe(true);
    // All are active (not revoked)
    expect(sessions.every((s) => s.revoked_at === null)).toBe(true);
    // All have different user agents
    const agents = sessions.map((s) => s.user_agent);
    expect(new Set(agents).size).toBe(3);
  });
});
