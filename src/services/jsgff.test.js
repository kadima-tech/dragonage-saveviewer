import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createContext, runInContext } from 'node:vm';

const loadJsgff = () => {
  const context = createContext({});
  context.self = context;
  for (const file of ['byte-buffer.js', 'jspack.js', 'datatypes.js', 'gff4.js']) {
    runInContext(readFileSync(resolve('public/lib/jsgff/dist', file), 'utf8'), context);
  }
  return context;
};

it('loads the vendored parser the way the worker does', () => {
  const { GFF4, ByteBuffer } = loadJsgff();
  expect(typeof new GFF4().read_gff4).toBe('function');
  expect(typeof ByteBuffer).toBe('function');
});

it('rejects a file that is not a GFF save', () => {
  const { GFF4, ByteBuffer } = loadJsgff();
  const garbage = new TextEncoder().encode('not a dragon age save file at all').buffer;
  expect(() => new GFF4().read_gff4(new ByteBuffer(garbage))).toThrow();
});
