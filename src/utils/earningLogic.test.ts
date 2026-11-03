import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEarnedCredits, processWithdrawal, BASE_EARNING_RATE_PER_MINUTE } from './earningLogic';

test('calculates accurate earnings per watched duration', () => {
  // 60 seconds (1 minute) at 1x multiplier
  const { earnedUsd, earnedCoins } = calculateEarnedCredits(60, 1.0);
  assert.equal(earnedUsd, 0.08);
  assert.equal(earnedCoins, 8);

  // 300 seconds (5 minutes) at 1.5x streak multiplier
  // 5 * 0.08 * 1.5 = 0.60
  const bonus = calculateEarnedCredits(300, 1.5);
  assert.equal(bonus.earnedUsd, 0.60);
  assert.equal(bonus.earnedCoins, 60);
});

test('processWithdrawal verifies balance and updates wallet accurately', () => {
  const result = processWithdrawal(25.50, 10.00, 'paypal');
  assert.equal(result.success, true);
  assert.equal(result.newBalanceUsd, 15.50);
  assert.ok(result.txId?.startsWith('TX-'));

  // Test overdraw prevention
  const failed = processWithdrawal(5.00, 20.00, 'paypal');
  assert.equal(failed.success, false);
  assert.equal(failed.error, 'Insufficient wallet balance');
});
