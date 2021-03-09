const Strong = window.localStorage;

// 设置
const set = (name, value) => {
    Strong.setItem(name, JSON.stringify(value));
}

// 获取
const get = (name) => {
    return JSON.parse(Strong.getItem(name));
}

// 删除
const remove = (name) => {
    Strong.removeItem(name);
}

// 清空
const clear = () => {
    Strong.clear();
}

export { set, get, remove, clear };