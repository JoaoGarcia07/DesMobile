import { describe, expect, it } from 'vitest';

import {
  buildLoginPayload,
  calculateLevelProgress,
  createAchievementNotifications,
  createResetApprovalNotification,
  validateResetConfirmation,
} from './student-events';

describe('student-events', () => {
  it('normaliza o payload de login', () => {
    expect(buildLoginPayload('  aluno.demo  ', '123456')).toEqual({
      username: 'aluno.demo',
      password: '123456',
    });
  });

  it('valida a confirmacao de reset de senha', () => {
    expect(validateResetConfirmation('', '')).toBe('Preencha e confirme a nova senha.');
    expect(validateResetConfirmation('abc', 'def')).toBe('A confirmacao da senha nao confere.');
    expect(validateResetConfirmation('abc12345', 'abc12345')).toBeNull();
  });

  it('calcula o progresso do nivel com limite de 0 a 100', () => {
    expect(calculateLevelProgress(50, 200)).toBe(25);
    expect(calculateLevelProgress(500, 200)).toBe(100);
    expect(calculateLevelProgress(10, 0)).toBe(0);
  });

  it('gera notificacao apenas para novas conquistas', () => {
    const notifications = createAchievementNotifications(
      {
        profile: {
          id: 1,
          achievements: [{ id: 10, name: 'Primeira', xpReward: 10 }],
        },
        xpSummary: null,
        tasks: [],
      },
      {
        profile: {
          id: 1,
          achievements: [
            { id: 10, name: 'Primeira', xpReward: 10 },
            { id: 11, name: 'Nova', xpReward: 25 },
          ],
        },
        xpSummary: null,
        tasks: [],
      }
    );

    expect(notifications).toHaveLength(1);
    expect(notifications[0]?.id).toBe('achievement-11');
    expect(notifications[0]?.body).toContain('25 XP');
  });

  it('gera notificacao quando o reset passa para aprovado', () => {
    const notification = createResetApprovalNotification(
      { status: 'PENDING', requestedAt: '2026-04-20T18:00:00' },
      {
        status: 'APPROVED',
        approvedAt: '2026-04-20T18:05:00',
        expiresAt: '2026-04-20T18:35:00',
      }
    );

    expect(notification).not.toBeNull();
    expect(notification?.id).toBe('reset-approved-2026-04-20T18:05:00');
  });
});
