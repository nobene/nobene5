
//   Copyright (c) 2025 Nobene5 authors

//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at

//       http://www.apache.org/licenses/LICENSE-2.0

//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

async function save(name) {
  if ( !document.getElementById(name) ) {
    alert('card has no UID ' + name);
    return;
  };
  var text = document.getElementById(name).innerText;
  if ( text.includes('/DELETE') ) {
    await delete_board();
    return;
  }
  if ( text.includes('?????') ) {
    await delete_card(name);
    return;
  }
  if ( text.includes('==') ) {
    var fontsize = text.split(' ')[0].substring(2,4);
//    alert(fontsize);
    var wra = document.querySelector('.wrapper');
    if ( wra < 16 ) { wra = 16 };
    wra.style.fontSize = fontsize + 'px';
    return;
  };
  if ( text.includes('@@') ) {
    var bname = text.split(' ')[0]
    import_board(bname.substring(2,));
    clone_card(name);
    return;
  }
  if ( text.includes('++') ) {
    var bname1 = text.split(' ')[0]
    if ( bname1.substring(2,) === '' ) {
       alert('empty name of new board');
       return;
    };
    await new_board(bname1.substring(2,));
    return;
  };
  if ( text.includes('>>') ) {
    var bname2 = text.split(' ')[0]
    await import_board(bname2.substring(2,));
    return;
  };
  if ( text.includes('$$') ) {
    var bname3 = text.split(' ')[0]
    act0 = await read_board('store/boards/' + document.title);
    res4 = await write_board('store/boards/' + bname3.substring(2,), act0);
    document.title = bname3.substring(2,);
    await import_board(document.title);
    return;
  };
  document.getElementById(name).innerHTML = text;
  console.log("\n name: " + name + ": " + text);
  var fname = 'store/cards/' + name;
  await write_card(fname, text);
  var cname = document.getElementById(name).className;
  var fname2 = 'store/flags/' + name;
  await write_flag(fname2, cname);
  return;
};

async function new_card(col) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var mid = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ023456789";
  for (var i = 0; i < 19; ++i) {
    mid += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  elem.innerHTML = ' *';
  if ( col === '0' ) {
    elem.innerHTML = "  " + document.title;
    col = '3';
  };
  elem.setAttributeNode(cl);
  cl.value = '';
  elem.setAttributeNode(cedit);
  cedit.value = 'true';
  id.value = mid;
  elem.setAttributeNode(id);
  omo.value = 'save("' + mid + '");'
  odbl.value = 'hide("' + mid + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  document.getElementById(col).appendChild(elem);
  console.log('added brand new card : ' + mid);
  save(mid);
  await write_flag('store/flags/' + mid, '');
  return mid;
};

async function set_card(col, caid) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var ocm = document.createAttribute('oncontextmenu');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var crd = await read_card('store/cards/' + caid);
  var red = false;
  console.log('read card content : ' + crd);
  elem.innerHTML = crd;
  if ( crd.substring(0,3) == '==>' ) {
    ocm.value = 'open_url("' + crd.substring(4,10) + '");'
    elem.setAttributeNode(ocm);
  };
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cedit.value = 'true';
  id.value = caid;
  elem.setAttributeNode(id);
  omo.value = 'save("' + caid + '");'
  odbl.value = 'show_actions("' + caid + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  var flag = await read_flag('store/flags/' + caid);
  if (flag.length > 5) flag = ''
  cl.value = flag;
  if ( red == true ) {
    cl.value = 'red';
  };
  console.log('flag read was : ' + flag);
  document.getElementById(col).appendChild(elem);
  console.log('set new card ' + caid + ' in column : ' + col);
////  export_board();
  return;
};

