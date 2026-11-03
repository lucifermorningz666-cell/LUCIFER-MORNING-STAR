import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePartyRoomCode,
  calculatePlaybackDrift,
  shouldTriggerSync,
  formatVideoTime,
  createPartySystemMessage
} from './watchPartyLogic';

test('generates valid room code format LUM-XXXX', () => {
  const code = generatePartyRoomCode();
  assert.match(code, /^LUM-[A-Z0-9]{4}$/);
});

test('calculatePlaybackDrift accurately calculates difference in seconds', () => {
  assert.equal(calculatePlaybackDrift(10.5, 12.0), 1.5);
  assert.equal(calculatePlaybackDrift(12.0, 10.5), 1.5);
  assert.equal(calculatePlaybackDrift(0, 0), 0);
});

test('shouldTriggerSync accurately evaluates threshold', () => {
  assert.equal(shouldTriggerSync(10, 10.5, 1.5), false); // 0.5s drift <= 1.5s
  assert.equal(shouldTriggerSync(10, 12.0, 1.5), true);  // 2.0s drift > 1.5s
});

test('formatVideoTime formats seconds correctly into MM:SS and HH:MM:SS', () => {
  assert.equal(formatVideoTime(65), '01:05');
  assert.equal(formatVideoTime(3665), '01:01:05');
  assert.equal(formatVideoTime(0), '00:00');
});

test('createPartySystemMessage constructs a valid system message', () => {
  const msg = createPartySystemMessage('Elena joined the party', 120);
  assert.equal(msg.isSystem, true);
  assert.equal(msg.videoTimestamp, 120);
  assert.ok(msg.text.includes('Elena'));
});
