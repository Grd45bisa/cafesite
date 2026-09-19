// Run after npm run build: node --test tests/rag-pipeline.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const embedding = require('../dist/rag/embed.js');
const { ingestPdf, extractPdfText } = require('../dist/rag/pipeline.js');

test('rejects disguised and oversized files before parsing', async () => {
  await assert.rejects(extractPdfText(Buffer.from('not a pdf')), /PDF tidak valid/);
  await assert.rejects(extractPdfText(Buffer.alloc(10 * 1024 * 1024 + 1)), /10 MB/);
});
test('real PDF extraction; failed embeddings never replace existing knowledge; cancelled jobs stay cancelled', async () => {
  const pdf = new Uint8Array(await readFile('docs/contoh-cafesite.pdf'));
  assert.ok((await extractPdfText(pdf.slice())).trim().length > 0);
  let writes = 0;
  const client = { rpc: async (name, args) => {
    writes++;
    assert.equal(name, 'replace_rag_source');
    assert.equal(args.job_id, 'job-1');
    assert.equal(args.worker, 'worker-1');
    assert.ok(args.chunks.length > 0);
    assert.equal(args.chunks[0].embedding.length, 2048);
    return { data: false, error: null };
  } };
  const original = embedding.embed;
  try {
    embedding.embed = async () => { throw new Error('provider unavailable'); };
    await assert.rejects(ingestPdf(client, {}, pdf.slice(), 'menu.pdf'), /provider unavailable/);
    assert.equal(writes, 0);
    embedding.embed = async (_, texts, mode) => { assert.equal(mode, 'passage'); return texts.map(() => Array(2048).fill(0)); };
    assert.equal(await ingestPdf(client, {}, pdf.slice(), 'menu.pdf', { id: 'job-1', worker: 'worker-1' }), false);
    assert.equal(writes, 1);
  } finally { embedding.embed = original; }
});

