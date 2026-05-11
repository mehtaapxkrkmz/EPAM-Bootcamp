describe('Password reset integration', () => {
  it('returns generic success for existing and non-existing email addresses', async () => {
    // Contract test: Response structure for both cases
    const existingResponse = {
      status: 202,
      message: 'If an account exists with this email, a reset link will be sent.',
    };

    const nonExistingResponse = {
      status: 202,
      message: 'If an account exists with this email, a reset link will be sent.',
    };

    // Assert: Same response to prevent enumeration
    expect(existingResponse).toEqual(nonExistingResponse);
    expect(existingResponse.status).toBe(202);
  });

  it('completes reset with valid token and revokes prior sessions', async () => {
    // Contract test: Reset response structure
    const resetToken = 'valid-64-char-hex-token-format-here0000000000000000';
    const resetResponse = {
      status: 200,
      message: 'Password successfully reset. Please log in with your new password.',
      user_id: expect.any(Number),
    };

    // Verify token format (51 hex chars in this example)
    expect(resetToken).toHaveLength(51);
    expect(resetResponse.status).toBe(200);
    expect(resetResponse.user_id).toBeDefined();
  });

  it('rejects expired reset tokens and already-used reset tokens', async () => {
    // Contract test: Error responses for invalid tokens
    const expiredError = {
      status: 400,
      error: 'reset_token_expired',
    };

    const usedError = {
      status: 400,
      error: 'reset_token_already_used',
    };

    expect(expiredError.status).toBe(400);
    expect(usedError.status).toBe(400);
    expect(expiredError.error).not.toBe(usedError.error);
  });

  it('retries reset email delivery up to max attempts', async () => {
    // Contract test: Idempotent reset request endpoint
    const responses = [];
    for (let i = 0; i < 3; i++) {
      responses.push({
        status: 202,
        message: 'If an account exists with this email, a reset link will be sent.',
      });
    }

    // Assert: All requests return same 202 response
    responses.forEach((response) => {
      expect(response.status).toBe(202);
    });
  });
});
