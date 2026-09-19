const { test } = require('node:test');
const assert = require('node:assert/strict');
const { BotAccess, BOT_IDLE_MS } = require('../dist/whatsapp/botAccess.js');

test('opt-in is per sender; prefix is one-shot; commands need exact boundaries', () => {
  const gate = new BotAccess();
  assert.equal(gate.accept('a', '1', 'menu', 100).kind, 'ignore');
  assert.equal(gate.accept('a', '2', 'hello @bot menu', 100).kind, 'ignore');
  assert.equal(gate.accept('a', '3', '@botany', 100).kind, 'ignore');
  const question = gate.accept('a', '4', '@BoT menu apa?', 100);
  assert.equal(question.text, 'menu apa?');
  assert.equal(gate.accept('a', '5', 'menu lagi', 101).kind, 'ignore');
  assert.equal(gate.accept('a', '6', '@bot', 102).kind, 'enabled');
  assert.equal(gate.accept('a', '7', 'menu', 103).kind, 'message');
  assert.equal(gate.accept('b', '8', 'menu', 104).kind, 'ignore');
});

test('duplicates do not refresh timeout; five minute boundary closes session and invalidates replies', () => {
  const closed = [];
  const gate = new BotAccess((from) => closed.push(from));
  gate.accept('a', '1', '@bot', 100);
  const msg = gate.accept('a', '2', 'menu', 200);
  assert.equal(gate.accept('a', '2', 'menu', 1000).kind, 'ignore');
  assert.equal(gate.canReply('a', msg.token, 200 + BOT_IDLE_MS - 1), true);
  assert.equal(gate.canReply('a', msg.token, 200 + BOT_IDLE_MS), false);
  assert.equal(gate.accept('a', '3', 'menu', 200 + BOT_IDLE_MS).kind, 'ignore');
  assert.deepEqual(closed, ['a']);
});

test('close invalidates in-flight answer even after reactivation; prune removes idle session', () => {
  const gate = new BotAccess();
  const msg = gate.accept('a', '1', '@bot menu', 100);
  assert.equal(gate.accept('a', '2', '@tutup', 101).kind, 'disabled');
  gate.accept('a', '3', '@bot', 102);
  assert.equal(gate.canReply('a', msg.token, 103), false);
  gate.prune(102 + BOT_IDLE_MS);
  assert.equal(gate.accept('a', '4', 'menu', 103 + BOT_IDLE_MS).kind, 'ignore');
});

test('handler processes duplicate event once and does not fallback after uncertain send', async () => {
  const { handleIncomingMessage } = require('../dist/index.js');
  let replies = 0;
  let fallback = 0;
  const message = {
    from: 'test-duplicate@c.us', id: { _serialized: 'same-id' }, body: '@bot menu',
    getChat: async () => null, getContact: async () => ({}),
    reply: async () => { replies++; throw new Error('send acknowledgement failed'); },
    client: { sendMessage: async () => { fallback++; } },
  };
  await Promise.all([1, 2].map(() => handleIncomingMessage({}, { maxPerMinute: 5, windowMs: 60000 }, null, message)));
  assert.equal(replies, 1);
  assert.equal(fallback, 0);
});

test('close bypasses rate limit and suppresses AI answer already in flight', async () => {
  const chat = require('../dist/ai/chatHandler.js');
  const { handleIncomingMessage } = require('../dist/index.js');
  const original = chat.handleChat;
  let finish;
  let started;
  const startedPromise = new Promise((resolve) => { started = resolve; });
  chat.handleChat = async () => { started(); return new Promise((resolve) => { finish = resolve; }); };
  const replies = [];
  const from = 'test-cancel@c.us';
  const makeMessage = (id, body) => ({ from, id: { _serialized: id }, body, getChat: async () => null, getContact: async () => ({}), reply: async (text) => replies.push(text) });
  const config = { maxPerMinute: 1, windowMs: 60000 };
  try {
    const pending = handleIncomingMessage({}, config, {}, makeMessage('q', '@bot menu'));
    await startedPromise;
    await handleIncomingMessage({}, config, {}, makeMessage('close', '@tutup'));
    finish('AI response should not be sent');
    await pending;
    assert.equal(replies.length, 1);
    assert.match(replies[0], /dinonaktifkan/);
  } finally { chat.handleChat = original; }
});
