import test from 'node:test';
import assert from 'node:assert/strict';
import { isContentAllowedForProfile, isBedtimeRestricted, verifyPin, MATURITY_RANK_MAP } from './parentalFilter';

test('maturity rank comparison allows safe content and blocks excessive ratings', () => {
  // Profile max rating = PG (rank 3)
  assert.equal(isContentAllowedForProfile('G', 'PG'), true);
  assert.equal(isContentAllowedForProfile('PG', 'PG'), true);
  assert.equal(isContentAllowedForProfile('PG-13', 'PG'), false);
  assert.equal(isContentAllowedForProfile('R', 'PG'), false);
  assert.equal(isContentAllowedForProfile('TV-MA', 'PG'), false);

  // Profile max rating = PG-13 (rank 4)
  assert.equal(isContentAllowedForProfile('PG-13', 'PG-13'), true);
  assert.equal(isContentAllowedForProfile('R', 'PG-13'), false);

  // Unrestricted profile
  assert.equal(isContentAllowedForProfile('NC-17', 'NC-17'), true);
});

test('pin verification handles valid and invalid PINs', () => {
  assert.equal(verifyPin('1234', '1234'), true);
  assert.equal(verifyPin('9999', '1234'), false);
  assert.equal(verifyPin(' 1234 ', '1234'), true); // trims whitespace
  assert.equal(verifyPin('any', undefined), true); // no pin set
});

test('bedtime curfew correctly detects night hours and allows daytime', () => {
  // Bedtime set to 21:30 (9:30 PM)
  // At 22:00 (10:00 PM), should be restricted
  assert.equal(isBedtimeRestricted(21, 30, 22, 0), true);

  // At 23:45, should be restricted
  assert.equal(isBedtimeRestricted(21, 30, 23, 45), true);

  // At 03:00 AM, should be restricted
  assert.equal(isBedtimeRestricted(21, 30, 3, 0), true);

  // At 14:00 (2:00 PM), should NOT be restricted
  assert.equal(isBedtimeRestricted(21, 30, 14, 0), false);

  // At 20:00 (8:00 PM), should NOT be restricted
  assert.equal(isBedtimeRestricted(21, 30, 20, 0), false);
});
