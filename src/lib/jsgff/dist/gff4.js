/* eslint-disable */
/*
    jsGFF - A GFF reader written in Javascript
    Copyright (C) 2014 Jacobus Meulen

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function() {
  // Might need to set these to appropriate names
  // This file depends on ByteBuffer, JSPack and DataTypes

  //var ByteBuffer, DataTypes, File, FileReader, GFF4, JSPack, fs;
  //var GFF4;

  // Include BEFORE this file
  // ByteBuffer = require('byte-buffer');

  // Include BEFORE this file
  // JSPack = require('jspack');

  // Include BEFORE this file
  // DataTypes = require('./datatypes');


  /*
  pyPrint = (json, name) ->
    str ="HeaderField(label={label}, type={type}, is_list={is_list}, is_struct={is_struct}, is_reference={is_reference}, offset={offset})"
    str =str.replace("{label}",json.label).replace("{type}",json.type).replace("{is_list}",json.is_list).replace("{is_struct}",json.is_struct).replace("{is_reference}",json.is_reference).replace("{offset}",json.offset)
    console.log str.replace(/true/g,'True').replace(/false/g,'False')

  fldTypePrint = (kind) ->
    if !!kind.fourcc
      console.log "Struct" + kind.fourcc
    else if !!kind.name
      console.log kind.name
    else
      console.log kind
   */

  GFF4 = (function() {
    function GFF4() {
      this.Header40Format = this._bistruct('4s4sII');
      this.Header41Format = this._bistruct('4s4sIIII');
      this.StructureFormat = this._bistruct('4sIII');
      this.FieldFormat = this._bistruct('III');
      this.datatypes = new DataTypes();
    }

    GFF4.prototype.Worker = function Worker(buffer){
      console.log("Worker reached");
      console.log(buffer);
      gff4 = new GFF4();
      bytebuffer = new ByteBuffer(buffer);
      try {
        result = gff4.read_gff4(bytebuffer);
        //TODO: Check file version and use the right flags for Dragon Age 2 support
        return {
          file_version: result.header.file_version,
          plot_data: result[16003][16400][16401]
        };
      } catch(e) {
        return e;
      }
    }

    GFF4.prototype.Synchronous = function(buffer){
      bytebuffer = new ByteBuffer(buffer);
      return this.read_gff4(bytebuffer);
    }


    GFF4.prototype.fetch_buffer = function(file, callback){
      this._load_file(file, function(err, bin_data){
        callback(null, bin_data.target.result);
      });
    }

    GFF4.prototype._load_file = function(file, callback) {
      var reader;
      reader = new FileReader();
      reader.onload = function(result) {
        return callback(null, result);
      };
      reader.readAsArrayBuffer(file);
      return reader
    };

    GFF4.prototype.read_gff4 = function(f) {
      console.log("entered function");
      var self;
      console.log(f);
      self = this;

        var s, string, strings, _j, _len1, cache, bigendian, complete, data_offset, e, header, i, parse_string, read_field, read_generic, read_list, read_reference, read_struct, read_value, s, stringcache, struct, use_cstring, version, _i, _len;
        f.front();
        header = self._read_header(f);
        data_offset = header.data_offset;
        bigendian = 'l';
        version = header.version;
        use_cstring = 'V4.1' <= version;
        console.log("Header version: " + header.file_version);
        console.log("File version: " + version);
        console.log("Using CString: " + use_cstring);
        if (use_cstring) {
          f.front().seek(header.string_offset);

          strings = f.read(header.data_offset - header.string_offset).toArray();
          cache = [[]];

          for (_i = 0, _len = strings.length; _i < _len; _i++) {
            string = strings[_i];
            if (string === 0) {
              cache.push([]);
            } else {
              cache[cache.length - 1].push(string);
            }
          }

          cache = cache.splice(0, header.string_count);
          stringcache = [];

          for (_j = 0, _len1 = cache.length; _j < _len1; _j++) {
            stringcache.push(String.fromCharCode.apply(null, new Uint8Array(cache[_j])));
          }

        } else {
          stringcache = {};
        }
        read_struct = function(structtype) {
          var field, offset, res, _j, _len1, _ref;
          offset = f.index;
          res = {
            type: 'struct'
          };
          _ref = structtype.fields;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            field = _ref[_j];
            if (offset + field.offset !== f.index) {
              f.front().seek(offset + field.offset);
            }
            res[field.label] = read_field(field);
          }
          return res;
        };
        read_field = function(field) {
          var fieldtype, _ref;
          fieldtype = field.type;
          if (field.indirect) {
            return read_reference(fieldtype);
          } else if (fieldtype.fields != null) {
            return read_struct(fieldtype);
          } else if (((_ref = fieldtype.name) != null ? typeof _ref.indexOf === "function" ? _ref.indexOf('List') : void 0 : void 0) >= 0) {
            return read_list(fieldtype);
          } else {
            return read_value(fieldtype);
          }
        };
        read_list = function(listtype) {
          var address, bytes, elemtype, g_ref, g_refs, length, offset, refs, res, _j, _k, _l, _len1, _len2, _m, _n, _o;
          elemtype = listtype.elem_type;
          res = [];
          bytes = f.read(4);
          address = self.datatypes.get("UINT32").unpack(bigendian, bytes)[0];
          if (address === 0xFFFFFFFF || isNaN(address)) {
            return res;
          }
          f.front().seek(data_offset + address);
          length = self.datatypes.get("UINT32").unpack(bigendian, f.read(4))[0];
          offset = f.index;
          if (listtype.indirect) {
            if (elemtype === null) {
              g_refs = [];
              for (i = _j = 0; _j < length; i = _j += 1) {
                g_ref = read_generic();
                if (g_ref.is_list || g_ref.is_reference) {
                  throw new Error('generic list with list or reference element %s'.replace('%s', g_ref));
                }
                g_refs.push(g_ref);
              }
              for (_k = 0, _len1 = g_refs.length; _k < _len1; _k++) {
                g_ref = g_refs[_k];
                if (g_ref.address === 0xFFFFFFFF) {
                  console.warn('null generic list value %r'.replace("%r", g_ref));
                  res.push(null);
                } else {
                  f.front().seek(data_offset + g_ref.address);
                  if (g_ref.is_struct) {
                    res.push(read_struct(header.structs[g_ref.type]));
                  } else if (g_ref.type === self.datatypes.types_by_id.indexOf("ECString")) {
                    res.push(ECString(parse_string()));
                  } else {
                    res.push(read_value(self.datatypes.types_by_id[g_ref.type]));
                  }
                }
              }
            } else {
              refs = [];
              for (i = _l = 0; _l < length; i = _l += 1) {
                address = self.datatypes.get("UINT32").unpack(bigendian, f.read(4))[0];
                refs.push(address);
              }
              for (_m = 0, _len2 = refs.length; _m < _len2; _m++) {
                address = refs[_m];
                if (address === 0xFFFFFFFF) {
                  res.push(null);
                } else {
                  f.front().seek(data_offset + address);
                  if (typeof elemtype === 'object') {
                    res.push(read_struct(elemtype));
                  } else if (elemtype === 'ECString') {
                    res.push({
                      type: "ECString",
                      value: parse_string()
                    });
                  } else {
                    res.push(read_value(elemtype));
                  }
                }
              }
            }
          } else if (typeof elemtype === 'object') {
            for (i = _n = 0; _n < length; i = _n += 1) {
              if (offset !== f.index) {
                f.front().seek(offset);
              }
              res.push(read_struct(elemtype));
              offset += elemtype.size;
            }
          } else if (elemtype === 'UINT8') {
            try{
              return {
                data: f.read(length)
              };
            } catch (e) {
              console.log("UINT8");
              console.log(e);
            }
          } else {
            for (i = _o = 0; _o < length; i = _o += 1) {
              if (offset !== f.index) {
                f.front().seek(offset);
              }
              res.push(read_value(elemtype));
              offset += self.datatypes.get(elemtype).size;
            }
          }
          return res;
        };
        read_reference = function(reftype) {
          var address, g_ref;
          if (reftype === null) {
            g_ref = read_generic();
            if (g_ref.address === 0xFFFFFFFF) {
              return null;
            } else if (g_ref.is_list || g_ref.is_reference) {
              throw new Error('generic list or reference element %s'.replace('%s', g_ref));
            }
            f.front().seek(data_offset + g_ref.address);
            if (g_ref.is_struct) {
              return read_struct(header.structs[g_ref.type]);
            } else if (g_ref.type === self.datatypes.types_by_id.indexOf("ECString")) {
              return {
                type: "ECString",
                value: parse_string()
              };
            } else {
              return read_value(self.datatypes.types_by_id[g_ref.type]);
            }
          } else {
            address = self.datatypes.get("UINT32").unpack(bigendian, f.read(4))[0];
            if (address === 0xFFFFFFFF || isNaN(address)) {
              return null;
            }
            f.front().seek(data_offset + address);
            if (typeof reftype === 'object') {
              return read_struct(reftype);
            } else if (reftype === 'ECString') {
              return {
                type: "ECString",
                value: parse_string()
              };
            } else {
              return read_value(reftype);
            }
          }
        };
        read_value = function(datatype) {
          var address, datatypeObj, label, _ref;

          datatypeObj = self.datatypes.get(datatype);
          if (datatypeObj.name === "ECString") {
            address = datatypeObj.unpack(bigendian, f.read(4))[0];
            if (address === 0xFFFFFFFF) {
              return null;
            } else if (use_cstring) {
              return {
                type: "ECString",
                value: stringcache[address]
              };
            }
            f.front().seek(data_offset + address);
            return {
              type: "ECString",
              value: parse_string()
            };
          } else if (datatypeObj.name === "TlkString") {
            _ref = datatypeObj.unpack(bigendian, f.read(8)), label = _ref[0], address = _ref[1];
            if (address === 0xFFFFFFFF) {
              return {
                label: label,
                s: null
              };
            } else if (use_cstring) {
              return {
                label: label,
                s: stringcache[address]
              };
            } else if (address === 0) {
              return {
                label: label,
                s: 0
              };
            } else {
              f.front().seek(data_offset + address);
              return {
                label: label,
                s: parse_string()
              };
            }
          } else {
            try{
            return {
              type: datatypeObj.name,
              value: datatypeObj.unpack(bigendian, f.read(datatypeObj.size))
            };
            } catch (e) {
              // Handle UINT64 a little differently - just store the bytes, deal with
              // the actual data later on the server
              if(datatypeObj.name == 'UINT64')
                return {
                  type: datatypeObj.name,
                  value: f.read(8).toArray()
                }
              else
                console.log(datatypeObj)
            }
          }
        };
        parse_string = function() {
          var e, length, str;
          length = self.datatypes.get("UINT32").unpack(bigendian, f.read(4))[0];

          try {
            s = f.read(length * 2);
            str = String.fromCharCode.apply(null, new Uint16Array(s.buffer));
            return str;
          } catch (_error) {
            e = _error;
            console.warn("BAD DATA " + s);
            return console.warn(e);
          }
        };
        read_generic = function() {
          var Generic, address, is_list, is_reference, is_struct, type_flags, type_id, _ref, _ref1;
          Generic = self.datatypes.get("Generic");
          _ref = Generic.unpack(bigendian, f.read(8)), type_id = _ref[0], address = _ref[1];
          type_flags = type_id >> 16;
          type_id = type_id & 0xffff;
          _ref1 = self._unpack_flags(type_flags, address !== 0xFFFFFFFF), is_list = _ref1[0], is_struct = _ref1[1], is_reference = _ref1[2];
          return {
            type: type_id,
            is_list: is_list,
            is_struct: is_struct,
            is_reference: is_reference,
            address: address
          };
        };
        try {
          f.index = data_offset;

          struct = read_struct(header.structs[0]);
          struct.header = header;
          return struct;
        } catch (_error) {
          e = _error;
          throw e;
        }
    };

    GFF4.prototype._read_header = function(f, return_roots) {
      var header, headerstructs, i, lists, make_field, make_structure, not_roots, queue, self, structs, _i, _ref;
      if (!f) {
        throw Error("File stream not defined");
      }
      self = this;
      header = this._unpack_header(f);
      headerstructs = header.structs;
      queue = [];
      for (i = _i = 0, _ref = headerstructs.length; _i < _ref; i = _i += 1) {
        queue.push(i);
      }
      not_roots = {};
      structs = {};
      lists = {};
      make_field = function(field) {
        var elem_type, indirect, key, kind, str, _ref1;
        str = "";
        if (field.is_struct) {
          kind = make_structure(field.type);
        } else if (field.type === 0xFFFF) {
          kind = null;
        } else {
          kind = self.datatypes.types_by_id[field.type];
        }
        indirect = field.is_reference;
        if (field.is_list) {
          key = kind != null ? kind.name : void 0;
          if (!key) {
            key = kind;
          }
          if (((_ref1 = lists[key]) != null ? _ref1[indirect] : void 0) != null) {
            kind = lists[key][indirect];
          } else {
            elem_type = kind;
            kind = self.datatypes._listtype(elem_type, indirect);
            key = elem_type != null ? elem_type.name : void 0;
            if (!key) {
              key = elem_type;
            }
            if (!lists[key]) {
              lists[key] = [];
            }
            lists[key][indirect] = kind;
          }
          indirect = false;
        } else if (kind === null && !indirect) {
          throw new Error('Cannot have a generic field that is not a reference');
        }

        /*
        console.log '[FIELD]'
        if !!kind.fourcc
          console.log "Struct" + kind.fourcc
        else if !!kind.name
          console.log kind.name
        else
          console.log kind
         */
        return {
          label: field.label,
          type: kind,
          indirect: indirect,
          offset: field.offset
        };
      };
      make_structure = function(i, root) {
        var field, fields, index, structdef, _j, _len, _ref1;
        if (!root) {
          not_roots[i] = i;
        }
        if (!structs[i]) {
          structdef = headerstructs[i];
          structs[i] = self.datatypes._structtype1(structdef.type, structdef.size);
          index = queue.indexOf(i);
          if (index >= 0) {
            queue.splice(index, 1);
          }
          fields = [];
          _ref1 = structdef.fields;
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            field = _ref1[_j];
            fields.push(make_field(field));
          }
          structs[i] = self.datatypes._structtype2(structs[i], fields);
          return structs[i];
        } else {
          return structs[i];
        }
      };
      while (queue.length > 0) {
        make_structure(queue[0], true);
      }
      header.structs = structs;
      return header;
    };


    /*
      header = header._replace(structs=tuple(structs[i] for i in xrange(len(headerstructs))))
      if return_roots:
          roots = set(xrange(len(header.structs))).difference(not_roots)
          return header, roots
      else:
          return header
     */


    /*
    ========================================
    =============== TESTED =================
    ========================================
     */

    GFF4.prototype._unpack_header = function(f) {
      var bigendian, bytes, data_offset, fieldFormat, file_type, file_version, gff_version, magic, read_structs, real_version, self, string_count, string_offset, structFormat, struct_count, target_platform, _ref, _ref1;
      self = this;
      f.index = 0;
      magic = f.read(4);
      if (magic.toASCII('', false) !== 'GFF ') {
        throw new Error('Unknown filetype: ' + magic.toASCII());
      }
      gff_version = f.read(4).toASCII('', false);
      if (gff_version !== 'V4.0' && gff_version !== 'V4.1') {
        throw new Error("Unknown GFF version: " + gff_version.toASCII());
      }
      target_platform = f.read(4).toASCII('', false);
      bigendian = 'l';
      real_version = this._real_version(gff_version, target_platform);
      if (real_version === 'V4.0') {
        bytes = f.read(16).toArray();
        _ref = this.Header40Format[bigendian].unpack(bytes), file_type = _ref[0], file_version = _ref[1], struct_count = _ref[2], data_offset = _ref[3];
        string_count = 0;
        string_offset = data_offset;
      } else if (real_version === 'V4.1') {
        bytes = f.read(24).toArray();
        _ref1 = this.Header41Format[bigendian].unpack(bytes), file_type = _ref1[0], file_version = _ref1[1], struct_count = _ref1[2], string_count = _ref1[3], string_offset = _ref1[4], data_offset = _ref1[5];
      }
      fieldFormat = this.FieldFormat[bigendian];
      structFormat = this.StructureFormat[bigendian];
      read_structs = function(n) {
        var args, args_list, i, read_struct, structs, _i, _j, _len;
        read_struct = function(struct_type, field_count, field_offset, struct_size) {
          var fields, i, read_field, _i;
          read_field = function() {
            var index, is_list, is_reference, is_struct, label, type_flags, type_id, _ref2, _ref3;
            bytes = f.read(12);
            _ref2 = fieldFormat.unpack(bytes.toArray()), label = _ref2[0], type_id = _ref2[1], index = _ref2[2];
            type_flags = type_id >> 16;
            type_id = type_id & 0xffff;
            _ref3 = self._unpack_flags(type_flags), is_list = _ref3[0], is_struct = _ref3[1], is_reference = _ref3[2];
            return {
              label: label,
              type: type_id,
              is_list: is_list > 0,
              is_struct: is_struct > 0,
              is_reference: is_reference > 0,
              offset: index
            };
          };
          if (f.index !== field_offset) {
            throw new Error("Did not match: " + f.index + " != " + field_offset);
          }
          fields = [];
          for (i = _i = 0; _i < field_count; i = _i += 1) {
            fields.push(read_field());
          }
          return {
            type: struct_type,
            size: struct_size,
            fields: fields
          };
        };
        structs = [];
        args_list = [];
        for (i = _i = 0; _i < n; i = _i += 1) {
          bytes = f.read(16).toArray();
          args_list.push(structFormat.unpack(bytes));
        }
        for (i = _j = 0, _len = args_list.length; _j < _len; i = ++_j) {
          args = args_list[i];
          structs.push(read_struct.apply(this, args));
        }
        return structs;
      };
      return {
        version: gff_version,
        platform: target_platform,
        file_type: file_type,
        file_version: file_version,
        string_count: string_count,
        string_offset: string_offset,
        data_offset: data_offset,
        structs: read_structs(struct_count),
        find: function(name) {
          var struct, _i, _len, _ref2;
          _ref2 = this.structs;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            struct = _ref2[_i];
            if (struct.fourcc != null) {
              if (struct.fourcc === name) {
                return struct;
              }
            } else {
              if (struct.type === name) {
                return struct;
              }
            }
            return null;
          }
        }
      };
    };

    GFF4.prototype._unpack_flags = function(flags, check) {
      if (check && flags & 0x1FFF) {
        throw new Error("unknown flag(s) in field: " + (flags & 0x1FFF));
      }
      return [flags & 0x8000, flags & 0x4000, flags & 0x2000];
    };

    GFF4.prototype._real_version = function(version, platform) {
      if (platform === 'X360' && version === 'V4.0') {
        return 'V4.1';
      }
      return version;
    };

    GFF4.prototype._bistruct = function(format) {
      var be, create_struct, le, _ref;
      if ((_ref = format[0]) === '<' || _ref === '>' || _ref === '=' || _ref === '!') {
        throw new Error('format cannot dictate byte-order');
      }
      create_struct = function(fmt) {
        return {
          pack: function(arr) {
            return JSPack.jspack.Pack(fmt, arr);
          },
          unpack: function(arr) {
            return JSPack.jspack.Unpack(fmt, arr, 0);
          }
        };
      };
      le = create_struct('<' + format);
      be = create_struct('>' + format);
      return {
        l: le,
        b: be,
        size: le.size
      };
    };

    GFF4.prototype._print_headerstructs = function(structs) {
      return console.log(structs);
    };

    return GFF4;

  })();

}).call(this);
