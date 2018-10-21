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
  //var DataTypes
  var  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  // Include this BEFORE
  //JSPack = require('jspack');

  DataTypes = (function() {
    function DataTypes(use_float_types) {
      var bistr, format, i, _i, _len, _ref;
      this._use_float_types = use_float_types || true;
      this._structname_chars = ['1', '0', '3', '2', '5', '4', '7', '6', '9', '8', 'A', 'C', 'B', 'E', 'D', 'G', 'F', 'I', 'H', 'K', 'J', 'M', 'L', 'O', 'N', 'Q', 'P', 'S', 'R', 'U', 'T', 'W', 'V', 'Y', 'X', 'Z', 'a', 'c', 'b', 'e', 'd', 'g', 'f', 'i', 'h', 'k', 'j', 'm', 'l', 'o', 'n', 'q', 'p', 's', 'r', 'u', 't', 'w', 'v', 'y', 'x', 'z'];
      this.types_by_id = ['UINT8', 'INT8', 'UINT16', 'INT16', 'UINT32', 'INT32', 'UINT64', 'INT64', 'FLOAT32', 'FLOAT64', 'Vector3f', '', 'Vector4f', 'Quaternionf', 'ECString', 'Color4f', 'Matrix4x4f', 'TlkString'];
      this.format_by_id = ['B', 'b', 'H', 'h', 'I', 'i', 'Q', 'q'];
      this.dataobjects = {};
      if (this._use_float_types) {
        this.format_by_id.push.apply(this.format_by_id, ['f', 'd', '3f', '', '4f', '4f', 'I', '4f', '16f', '2I']);
      } else {
        this.format_by_id.push.apply(this.format_by_id, ['i', 'q', '3i', '', '4i', '4i', 'I', '4i', '16i', '2I']);
      }
      _ref = this.format_by_id;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        format = _ref[i];
        if (i === 11) {
          continue;
        }
        bistr = this._bistruct(format);
        this.dataobjects[this.types_by_id[i]] = this._constructDataObject(bistr);
        this.dataobjects[this.types_by_id[i]].name = this.types_by_id[i];
      }
      bistr = this._bistruct('I');
      this.dataobjects['Reference'] = this._constructDataObject(bistr);
      this.dataobjects['Reference'].name = 'Reference';
      bistr = this._bistruct('II');
      this.dataobjects['Generic'] = this._constructDataObject(bistr);
      this.dataobjects['Generic'].name = 'Generic';
      console.log(this.dataobjects);
    }

    DataTypes.prototype._constructDataObject = function(bistr) {
      return {
        pack: function(endian, bytes) {
          return bistr[endian].pack(bytes.toArray());
        },
        unpack: function(endian, bytes) {
          return bistr[endian].unpack(bytes.toArray());
        },
        size: bistr.size
      };
    };

    DataTypes.prototype.get = function(datatype) {
      if (typeof datatype !== 'string') {
        throw Error('Datatype must be string, was ' + typeof datatype);
      }
      return this.dataobjects[datatype];
    };

    DataTypes.prototype._structtype = function(fourcc, fields, size, name) {
      var structtype;
      structtype = this._structtype1(fourcc, size, name);
      this._structtype2(structtype, fields);
      return structtype;
    };

    DataTypes.prototype._structtype1 = function(fourcc, size, name) {
      var c, _i, _len;
      if (typeof fourcc !== 'string' || fourcc.length !== 4) {
        throw new Error("Bad four character struct type: " + fourcc);
      }
      if (!name) {
        name = 'Struct';
        for (_i = 0, _len = fourcc.length; _i < _len; _i++) {
          c = fourcc[_i];
          if (__indexOf.call(this._structname_chars, c) >= 0) {
            name += c;
          } else {
            name += "_" + c.charCodeAt(0);
          }
        }
      }
      return {
        name: name,
        fourcc: fourcc,
        size: size
      };
    };

    DataTypes.prototype._structtype2 = function(structtype, fields) {
      var field, fieldsbylabel, _i, _len;
      fieldsbylabel = {};
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        fieldsbylabel[field.label] = field;
      }
      structtype.fields = fields;
      structtype.getfieldbylabel = function(label) {
        return this._fieldlabels[label];
      };
      structtype._fieldlabels = fieldsbylabel;
      return structtype;
    };

    DataTypes.prototype._listtype = function(elemtype, indirect) {
      var name;
      indirect = !!indirect;

      /* TODO: Screw typechecking for now. Probably should put back in later
      if elemtype is null
          if not indirect
              throw new Error 'List must be indirect if it has no element type'
      else if elemtype not in @types_by_id and not elemtype instanceof Structure
          throw new Error 'Only primitive types and structures can be composed into lists'
       */
      if (indirect) {
        if (elemtype === null) {
          name = 'ListGeneric';
        } else {
          name = 'ListIndirect' + elemtype;
        }
      } else {
        if (!!elemtype.fourcc) {
          name = 'ListStruct' + elemtype.fourcc;
        } else {
          name = 'List' + elemtype;
        }
      }
      return {
        name: name,
        elem_type: elemtype,
        indirect: indirect
      };
    };

    DataTypes.prototype._bistruct = function(format) {
      var be, create_struct, le, _ref;
      if ((_ref = format[0]) === '<' || _ref === '>' || _ref === '=' || _ref === '!') {
        throw new Error('format cannot dictate byte-order');
      }
      create_struct = function(fmt) {
        return {
          size: JSPack.jspack.CalcLength(fmt),
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

    return DataTypes;

  })();

}).call(this);
