/*

EnyaSMC provides the computation API and SDK for 
your app enabling privately computation on sensitive data.

Blockdoc
help@blockdoc.com
version 1.0.0 DEC 25, 2019

*/

const math = require("mathjs");
const api = require("./API");

var _0x4984=['\x41\x63\x63\x65\x73\x73\x54\x6f\x6b\x65\x6e','\x41\x6c\x67\x6f\x72\x69\x74\x68\x6d','\x42\x69\x74\x6c\x65\x6e\x67\x74\x68'];
(function(_0x59b15d,_0x51930e){var _0x35c938=function(_0x10e94e){while(--_0x10e94e){_0x59b15d['push'](_0x59b15d['shift']());}};_0x35c938(++_0x51930e);}(_0x4984,0xab));
var _0x357f=function(_0x59b15d,_0x51930e){_0x59b15d=_0x59b15d-0x0;var _0x35c938=_0x4984[_0x59b15d];return _0x35c938;};
exports['\x63\x6f\x6e\x66\x69\x67\x75\x72\x65']=function(_0x3a2238){valid_token=_0x3a2238[_0x357f('0x0')];
model_name=_0x3a2238[_0x357f('0x1')];if(typeof _0x3a2238[_0x357f('0x2')]=='\x75\x6e\x64\x65\x66\x69\x6e\x65\x64'){bitlength=0x8;}else{bitlength=_0x3a2238[_0x357f('0x2')];}};
var _0x17db=['\x73\x6c\x69\x63\x65','\x6c\x65\x6e\x67\x74\x68','\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'];
(function(_0x257448,_0x5bdc85){var _0x35fed9=function(_0x117331){while(--_0x117331){_0x257448['push'](_0x257448['shift']());}};
_0x35fed9(++_0x5bdc85);}(_0x17db,0xaa));var _0x4486=function(_0x257448,_0x5bdc85){_0x257448=_0x257448-0x0;var _0x35fed9=_0x17db[_0x257448];return _0x35fed9;};
exports['\x69\x6e\x70\x75\x74']=function(){user_info=Array[_0x4486('0x0')][_0x4486('0x1')]['\x63\x61\x6c\x6c'](arguments);user_shape=[0x1,user_info[_0x4486('0x2')]];};
var _0x22a8=['\x73\x70\x6c\x69\x74','\x6c\x65\x6e\x67\x74\x68'];
(function(_0x2e9bc9,_0x2e3077){var _0x895254=function(_0x91a269){while(--_0x91a269){_0x2e9bc9['push'](_0x2e9bc9['shift']());}};_0x895254(++_0x2e3077);}(_0x22a8,0x1c4));
var _0x546d=function(_0x2e9bc9,_0x2e3077){_0x2e9bc9=_0x2e9bc9-0x0;var _0x895254=_0x22a8[_0x2e9bc9];return _0x895254;};
const compute_decimal=function(_0x2e3077){decimal=0x0;for(var _0x895254=0x0;_0x895254<_0x2e3077['\x6c\x65\x6e\x67\x74\x68'];_0x895254++)
{s=_0x2e3077[_0x895254]['\x74\x6f\x53\x74\x72\x69\x6e\x67']()[_0x546d('0x0')]('\x2e');if(s[_0x546d('0x1')]>0x1){if(s[0x1][_0x546d('0x1')]>decimal){decimal=s[0x1][_0x546d('0x1')];}}}return decimal;};
var _0x3935=['\x72\x61\x6e\x64\x6f\x6d','\x70\x75\x73\x68','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x47\x65\x6e\x65\x72\x61\x74\x65\x64\x20\x72\x61\x6e\x64\x6f\x6d\x20\x69\x64\x20\x2d\x2d\x20',
'\x52\x65\x71\x75\x65\x73\x74\x5f\x4b\x65\x79\x73','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x52\x65\x74\x72\x69\x65\x76\x65\x64\x20\x74\x77\x6f\x20\x41\x50\x49\x20\x6b\x65\x79\x73\x2e','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x72\x65\x74\x72\x69\x65\x76\x65\x20\x74\x77\x6f\x20\x41\x50\x49\x20\x6b\x65\x79\x73\x2c\x20\x70\x6c\x65\x61\x73\x65\x20\x63\x68\x65\x63\x6b\x20\x79\x6f\x75\x72\x20\x74\x6f\x6b\x65\x6e\x20\x6f\x72\x20\x63\x6f\x6e\x74\x61\x63\x74\x20\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x20\x3c\x68\x65\x6c\x70\x40\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x2e\x63\x6f\x6d\x3e',
'\x64\x61\x74\x61','\x74\x6f\x6b\x65\x6e\x31','\x74\x6f\x6b\x65\x6e\x32','\x67\x65\x74\x5f\x62\x65\x61\x76\x65\x72\x5f\x74\x72\x69\x70\x6c\x65',
'\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x55\x70\x64\x61\x74\x65\x64\x20\x61\x6e\x64\x20\x72\x65\x74\x72\x69\x65\x76\x65\x64\x20\x75\x73\x65\x72\x20\x42\x65\x61\x76\x65\x72\x20\x74\x72\x69\x70\x6c\x65\x2e',
'\x6c\x65\x6e\x67\x74\x68','\x54\x68\x65\x20\x6c\x65\x6e\x67\x74\x68\x20\x6f\x66\x20\x75\x73\x65\x72\x5f\x69\x6e\x70\x75\x74\x20\x77\x61\x73\x20\x64\x69\x66\x66\x65\x72\x65\x6e\x74\x20\x66\x72\x6f\x6d\x20\x74\x68\x65\x20\x6c\x65\x6e\x67\x74\x68\x20\x6f\x66\x20\x63\x6f\x65\x66\x66\x69\x63\x69\x65\x6e\x74\x73\x2c\x20\x70\x6c\x65\x61\x73\x65\x20\x63\x68\x65\x63\x6b\x21',
'\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x53\x65\x72\x76\x65\x72\x20\x72\x65\x74\x72\x69\x65\x76\x65\x64\x20\x42\x65\x61\x76\x65\x72\x20\x74\x72\x69\x70\x6c\x65\x2e',
'\x67\x65\x74\x5f\x72\x61\x6e\x64\x6f\x6d\x5f\x73\x68\x61\x72\x65',
'\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x73\x65\x6e\x64\x20\x61\x6e\x64\x20\x67\x65\x74\x20\x72\x61\x6e\x64\x6f\x6d\x20\x73\x68\x61\x72\x65\x2e','\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x5f\x73\x68\x61\x72\x65\x5f\x66\x6f\x72\x5f\x75\x73\x65\x72',
'\x64\x69\x66\x66\x65\x72\x65\x6e\x63\x65','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x53\x65\x6e\x74\x20\x61\x6e\x64\x20\x67\x6f\x74\x20\x61\x6d\x31\x2c\x20\x62\x6d\x31\x2e','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x73\x65\x6e\x64\x20\x61\x6e\x64\x20\x67\x65\x74\x20\x61\x6d\x31\x2c\x20\x62\x6d\x31\x2e',
'\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x5f\x61\x5f\x64\x69\x66\x66','\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x5f\x62\x5f\x64\x69\x66\x66','\x61\x64\x64','\x73\x75\x6d','\x70\x72\x6f\x64','\x67\x65\x74\x5f\x64\x6f\x74\x5f\x70\x72\x6f\x64\x75\x63\x74','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x47\x6f\x74\x20\x64\x6f\x74\x20\x70\x72\x6f\x64\x75\x63\x74\x20\x66\x72\x6f\x6d\x20\x73\x65\x72\x76\x65\x72\x2e','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x67\x65\x74\x20\x64\x6f\x74\x20\x70\x72\x6f\x64\x75\x63\x74\x20\x66\x72\x6f\x6d\x20\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x2e',
'\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x5f\x64\x70','\x30\x78\x33','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x69\x6e\x69\x73\x68\x65\x64\x20\x63\x6f\x6d\x70\x75\x74\x61\x74\x69\x6f\x6e\x21','\x4c\x69\x6e\x65\x61\x72','\x75\x6e\x64\x65\x66\x69\x6e\x65\x64','\x50\x6c\x65\x61\x73\x65\x20\x69\x6e\x70\x75\x74\x20\x75\x73\x65\x72\x20\x69\x6e\x66\x6f\x20\x66\x69\x72\x73\x74','\x6c\x6f\x67','\x50\x6c\x65\x61\x73\x65\x20\x65\x6e\x74\x65\x72\x20\x74\x68\x65\x20\x6e\x61\x6d\x65\x20\x6f\x66\x20\x79\x6f\x75\x72\x20\x61\x6c\x67\x6f\x72\x69\x74\x68\x6d',
'\x50\x6c\x65\x61\x73\x65\x20\x65\x6e\x74\x65\x72\x20\x61\x63\x63\x65\x73\x73\x20\x74\x6f\x6b\x65\x6e','\x53\x65\x72\x76\x65\x72\x50\x69\x6e\x67','\x73\x74\x61\x74\x75\x73','\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x63\x6f\x6e\x6e\x65\x63\x74\x20\x74\x68\x65\x20\x73\x65\x72\x76\x65\x72\x2c\x20\x70\x6c\x65\x61\x73\x65\x20\x63\x6f\x6e\x74\x61\x63\x74\x20\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x20\x3c\x68\x65\x6c\x70\x40\x62\x6c\x6f\x63\x6b\x64\x6f\x63\x2e\x63\x6f\x6d\x3e','\x70\x6f\x77','\x73\x75\x62\x74\x72\x61\x63\x74',
'\x6d\x75\x6c\x74\x69\x70\x6c\x79','\x72\x61\x6e\x64\x6f\x6d\x49\x6e\x74','\x73\x68\x69\x66\x74','\x30\x78\x30','\x30\x78\x31','\x30\x78\x32','\x74\x6f\x53\x74\x72\x69\x6e\x67'];
(function(_0x4e834f,_0x144f2f){var _0x5af956=function(_0xfccab8){while(--_0xfccab8){_0x4e834f['push'](_0x4e834f['shift']());}};
_0x5af956(++_0x144f2f);}(_0x3935,0x81));var _0x3972=function(_0x4e834f,_0x144f2f){_0x4e834f=_0x4e834f-0x0;var _0x5af956=_0x3935[_0x4e834f];return _0x5af956;};
exports[_0x3972('0x0')]=async function(){var _0x41361f={'\x73\x74\x61\x74\x75\x73\x5f\x63\x6f\x64\x65':0x194};
if(typeof user_info==_0x3972('0x1')){console['\x6c\x6f\x67'](_0x3972('0x2'));return _0x41361f;}if(typeof model_name=='\x75\x6e\x64\x65\x66\x69\x6e\x65\x64'){console[_0x3972('0x3')](_0x3972('0x4'));return _0x41361f;}
if(typeof valid_token==_0x3972('0x1')){console[_0x3972('0x3')](_0x3972('0x5'));return _0x41361f;}
const _0x32c872=await api[_0x3972('0x6')]({'\x75\x75\x69\x64':'\x53\x65\x72\x76\x65\x72\x43\x6f\x6e\x6e\x65\x63\x74\x54\x65\x73\x74'});if(_0x32c872[_0x3972('0x7')]==0xc9){console[_0x3972('0x3')]('\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x53\x65\x72\x76\x65\x72\x20\x63\x6f\x6e\x6e\x65\x63\x74\x65\x64\x2c\x20\x53\x74\x61\x72\x74\x69\x6e\x67\x20\x73\x65\x63\x75\x72\x65\x20\x6c\x69\x6e\x65\x61\x72\x20\x72\x65\x67\x72\x65\x73\x73\x69\x6f\x6e\x20\x63\x6f\x6d\x70\x75\x74\x61\x74\x69\x6f\x6e');}else{console[_0x3972('0x3')](_0x3972('0x8'));return _0x2f3b01;}var _0x3bf144=[_0x3972('0x9'),_0x3972('0xa'),_0x3972('0xb'),_0x3972('0xc')];
(function(_0x1877b6,_0x52b420){var _0x3e7b4b=function(_0x4ff0ff){while(--_0x4ff0ff){_0x1877b6['\x70\x75\x73\x68'](_0x1877b6[_0x3972('0xd')]());}};_0x3e7b4b(++_0x52b420);}(_0x3bf144,0x1e2));
var _0x13723d=function(_0x1dbd3b,_0x2531fa){_0x1dbd3b=_0x1dbd3b-0x0;var _0xe31873=_0x3bf144[_0x1dbd3b];return _0xe31873;};decimal=compute_decimal(user_info);user_info=math[_0x13723d(_0x3972('0xe'))](user_info,math[_0x3972('0x9')](0xa,decimal));
random_share_for_blockdoc=math[_0x13723d(_0x3972('0xf'))](user_shape,0x0,math[_0x13723d(_0x3972('0x10'))](0x2,bitlength))[0x0];random_share_user_retain=math[_0x13723d('\x30\x78\x33')](user_info,random_share_for_blockdoc);var _0x37c11d=[_0x3972('0x11'),'\x73\x75\x62\x73\x74\x72\x69\x6e\x67',_0x3972('0x12')];(function(_0x44fe95,_0x2710fd){var _0x32058d=function(_0x2f6430){while(--_0x2f6430){_0x44fe95[_0x3972('0x13')](_0x44fe95[_0x3972('0xd')]());}};_0x32058d(++_0x2710fd);}(_0x37c11d,0xb3));
var _0x3349b9=function(_0x572e3e,_0x1c010b){_0x572e3e=_0x572e3e-0x0;var _0x508afc=_0x37c11d[_0x572e3e];return _0x508afc;};
id=Math[_0x3349b9('\x30\x78\x30')]()[_0x3349b9(_0x3972('0xf'))](0x24)[_0x3349b9(_0x3972('0x10'))](0x2,0xf)+Math[_0x3349b9(_0x3972('0xe'))]()[_0x3972('0x11')](0x24)[_0x3349b9(_0x3972('0x10'))](0x2,0xf);console[_0x3972('0x3')](_0x3972('0x14')+id);const _0x407ad6=await api[_0x3972('0x15')]({'\x74\x6f\x6b\x65\x6e':valid_token});
if(_0x407ad6['\x73\x74\x61\x74\x75\x73']==0xc9){console['\x6c\x6f\x67'](_0x3972('0x16'));}else{console[_0x3972('0x3')](_0x3972('0x17'));return _0x41361f;}const _0x284226=_0x407ad6[_0x3972('0x18')][_0x3972('0x19')];const _0x32e8c3=_0x407ad6[_0x3972('0x18')][_0x3972('0x1a')];
const _0xdeeaa0=await api[_0x3972('0x1b')](_0x284226,{'\x74\x6f\x6b\x65\x6e':valid_token,'\x6e\x61\x6d\x65':'\x75\x73\x65\x72','\x63\x6f\x65\x66\x66\x5f\x6e\x61\x6d\x65':model_name,'\x62\x69\x74\x6c\x65\x6e\x67\x74\x68':bitlength,'\x69\x64':id});if(_0xdeeaa0[_0x3972('0x7')]==0xc9){console['\x6c\x6f\x67'](_0x3972('0x1c'));}else{console[_0x3972('0x3')]('\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x46\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x75\x70\x64\x61\x74\x65\x20\x61\x6e\x64\x20\x72\x65\x74\x72\x69\x65\x76\x65\x20\x75\x73\x65\x72\x20\x42\x65\x61\x76\x65\x72\x20\x74\x72\x69\x70\x6c\x65\x2e\x20'+_0xdeeaa0[_0x3972('0x18')]);return _0x41361f;}const _0x1f32db=_0xdeeaa0[_0x3972('0x18')];const _0x44a49a=_0x1f32db['\x6d\x31'];const _0xed4f29=_0x1f32db['\x6d\x32'];if(_0x44a49a['\x6c\x65\x6e\x67\x74\x68']!=user_info[_0x3972('0x1d')]){console[_0x3972('0x3')](_0x3972('0x1e'));return _0x41361f;}const _0x300333=await api['\x61\x73\x6b\x5f\x62\x65\x61\x76\x65\x72\x5f\x74\x72\x69\x70\x6c\x65'](_0x32e8c3,{'\x69\x64':id});if(_0x300333[_0x3972('0x7')]==0xc9){console[_0x3972('0x3')](_0x3972('0x1f'));}else{console[_0x3972('0x3')]('\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x53\x65\x72\x76\x65\x72\x20\x66\x61\x69\x6c\x65\x64\x20\x74\x6f\x20\x72\x65\x74\x72\x69\x65\x76\x65\x20\x42\x65\x61\x76\x65\x72\x20\x74\x72\x69\x70\x6c\x65\x2e');return _0x41361f;}const _0x3fe361=await api[_0x3972('0x20')](_0x32e8c3,{'\x69\x64':id,'\x74\x6f\x6b\x65\x6e':valid_token,'\x75\x73\x65\x72\x5f\x72\x61\x6e\x64\x6f\x6d\x5f\x73\x68\x61\x72\x65':random_share_for_blockdoc,'\x62\x69\x74\x6c\x65\x6e\x67\x74\x68':bitlength,'\x63\x6f\x65\x66\x66\x5f\x6e\x61\x6d\x65':model_name});if(_0x3fe361[_0x3972('0x7')]==0xc9){console[_0x3972('0x3')]('\x45\x6e\x79\x61\x53\x4d\x43\x3a\x20\x53\x65\x6e\x74\x20\x61\x6e\x64\x20\x67\x6f\x74\x20\x72\x61\x6e\x64\x6f\x6d\x20\x73\x68\x61\x72\x65\x2e');}else{console['\x6c\x6f\x67'](_0x3972('0x21'));return _0x41361f;}var _0xc24ad3=[_0x3972('0x22')];(function(_0x23c237,_0x17863c){var _0x3b2ce7=function(_0x21df56){while(--_0x21df56){_0x23c237[_0x3972('0x13')](_0x23c237[_0x3972('0xd')]());}};_0x3b2ce7(++_0x17863c);}(_0xc24ad3,0xca));var _0x3ca0ff=function(_0xf626df,_0x3b79e2){_0xf626df=_0xf626df-0x0;var _0x3c737f=_0xc24ad3[_0xf626df];return _0x3c737f;};const _0x2296bf=_0x3fe361['\x64\x61\x74\x61'][_0x3ca0ff(_0x3972('0xe'))];var _0xec266e=[_0x3972('0xa')];(function(_0x2a2b43,_0x838855){var _0x46513c=function(_0x57844f){while(--_0x57844f){_0x2a2b43[_0x3972('0x13')](_0x2a2b43['\x73\x68\x69\x66\x74']());}};_0x46513c(++_0x838855);}(_0xec266e,0x102));var _0x29bf2e=function(_0x437cec,_0x5b97d4){_0x437cec=_0x437cec-0x0;var _0x1bd7a8=_0xec266e[_0x437cec];return _0x1bd7a8;};const _0x48b67f=math[_0x3972('0xa')](random_share_user_retain,_0x44a49a);const _0x4a705c=math[_0x29bf2e('\x30\x78\x30')](_0x2296bf,_0xed4f29);const _0x44a345=await api[_0x3972('0x23')](_0x32e8c3,{'\x69\x64':id,'\x75\x73\x65\x72\x5f\x64\x69\x66\x66':[_0x48b67f,_0x4a705c]});if(_0x44a345[_0x3972('0x7')]==0xc9){console['\x6c\x6f\x67'](_0x3972('0x24'));}else{console[_0x3972('0x3')](_0x3972('0x25'));return _0x41361f;}var _0x1ad488=[_0x3972('0x26'),_0x3972('0x18'),_0x3972('0x27')];(function(_0x59947d,_0x1cb00b){var _0x41dbfc=function(_0x1e582a){while(--_0x1e582a){_0x59947d[_0x3972('0x13')](_0x59947d[_0x3972('0xd')]());}};_0x41dbfc(++_0x1cb00b);}(_0x1ad488,0x69));var _0x590a5e=function(_0x1559e7,_0x3a068b){_0x1559e7=_0x1559e7-0x0;var _0x10ed20=_0x1ad488[_0x1559e7];return _0x10ed20;};const _0xaed6b6=_0x44a345[_0x3972('0x18')][_0x590a5e(_0x3972('0xe'))];const _0x25c705=_0x44a345[_0x590a5e('\x30\x78\x31')][_0x590a5e(_0x3972('0x10'))];var _0x3bcd32=[_0x3972('0x28')];(function(_0x5650af,_0x29d878){var _0x169481=function(_0xf39c){while(--_0xf39c){_0x5650af[_0x3972('0x13')](_0x5650af[_0x3972('0xd')]());}};_0x169481(++_0x29d878);}(_0x3bcd32,0x17f));var _0x2af2f5=function(_0x2b78af,_0x261376){_0x2b78af=_0x2b78af-0x0;var _0x35d257=_0x3bcd32[_0x2b78af];return _0x35d257;};const _0x586a11=math[_0x2af2f5(_0x3972('0xe'))](_0x48b67f,_0xaed6b6);const _0x490150=math[_0x2af2f5('\x30\x78\x30')](_0x4a705c,_0x25c705);var _0x50d2ae=[_0x3972('0x29'),_0x3972('0x2a'),'\x6d\x75\x6c\x74\x69\x70\x6c\x79'];(function(_0xf830c5,_0x5629a7){var _0x562e15=function(_0x3ed252){while(--_0x3ed252){_0xf830c5[_0x3972('0x13')](_0xf830c5[_0x3972('0xd')]());}};_0x562e15(++_0x5629a7);}(_0x50d2ae,0x1c7));var _0x37b9dc=function(_0x2c2089,_0x3a2bf5){_0x2c2089=_0x2c2089-0x0;var _0x2a685d=_0x50d2ae[_0x2c2089];return _0x2a685d;};const _0x3f7ba4=math['\x6d\x75\x6c\x74\x69\x70\x6c\x79'](_0x490150,random_share_user_retain);const _0x2b7916=math[_0x37b9dc(_0x3972('0xe'))](_0x2296bf,_0x586a11);const _0x8b02f6=math[_0x37b9dc('\x30\x78\x31')](_0x1f32db[_0x37b9dc(_0x3972('0x10'))]);const _0x1d9bef=math[_0x37b9dc(_0x3972('0xe'))](_0x490150,_0x586a11);const _0x446ce2=math[_0x3972('0xa')](math['\x61\x64\x64'](_0x3f7ba4,_0x2b7916,_0x8b02f6),_0x1d9bef);const _0x1874e2=await api[_0x3972('0x2b')](_0x32e8c3,{'\x69\x64':id});if(_0x1874e2[_0x3972('0x7')]==0xc9){console[_0x3972('0x3')](_0x3972('0x2c'));}else{console[_0x3972('0x3')](_0x3972('0x2d'));return _0x2f3b01;}var _0x461b93=['\x61\x64\x64',_0x3972('0x9'),_0x3972('0x18'),_0x3972('0x2e')];(function(_0x415bd4,_0x3efad5){var _0xbc397b=function(_0x575785){while(--_0x575785){_0x415bd4[_0x3972('0x13')](_0x415bd4[_0x3972('0xd')]());}};_0xbc397b(++_0x3efad5);}(_0x461b93,0xfa));var _0x3c4b3b=function(_0x56a62b,_0x38123b){_0x56a62b=_0x56a62b-0x0;var _0x4f6fcb=_0x461b93[_0x56a62b];return _0x4f6fcb;};const _0x59d222=_0x1874e2[_0x3c4b3b(_0x3972('0xe'))][_0x3c4b3b(_0x3972('0xf'))];const _0x256d75=math[_0x3c4b3b(_0x3972('0x10'))](_0x446ce2,_0x59d222)/math[_0x3c4b3b(_0x3972('0x2f'))](0xa,decimal);var _0x2f3b01=0xc8;console[_0x3972('0x3')](_0x3972('0x30'));return{'\x73\x65\x63\x75\x72\x65\x5f\x72\x65\x73\x75\x6c\x74':_0x256d75,'\x73\x74\x61\x74\x75\x73\x5f\x63\x6f\x64\x65':_0x2f3b01};};
