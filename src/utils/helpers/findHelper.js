class findHelper {
  findIndexByProp = (array, prop, propName) => {
    return array.findIndex(element => element[propName] === prop);
  };
}

module.exports = new findHelper();
