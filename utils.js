let randomWords = require("random-words");

let self = (module.exports = {
  DATATYPES: {
    INTEGER: "Integer",
    STRING: "String",
    DECIMAL: "Decimal",
    TEXT: "Text",
    LONG_TEXT: "Long Text",
    OBJECT: "Object",
    ARRAY: "Array",
    CUSTOM: "Custom",
    RANDOM: "Random",
  },

  createDataFromObject: (obj) => {
    try {
      let dataArray = [{}];
      if (obj.length)
        dataArray = new Array(obj.length < 10 ? obj.length : 10).fill({});

      let objectBody = dataArray.map(() => {
        let data = {};
        for (let key in obj) {
          switch (self.wordToSentenceCase(obj[key].type || "")) {
            case self.DATATYPES.INTEGER:
              data[key] = +(Math.random() * 50).toFixed(0);
              break;
            case self.DATATYPES.DECIMAL:
              data[key] = +(Math.random() * 50).toFixed(2);
              break;
            case self.DATATYPES.STRING:
              data[key] = randomWords({
                exactly: 1,
                wordsPerString: 1,
                formatter: (word, index) =>
                  self.wordToSentenceCase(word, index),
              })[0];
              break;
            case self.DATATYPES.TEXT:
              data[key] = randomWords({
                min: +obj[key].min || 1,
                max: +obj[key].max || 2,
                join: " ",
              });
              break;
            case self.DATATYPES.OBJECT:
              data[key] = obj[key].properties.length
                ? self.createDataFromObject(obj[key].properties)
                : self.createDataFromObject(obj[key].properties)[0];
              break;
            case self.DATATYPES.ARRAY:
              let dataForArray = obj[key].length
                ? new Array(obj[key].length).fill(null)
                : new Array(1).fill(null);
                
                for (let i = 0; i < dataForArray.length; i++) {
                  dataForArray[i] = self.wordToSentenceCase(obj[key].of || "") === self.DATATYPES.INTEGER
                                  ? +(Math.random() * 50).toFixed(0)
                                  : randomWords()
                }
                data[key] = dataForArray;
              break;
            case self.DATATYPES.CUSTOM:
              if (obj[key].value) data[key] = obj[key].value;
            case self.DATATYPES.RANDOM:
              let value = obj[key].value
              if (value?.length){ data[key] = value[+(Math.random() * (value.length - 1)).toFixed(0)];}
              break;
            default:
              break;
          }
        }
        return data;
      });
      return objectBody;
    } catch (e) {
      throw "err";
    }
  },

  wordToSentenceCase: (word, index = 0) => {
    return index === 0
      ? word.slice(0, 1).toUpperCase().concat(word.slice(1).toLowerCase())
      : word;
  },

});
