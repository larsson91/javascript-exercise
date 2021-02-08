class Person {

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getName() {
    return this.name;
  }

  sayHi() {
    return 'Hi!';
  }

}

const ada = new Person('Ada Lovelace', 36);
const sayHi = ada.sayHi;
const adaName = ada.getName;

console.log(sayHi());
console.log(ada.getName()); // change this to: console.log(adaName());
