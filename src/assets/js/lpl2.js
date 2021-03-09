//1.删除数组中的对象
//Array.prototype 构造新的数组方法 => Array.prototype.方法名

Array.prototype.removeByValue = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (JSON.stringify(this[i]).indexOf(JSON.stringify(val)) != -1) {
      this.splice(i, 1);
      break;
    }
  }
};


/** 
        var bs = { username: "da", password: "123456" };
        test2.user.removeByValue(bs);
        console.log(test2.user);
*/

// 2.判断数组中是否有某一个对象
function isHasObj (arr, val) {
  var flag = 0;//1为有 0为没有
  for (var i = 0; i < arr.length; i++) {
    if (JSON.stringify(arr[i]).indexOf(JSON.stringify(val)) != -1) {
      flag = 1;
    }
  }
  if (flag == 1) {
    return true;
  } else {
    return false;
  }
}
/**
 *   用法
 * var as = [
    { id: 1, name: "yang" },
    { id: 2, name: "xiao" },
    { id: 3, name: "qi" }
  ];
  var bs = { id: 1, name: "yang" };
  console.log(isHasObj(as, bs));
 */
export { isHasObj };