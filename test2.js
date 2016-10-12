var makePerson = function (favoriteColor, name, age) {
  if (arguments.length < 3) {
    favoriteColor = "green";
    name = arguments[0];
    age = arguments[1];
  }
  return {
    name: name,
    age: age,
    favoriteColor: favoriteColor
  };
};
var person = makePerson("Joe", 18);
console.log(JSON.stringify(person));