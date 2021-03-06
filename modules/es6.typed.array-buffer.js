'use strict';
if(require('./_descriptors')){
  var $export      = require('./_export')
    , $typed       = require('./_typed')
    , buffer       = require('./_typed-buffer')
    , anObject     = require('./_an-object')
    , toIndex      = require('./_to-index')
    , toLength     = require('./_to-length')
    , isObject     = require('./_is-object')
    , TYPED_ARRAY  = require('./_wks')('typed_array')
    , speciesConstructor = require('./_species-constructor')
    , $ArrayBuffer = buffer.ArrayBuffer
    , $DataView    = buffer.DataView
    , $slice       = $ArrayBuffer && $ArrayBuffer.prototype.slice
    , VIEW         = $typed.VIEW
    , ARRAY_BUFFER = 'ArrayBuffer';

  $export($export.G + $export.W + $export.F * !$typed.ABV, {ArrayBuffer: $ArrayBuffer});

  $export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
    // 24.1.3.1 ArrayBuffer.isView(arg)
    isView: function isView(it){ // not cross-realm
      return isObject(it) && VIEW in it;
    }
  });

  $export($export.P + $export.U + $export.F * require('./_fails')(function(){
    return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
  }), ARRAY_BUFFER, {
    // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
    slice: function slice(start, end){
      if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
      var len    = anObject(this).byteLength
        , first  = toIndex(start, len)
        , final  = toIndex(end === undefined ? len : end, len)
        , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
        , viewS  = new $DataView(this)
        , viewT  = new $DataView(result)
        , index  = 0;
      while(first < final){
        viewT.setUint8(index++, viewS.getUint8(first++));
      } return result;
    }
  });
}