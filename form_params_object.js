function FormParamsObject(object) {
  this.objectInstance = object;
  this.getFullObject = function () {
    return this.objectInstance;
  };
  this.convertObjectToArray = function (propPath) {
    const keysArray = propPath.split(".");
    const objectLikeArray = keysArray.reduce((accumulator, currentValue) => {
      if (accumulator && accumulator[currentValue])
        return accumulator[currentValue];
      else return null;
    }, this.objectInstance);

    let resArr = [];
    let keysOfOurObject = [];
    for (let item in objectLikeArray) {
      keysOfOurObject.push(item);
      for (let item2 of objectLikeArray[item]) {
        const newObj = {};
        newObj[item] = item2;
        resArr.push(newObj);
      }
    }

    let arrProps = [];

    for (let item of keysOfOurObject) {
      let arrayWithThisKey = resArr.filter((x) => {
        if (Object.keys(x)[0] == item) {
          return x;
        }
      });
      arrProps.push(arrayWithThisKey);
    }

    let objectButShoulBeArray = arrProps.reduce((accumulator, currentValue) => {
      return merge(accumulator, currentValue);
    }, {});

    let valuesFromObject = Object.values(objectButShoulBeArray);

    this.setObjectProperty(propPath, null);
    this.setObjectProperty(propPath, valuesFromObject);
  };

  this.getObjectProperty = function (propPath) {
    let keysArray = propPath.split(".");
    return keysArray.reduce((accumulator, currentValue) => {
      if (accumulator && accumulator[currentValue])
        return accumulator[currentValue];
      else return null;
    }, this.objectInstance);
  };

  this.setObjectProperty = function (propPath, value) {
    let keys = propPath.split(".");
    let res = keys.reduceRight((value, key) => {
      let accumulator = { [key]: value };
      return accumulator;
    }, value);

    merge(this.objectInstance, res);

    return value;
  };
}

var params = new FormParamsObject({
  param1: "test1",
  param2: {
    param21: "test2",
    param22: {
      number: ["123", "456"],
      text: ["text1", "text2"],
    },
  },
});

const outputResult = {
  param1: {
    param11: {
      param33: "new value2",
    },
  },
  param2: {
    param21: "new value",
    param22: [
      {
        number: "123",
        text: "text1",
      },
      {
        number: "456",
        text: "text2",
      },
    ],
  },
};

params.getObjectProperty("param2.param21"); // 'test2'
params.getObjectProperty("param1.param11.param33"); // null
params.setObjectProperty("param2.param21", "new value"); // 'new value'
params.setObjectProperty("param1.param11.param33", "new value2"); // 'new value2'
params.getObjectProperty("param1.param11.param33"); // 'new value2'
params.convertObjectToArray("param2.param22");

console.log(params.getFullObject());

console.log(
  JSON.stringify(params.getFullObject()) === JSON.stringify(outputResult)
);

function merge(current, update) {
  if (update != null) {
    Object.keys(update).forEach(function (key) {
      if (
        current.hasOwnProperty(key) &&
        typeof current[key] === "object" &&
        Object.keys(current[key]).length !== 0
      ) {
        merge(current[key], update[key]);
      } else {
        current[key] = update[key];
      }
    });
  } else {
    Object.getOwnPropertyNames(current).forEach(function (prop) {
      delete current[prop];
    });
  }

  return current;
}
