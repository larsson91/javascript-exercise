global.window = global // Ignore this line

function Person(name, age) {
  this.name = name;
  this.age = age;

  this.getName = () => this.name;
  this.sayHi = () => 'Hi!';

  return this;
}
const ada = Person('Ada Lovelace', 36);
console.log(window.age);
console.log(ada.getName());
