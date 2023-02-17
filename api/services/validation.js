module.exports = {
  check: function(data, res) {
    let dataResult = {};
    let count = 0;
    // sails.log("validation data: ", data)
    for (let key in data) {
      let index;
      for (let i = 0; i < key.length; i++) {
        if (key[i].match(/[A-Z]/) != null) {
          index = i;
          break;
        }
      }
      let type = key.substring(0, index);
      let name = key.substring(index, key.length);
      name = name.substr(0, 1).toLowerCase() + name.substr(1);
      dataResult[name] = data[key];

      switch (type) {
        case 'integer':
        case 'float':
          if (isNaN(data[key])) return {
            status: false,
            message: name + ' must be number (integer/float)'
          };
          break;
        case 'string':
          // sails.log("key ", key + " _.isNull(data[key]) " + _.isNull(data[key]) + " isString " + _.isString(data[key]));
          if (/*_.isUndefined(data[key]) ||*/ _.isNull(data[key]) || !_.isString(data[key])) return {
            status: false,
            message: name + ' is required'
          };
          break;
        case 'boolean':
          if ([0, 1].indexOf(parseInt(data[key])) === -1 && [true, false].indexOf(data[key]) === -1) return {
            status: false,
            message: name + ' must be boolean'
          };
          break;
        case 'time':
          if (!_.isString(data[key])) return {
            status: false,
            message: name + ' is required'
          };

          let arrayTime = data[key].split(':');
          if (arrayTime.length !== 3) return {
            status: false,
            message: name + ' must be format hh:mm:ss'
          };

          if (
            parseInt(arrayTime[0]) <= 0 || parseInt(arrayTime[0]) > 24 ||
            parseInt(arrayTime[1]) < 0 || parseInt(arrayTime[1]) > 59 ||
            parseInt(arrayTime[2]) < 0 || parseInt(arrayTime[2]) > 59
          ) return {
            status: false,
            message: name + ' is invalid'
          };

          break;
        case 'datetime':
          if (!data[key]) {
            return {
              status: false,
              message: name + ' is required '
            };
          }
          /*else {
            let matches = data[key].match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);

            if (matches === null) {
              return {
                status: false,
                message: name + ' must be format yyyy-mm-dd hh:mm:ss '
              };
            } else{
              // now lets check the date sanity
              let year = parseInt(matches[1], 10);
              let month = parseInt(matches[2], 10) - 1; // months are 0-11
              let day = parseInt(matches[3], 10);
              let hour = parseInt(matches[4], 10);
              let minute = parseInt(matches[5], 10);
              let second = parseInt(matches[6], 10);
              let date = new Date(year, month, day, hour, minute, second);
              if (date.getFullYear() !== year
                || date.getMonth() != month
                || date.getDate() !== day
                || date.getHours() !== hour
                || date.getMinutes() !== minute
                || date.getSeconds() !== second
              ) {
                return {
                  status: false,
                  message: name + ' is invalid'
                };
              }

            }
          }*/

          break;
        default:
      }

      if (count === Object.keys(data).length - 1) {
        sails.log("data validated: " + JSON.stringify(dataResult))
        return {
          status: true,
          data: dataResult
        };
      }

      count++;
    }
  }
};