async function clone_card(mid) {
  var id = document.createAttribute('id');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var crd = await read_card('store/cards/' + mid);
  elem.innerHTML = crd;
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cedit.value = 'true';
  var midnew = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ023456789";
  for (var i = 0; i < 19; ++i) {
    midnew += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  id.value = midnew;
  elem.setAttributeNode(id);
  omo.value = 'save("' + midnew + '");'
  odbl.value = 'hide("' + midnew + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  cl.value = '';
  document.getElementById('3').appendChild(elem);
  console.log('add old card with new id ' + midnew + ' in Column 3');
  await save(midnew);
  await export_board();
  return;
};

async function add_new_url_card(url) {
  var id = document.createAttribute('id');
  var op = document.createAttribute('onclick');
  var cl = document.createAttribute('class');
  var cedit = document.createAttribute('contenteditable');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  var mid = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ023456789";
  for (var i = 0; i < 19; ++i) {
    mid += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  elem.setAttributeNode(cl);
  cl.value = '';
  elem.setAttributeNode(cedit);
  cedit.value = 'true';
  id.value = mid;
  elem.setAttributeNode(id);
  op.value = 'open_link("' + url + '");'
  omo.value = 'save("' + mid + '");'
  odbl.value = 'hide("' + mid + '");'
  elem.setAttributeNode(op);
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  document.getElementById('3').appendChild(elem);
  document.getElementById(mid).innerHTML = '==> ' + url;
  console.log('added new URL card : ' + mid);
  await save(mid);
  await write_flag('store/flags/' + mid, '');
//    if ( result == false ) {
//      console.log('flags file writing error for : ' + mid);
//    };
  await export_board();
};

async function hide_menu() {
  document.getElementById('menu').innerHTML = '';
  document.getElementById('menu').style.display = 'none';
  return;
};

async function show_all_boards() {
  if (document.getElementById('menu').innerHTML != '') {
    hide_menu();
    return;
  };
  var boards = await list_boards();
  var cur = document.title;
  console.log('current BOARD: ' + cur);
  var ls = String(boards).replace(/,/g , ' ');
  var ls1 = ls.split(' ');
  var mn = '<div onclick="hide_menu();"><br><br>';
  for ( x = 0; x < ls1.length; ++x ) {
    if ( ls1[x].includes('bup') ) {
      continue;
    };
    if ( ls1[x].includes('-') ) {
      continue;
    };
    var item = ls1[x].substring(13)
    if ( item == cur ) {
      mn += '<div style="color: #111;" onclick=import_board("' + item + '");>' + item + '</div>';
      continue;
    };
    mn += '<div onclick=import_board("' + item + '");>' + item + '</div>';
  };
  mn += '<div>================</div><div onclick=reload_board();>+[]</div>';
  mn += '<div onclick=export1();>[SAVE]</div><br><br></div>';
  document.getElementById('menu').innerHTML = mn;
  document.getElementById('menu').style.display = 'block';
  item = '';
  return;
};

async function reload_board() {
  await new_card(4);
  await export_board();
  await import_board(document.title);
  return;
};
  
async function hide_actions() {
  document.getElementById('actions').innerHTML = '';
  document.getElementById('actions').style.display = 'none';
  return;
};

async function show_actions(aid) {
  if (document.getElementById('actions').innerHTML != '') {
    hide_actions();
    return;
  };
  var ac = '<div onclick="hide_actions();"><br>';
  ac += '<div onclick=hide("' + aid + '");>Hide</div>';
  ac += '<div onclick=yell("' + aid + '");>Yell</div>';
  ac += '<div onclick=full("' + aid + '");>Full</div>';
  ac += '<div onclick=brief("' + aid + '");>Brief</div><br></div>';
  document.getElementById('actions').innerHTML = ac;
  const target = document.getElementById(aid);
  const rect = target.getBoundingClientRect();
  document.getElementById('actions').style.top = rect.top + 'px';
  document.getElementById('actions').style.left = rect.left + 190 + 'px';
  document.getElementById('actions').style.display = 'block';
  item = '';
  return;
};

async function new_board(name) {
  if ( name.length > 32 ) {
    name = name.substr(0 , 32);
  };
  var boards = await list_boards();
//  console.log('boards dir : ' + boards);
  if ( boards.includes(name) === true ) {
    console.log('Board with name : ' + name + ' already exists, can not create it !');
    return;
  };
  const col1 = document.getElementById('1');
  while (col1.hasChildNodes()) {
    col1.removeChild(col1.firstChild);
  };
  const col2 = document.getElementById('2');
  while (col2.hasChildNodes()) {
    col2.removeChild(col2.firstChild);
  };
  const col3 = document.getElementById('3');
  while (col3.hasChildNodes()) {
    col3.removeChild(col3.firstChild);
  };
  const col4 = document.getElementById('4');
  while (col4.hasChildNodes()) {
    col4.removeChild(col4.firstChild);
  };
  const col5 = document.getElementById('5');
  while (col5.hasChildNodes()) {
    col5.removeChild(col5.firstChild);
  };
  await showtitle(name);
  document.title = name;
  console.log('New Board created : ' + name);
  var cid = await new_card('1');
  var act = '';
  act += cid + '-';
  cid = await new_card('1');
  act += cid + '-';
  cid = await new_card('1');
  act += cid + '-';
  cid = await new_card('1');
  act += cid + '/';
  cid = await new_card('2');
  act += cid + '-';
  cid = await new_card('2');
  act += cid + '-';
  cid = await new_card('2');
  act += cid + '-';
  cid = await new_card('2');
  act += cid + '/';
  cid = await new_card('3');
  act += cid + '-';
  cid = await new_card('3');
  act += cid + '-';
  cid = await new_card('3');
  act += cid + '-';
  cid = await new_card('0');
  act += cid + '/';
  cid = await new_card('4');
  act += cid + '-';
  cid = await new_card('4');
  act += cid + '-';
  cid = await new_card('4');
  act += cid + '-';
  cid = await new_card('4');
  act += cid + '/';
  cid = await new_card('5');
  act += cid + '-';
  cid = await new_card('5');
  act += cid + '-';
  cid = await new_card('5');
  act += cid + '-';
  var emoid = await add_emoset();
  act += emoid;
  var factual = 'store/boards/' + name;
  await write_board(factual, act);
  cid = '0';
  act = '';
//  document.getElementById('in').value = '';
  await export_board();
  var nam1 = document.title;
  console.log("new board from windowtitle :" + nam1);
  return;
};

async function delete_board() {
  var del = await remove_board('store/boards/' + document.title);
  if (del === false) {
    console.log('failed to delete board : ' + document.title);
  };
  import_board('help');
  return;
};

async function import_board(name) {
//  new_board('test');
  if ( name[0] === ' ' ) {
    name = name.substr(1,);
    console.log('==' + name);
  };
  var bact = await read_board('store/boards/' + name);
  if (bact === false) {
    console.log('failed to import board : ' + name);
    alert('no such board: ' + name);
    return;
  };
  await hide_menu();
  const col1 = document.getElementById('1');
  while (col1.hasChildNodes()) {
    col1.removeChild(col1.firstChild);
  };
  const col2 = document.getElementById('2');
  while (col2.hasChildNodes()) {
    col2.removeChild(col2.firstChild);
  };
  const col3 = document.getElementById('3');
  while (col3.hasChildNodes()) {
    col3.removeChild(col3.firstChild);
  };
  const col4 = document.getElementById('4');
  while (col4.hasChildNodes()) {
    col4.removeChild(col4.firstChild);
  };
  const col5 = document.getElementById('5');
  while (col5.hasChildNodes()) {
    col5.removeChild(col5.firstChild);
  };
  try {
    var bd = bact.split('/');
    var c1 = bd[0].split('-');
    var c2 = bd[1].split('-');
    var c3 = bd[2].split('-');
    var c4 = bd[3].split('-');
    var c5 = bd[4].split('-');
  } catch (e) {
    if (e) {
      import_board('help');
      return;
    };
  };
  c1.forEach(set_column1);
  async function set_column1(card1) {
    await set_card('1', card1);
  };
  c2.forEach(set_column2);
  async function set_column2(card2) {
    await set_card('2', card2);
  };
  c3.forEach(set_column3);
  async function set_column3(card3) {
    await set_card('3', card3);
  };
  c4.forEach(set_column4);
  async function set_column4(card4) {
    await set_card('4', card4);
  };
  c5.forEach(set_column5);
  async function set_column5(card5) {
    await set_card('5', card5);
  };
  document.title = name;
  await showtitle(name);
  console.log('imported board : ' + name);
//  document.getElementById('in').value = '';
  document.getElementById('menu').style.display = 'none';
  document.getElementById('actions').style.display = 'none';
  return;
};

async function export1() {
  console.log('exporting current board...');
  await export_board();
  return;
}
async function export_board() {
  var act2 = '';
  var nm = document.title;
  var cn1 = await document.getElementById('1').childNodes;
  for ( var i = 0; i < cn1.length; i++) {
    act2 += cn1[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn2 = await document.getElementById('2').childNodes;
  for ( var i = 0; i < cn2.length; i++) {
    act2 += cn2[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn3 = await document.getElementById('3').childNodes;
  for ( var i = 0; i < cn3.length; i++) {
    act2 += cn3[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn4 = await document.getElementById('4').childNodes;
  for ( var i = 0; i < cn4.length; i++) {
    act2 += cn4[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  act2 += '/';
  var cn5 = await document.getElementById('5').childNodes;
  for ( var i = 0; i < cn5.length; i++) {
    act2 += cn5[i].id + '-';
  };
  act2 = act2.substr(0 , act2.length - 1);
  console.log('Actual to export : ' + act2);
//  var nm1 = nm.trimStart();
//  var nm2 = nm1.trimEnd();
  var res2 = await copy_file('store/boards/' + nm, 'store/boards/' + nm + '-bup');
  if ( res2 == 0 ) {
    console.log('actual backup  fs writing error in export : ' + nm);
  };
  var res3 = await write_board('store/boards/' + nm, act2);
  if ( res3 == false ) {
    console.log('actual file writing error in export : ' + nm);
  };
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const date = new Date();
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const dstr = `${day}${month}${year}`;
  var res4 = await write_board('store/boards/' + nm + '-' + dstr, act2);
  if ( res4 == false ) {
    console.log('actual file writing error in export : ' + nm + '-' + dstr);
  };
  act2 = '';
  var res5 = await create_dir('store/' + dstr);
  var cards = await read_dir('store/cards');
//  console.log('cards[] : ', cards);
  cards.forEach(copy_card);
//  return;
  async function copy_card(cr) {
    cr = cr.substring(12,)
    console.log(cr);
    var res6 = await copy_file('store/cards/' + cr, 'store/' + dstr+ '/' + cr);
    if ( res6 == 0 ) {
      console.log('card file writing error in export to dated dir : ' + dstr + '/' + cr);
    };
  };
  console.log('exported board : ' + nm + ' : OK');
  nm = '';
//  document.getElementById('in').value = '';
  return;
};

async function readkb(val) {
  console.log('read from CLI : ' + val);
  if ( val === 'q' || val === 'quit' ) {
    var r = await quit_app();
    return;
  };
  if ( val === '/delete' ) {
    await delete_board();
    return;
  };
  if ( val === '/' ) {
    await show_all_boards();
    return;
  };
  if ( val === '>>' ) {
    await export_board();
    return;
  };
  if ( val === '=0' ) {
    const e0 = document.querySelector('.wrapper');
    e0.style.fontSize = '20px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=1' ) {
    const e1 = document.querySelector('.wrapper');
    e1.style.fontSize = '23px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=2' ) {
    const e2 = document.querySelector('.wrapper');
    e2.style.fontSize = '26px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=3' ) {
    const e3 = document.querySelector('.wrapper');
    e3.style.fontSize = '32px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=4' ) {
    const e4 = document.querySelector('.wrapper');
    e4.style.fontSize = '38px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=5' ) {
    const e5 = document.querySelector('.wrapper');
    e5.style.fontSize = '42px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val === '=6' ) {
    const e6 = document.querySelector('.wrapper');
    e6.style.fontSize = '46px';
    document.getElementById('in').value = '';
    return;
  };
  if ( val[0] == '+' && val[1] == '+' && val.length == 21 ) {
    await clone_card(val.substring(2,));
    console.log('added existing card with id : ' + val.substring(2,));
    return;
   };
  if ( val[0] == '+' && val.length > 2 ) {
    if (/\s/.test(val)) {
      console.log('new board name can not contain space(s)');
      return;
    };
    await new_board(val.substring(1,));
    console.log('added new board with name : ' + val.substring(1,));
    return;
   };
  if ( val[0] == '=' && val.length > 2 ) {
    if (/\s/.test(val)) {
      console.log('newly changed board name can not contain space(s)');
      return;
    };
    await copy_file('store/boards/' + document.title, 'store/boards/' + val.substring(1,));
    await showtitle(val.substring(1,));
    document.title = val.substring(1,);
    await export_board();
    console.log('changed board name to : ' + val.substring(1,));
    return;
   };
  if ( val[0] == '#' ) {
    await add_new_url_card(val.substring(1,));
    return;
  };
  val2 = val.substring(1,);
  if ( val[0] === '+' ) {
    if (val2 === '1') {
      await new_card('1');
      await export_board();
    };
    if (val2 === '2') {
      await new_card('2');
      await export_board();
    };
    if (val2 === '3') {
      await new_card('3');
      await export_board();
    };
    if (val2 === '4') {
      await new_card('4');
      await export_board();
    };
    if (val2 === '5') {
      await new_card('5');
      await export_board();
    };
  };
  if ( val[0] == '>' ) {
    await import_board(val.substring(1,));
  };
  document.getElementById('in').value = val;
  console.log("val : " + val);
  val = '';
  val2 = '';
  document.getElementById('in').value = '';
  return;
};

async function hide(name) {
  const element = document.getElementById(name);
  element.className = 'hid';
  await write_flag('store/flags/' + name, 'hid');
  return;
};

async function yell(name) {
  const element = document.getElementById(name);
  element.className = 'yell';
  await write_flag('store/flags/' + name, 'yell');
  return;
};

async function brief(name) {
  const element = document.getElementById(name);
  element.className = '';
  await write_flag('store/flags/' + name, '');
  return;
};

//  if (element.className == 'red' ) {
//    element.className = '';
//    var resul = await write_flag('store/flags/' + name, '');
//    if ( resul == false ) {
//      console.log('flags file writing error : ' + name);
//    };
//  }
//  return;
//};

async function delete_card(name) {
  var dcard = document.getElementById(name)
  dcard.remove();
  await export_board();
  console.log('deleted card : ' + name);
  return;
};

async function add_emoset() {
  var id = document.createAttribute('id');
  var cedit = document.createAttribute('contenteditable');
  var cl = document.createAttribute('class');
  var omo = document.createAttribute('onmouseout');
  var odbl = document.createAttribute('ondblclick');
  var elem = document.createElement('div');
  elem.innerText = '______________________';
  elem.setAttributeNode(cedit);
  elem.setAttributeNode(cl);
  cl.value = '';
  cedit.value = 'true';
  var mid3 = "";
  const possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ023456789";
  for (var i = 0; i < 16; ++i) {
    mid3 += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  mid3 = '000' + mid3;
  id.value = mid3;
  elem.setAttributeNode(id);
  omo.value = 'save("' + mid3 + '");'
  odbl.value = 'hide("' + mid3 + '");'
  elem.setAttributeNode(omo);
  elem.setAttributeNode(odbl);
  elem.setAttributeNode(cl);
  document.getElementById('5').appendChild(elem);
  console.log('added emocard : ' + mid3);
  await save(mid3);
  return mid3;
};

//async function save_url(url) {
  //var uid =
//  await add_new_url_card(url);
//  var res6 = await write_url('store/urls/' + uid, url);
//    if ( res6 == false ) {
//      console.log('short_URL file writing error : ' + uid);
//    };
//  return;
//};

async function open_url(uid) {
  console.log('clicked to open URL : ' + uid);
  console.log('open_url with UID : ' + uid);
  var url = await read_url('store/urls/' + uid);
  if (url === false) {
    console.log('failed to read URL file : ' + uid);
    return;
  };
  console.log("we open: " + uid);
  return;
};

