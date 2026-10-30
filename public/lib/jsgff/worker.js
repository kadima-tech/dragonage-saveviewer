/* global GFF4, ByteBuffer */
importScripts('dist/byte-buffer.js', 'dist/jspack.js', 'dist/datatypes.js', 'dist/gff4.js');

self.onmessage = function (event) {
  try {
    var result = new GFF4().read_gff4(new ByteBuffer(event.data));
    //TODO: Check file version and use the right flags for Dragon Age 2 support
    self.postMessage({
      file_version: result.header.file_version,
      plot_data: result[16003][16400][16401],
    });
  } catch (e) {
    self.postMessage({ error: String((e && e.message) || e) });
  }
};
