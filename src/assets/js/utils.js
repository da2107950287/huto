export function isEmail(value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if (value == '' || value == undefined || value == null) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}
export function createUniqueId(n) {
  n = 1; // 生成一个唯一id，包含数字和字母
  var random = function() {
    // 生成10-12位不等的字符串
    return Number(
      Math.random()
        .toString()
        .substr(2)
    ).toString(36); // 转换成十六进制
  };
  var arr = [];
  function createId() {
    var num = random();
    var _bool = false;
    arr.forEach(v => {
      if (v === num) _bool = true;
    });
    if (_bool) {
      createId();
    } else {
      arr.push(num);
    }
  }
  var i = 0;
  while (i < n) {
    createId();
    i++;
  }
  // this.uniqueId = arr[0]; // 将生成的转为我们需要的字符串并赋值
  console.log(arr[0])
  return arr[0];
}
export function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = Math.floor(Math.random() * i--);
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}
export function setStore(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}
export function getStore(key) {
  return JSON.parse(window.localStorage.getItem(key))
}
export function removeStore(key) {
  window.localStorage.removeItem(key)
}
export function clearStore(){
  window.localStorage.clear()
}
