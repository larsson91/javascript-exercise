# Välkommen till JavaScripts magiska värld!

## Labb 0 - Run
Öppna och titta i filen `hello-world.js`. Testkör koden genom att använda node (`node hello-world.js`):

Det finns en uppsjö av sätt köra JavaScript, så om du inte vill använda node kan du till exempel köra:

- [quokka](https://quokkajs.com/) för VS code
- VS code debugger, alltså att öppna `hello-world.js` i VS code och välj debug konfigurationen "Current JS File"
- Använd [Chrome snippets](https://developers.google.com/web/tools/chrome-devtools/snippets)
- [jsbin](https://jsbin.com/?js,console), skapa en ny js bin och kör koden där.

Eller något helt annat du föredrar, det är helt fritt att använda det du vill och känner dig bekväm med!

## Labb 1 - Loops and variables

1. Skriv klart for-loopen i funktionen `max` så att den faktiskt returnerar det största talet som finns i `arr`.
2. Vad händer om du byter ut `of` mot `in`? Vad är det vi skriver ut då?
3. Vad händer om du byter ut `const` mot `var` eller `let` i for-loopen, blir det någon skillnad? (tips, lägg till `console.log(i);` direkt efter for-loopen). Vad händer i de olika fallen?

## Labb 2 - Reduce
Skriv om `max`-funktionen så den använder [`reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) istället för en for-loop.

## Labb 3 - Built-in functions and spread
Som i många andra språk finns viss grundfunktionalitet redan skriven i förväg, så även `max`. Skriv om implementationen till att endast använda `Math.max`. Tips: [spread-operatorn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) kan vara användbar.


## Labb 4 - Browser

1. Öppna upp filen `webb-app/index.html` i valfri webbläsare. Försök sedan interagera med sidan. Vi verkar inte kunna göra så mycket mer än skriva. Öppnar vi `web-app/index.js` så ser vi att scriptet visst inte är färdigimplementerat. Skriv klart koden så ett knapptryck uppdaterar p-taggen med innehållet som finns i inputfältet.
2. Öppna upp din webbläsares utvecklarverktyg. Oavsett vilken webbläsare du använder eller vad du jobbar med så kan det vara väldigt nyttigt att lära sig använda den. Börja med att leta upp JavaScript koden som finns på sidan, lägg in en breakpoint i lyssnaren till knappen och klicka sedan på knappen.
3. Öppna konsolen och skriv ett litet kommando som ändrar paragrafens text till ditt namn. Du kan hämta inspiration från `web-app/index.js`!

## Labb 5 - The "this" variable
`this` är en variabel i JavaScript som kan ha olika betydelse, beroende på i vilket kontext den används. Följande script kan du hitta i `this/this.js`:

```js
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
```

1. Byt ut `console.log(ada.getName());` mot `console.log(adaName());` Varför fungerar det inte? Hur kan vi lösa problemet? Tips: [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), [call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply). Finns det någon annan lösning?
2. Det går alltid att skriva om klasser till funktioner i JavaScript. Faktum är att typen för en klass i JavaScript är `Function` (`typeof class {} // function`)
Person-klassen ovan kan således skrivas om till en funktion:
```js
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.getName = () => this.name;
  this.sayHi = () => 'Hi!';

  return this;
}
const ada = new Person('Ada Lovelace', 36);
console.log(window.age);
console.log(ada.getName());
```
Scriptet ovan finns även i denna fil: `this/function.js`.
Vad händer om vi struntar i `new` framför funktionsanropet? (Tips: Vad blir `window.age` när du använder `new` och när du inte gör det?)

## Labb 6 - Asynchronous

Låt oss lämna Ada Lovelace för den här gången och se hur asynkrona anrop hanteras. JavaScript-motorn är (som standard) [enkeltrådad](https://stackoverflow.com/a/22644735/4726243) och bygger på att event-loopen hanterar en sak i taget och delegerar annat arbete till andra processer/trådar. Detta betyder att all kod som du skriver kommer hanteras av samma tråd men de flesta api anropen som görs (läsa från disk, göra nätverksanrop, etc.) kan exekveras från en annan tråd/process. Detta gör det viktigt att lägga ut tyngre arbete på eventloopen och att inte stå och vänta på svaret.

Att skriva asynkron kod kan dock vara lite knivigt ibland. JavaScript använder i regel callback funktioner. Dvs. när en operation är klar så exekveras en ny funktion. Ta följande kod som exempel:

```js
function myCallbackFunction(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log('Ladies and gentlemen, we have a result: ', result);
  }
}

console.log(`Let's make the request`);
makeHttpRequest('https://mybackend.com/', myCallbackFunction);
console.log('Done');
```

Låt oss först anta att `makeHttpRequest` är en definierad funktion som gör ett http anrop och där med är asynkron. Resultatet från ovanstående kod snutt skulle ge följande resultat:
```
Let's make the request
Done
Ladies and gentlemen, we have a result: Hello from backend
```

Steg för steg kan vi förstå varför det blir så:
1. Först defineras funktionen `myCallbackFunction`
2. `console.log('Let's make the request');` exekveras
3. Sedan exekveras `makeHttpRequest` och JavaScript-motorn kommer delegera det asynkrona anropet till en bakgrundsprocess och registrera att metoden `myCallbackFunction` ska anropas när bakgrundsprocessen är klar.
3. `console.log('Done');` exekveras
4. Efter att JavaScript-motorn har fått ett resultat från backendservern kommer `myCallbackFunction` exekveras med två argument. Det första är ett `Error`-objekt som kan vara null om inget fel inträffade och det andra argumentet är resultatet från anropet.

Öppna filen `async/program-callback.js`. Där finns en funktion `replaceStringInFile` som ersätter en textsträng i en fil med en annan sträng. Just nu läses filen in och strängen byts ut men vi skriver inte tillbaka resultatet igen. Det är din uppgift att fixa detta. Använd funktionen 'writeFile' som redan är importerad men som inte används (än). Funktionen tar tre argument. Det första är en sökväg till filen, det andra argumentet är strängen som ska skrivas till filen och det tredje argumentet är en callback funktion. Du kan se [dokumentationen](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) för att få tips.

Som du kanske märker blir det ganska omständigt att skriva och det är lätt att hamna i en situation där funktionsanrop nästlas i varandra, där koden blir rörig och svår att förstå. Det är detta som kallas för [callback hell](http://callbackhell.com/).

Låt oss kika på alternativa lösningar.

### Promise

Promise är ett speciellt JavaScript object som lovar att returnera ett resultat någon gång. Låt oss hoppa in i ett exempel direkt:

```js
function myResultFunction(result) {
  console.log('Ladies and gentlemen, we have a result: ', result);
}

function myErrorFunction(error) {
  console.error(error);
}

console.log(`Let's make the request`);
makeHttpRequest('https://mybackend.com/').then(myResultFunction).catch(myErrorFunction);
console.log('Done');
```

Istället för att `makeHttpRequest` tar in en callback funktion så retunerar `makeHttpRequest` ett promise object. På detta object finns det två metoder: `then` och `catch`. Både `then` och `catch` tar ett argument och det är en funktion som ska anropas. `then` kommer exekvera sin funktion (`myResultFunction` i detta fall) när JavaScript motorn har fått ett resultat och `catch` kommer exekvera sin funktion när ett fel inträffar.

Det går även att använda sig av flera `then` efter varandra det behövs:

```js
function toUpperCase(result) {
  return result.toUpperCase();
}

function myResultFunction(result) {
  console.log('Ladies and gentlemen, we have a result: ', result);
}

function myErrorFunction(error) {
  console.error(error);
}

console.log(`Let's make the request`);
makeHttpRequest('https://mybackend.com/')
  .then(toUpperCase)
  .then(myResultFunction)
  .catch(myErrorFunction);
console.log('Done');
```

I kodsnutten ovan kommer resultatet först till funktionen `toUpperCase` som gör om resultatet till versaler och sedan kommer `myResultFunction` att anropas med resultatet i versaler.

Öppna filen `async/program-promise.js`. Precis som i callback exemplet finns det en funktion som heter `replaceStringInFile` men denna gång tar den ingen callback utan retunerar ett promise-object. Och som i callback fallet skrivs inte resultatet tillbaks till filen. Det är din uppgift att fixa det.
Det finns en funktion som heter `writeFile` men denna tar ingen callback-funktion utan retunerar i stället ett promise object. `writeFile` tar alltså två argument istället för tre.

### Async-Await

Kanske har du redan kommit i kontakt med async/await i exempelvis C#, och det fungerar snarlikt i JavaScript. Kodsnutten i exemplet ovan går att skriva om till:

```js
function toUpperCase(result) {
  return result.toUpperCase();
}

function myResultFunction(result) {
  console.log('Ladies and gentlemen, we have a result: ', result);
}

function myErrorFunction(error) {
  console.error(error);
}

async function makeRequest() {
  try {
    const result = await makeHttpRequest('https://mybackend.com/');
    const resultUpperCase = toUpperCase(result);
    myResultFunction(resultUpperCase);
  } catch (error) {
    myErrorFunction(error);
  }
}

console.log(`Let's make the request`);
makeRequest();
console.log('Done');
```

Öppna filen `async/program-async-await.js`. Precis som i callback och promise exemplen så finns det en funktion som heter `replaceStringInFile`. Reslutatet skrivs dock inte tillbaka i filen och gissa vad, det är din uppgift att fixa det!

Vilket kändes enklast? Callback, promise eller async/await? Finns det styrkor och svagheter mellan dem?

## Labb 7 - Tying it together

Öppna filen `series-search/index.html` i webbläsaren. Den ska visa upp en lista med tv-serier när användaren skriver in text i rutan. Appen verkar dock inte fungera som den ska. Kan du reparera den med lite av det vi gått igenom?

## Bonus: Micro tasks och event loopen

Låt oss säga att vi har följande kod:

```js
console.log('1')
setTimeout(() => console.log('2'), 1000)
console.log('3')
```

Om vi exekverar programmet kommer vi få loggarna i följande ordning: `1 3 *en sec senare* 2`
Kanske inte så otippat. Låt oss nu ta ner tiden till `0` sekunder istället och se vad som händer.

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
console.log('3')
```

🥁🥁🥁 `1 3 2`. – What? 
Okej, så vad händer här?
1. `console.log('1')` skriver ut `1`
2. Vi säger åt JavaScript-motorn att vi vill exekvera `console.log('2')` om 0 ms, dvs. nu men alla asynkrona anrop hamnar längst back i stacken. Dvs. bakom `console.log('3')`
3. `console.log('3')` skriver ut `3`
4. `console.log('2')` skriver ut `2`

Nu kanske du undrar, varför är detta viktigt? Låt oss istället kolla på `Promise`.

```js
console.log('1')
Promise.resolve().then(() => console.log('2'))
console.log('3')
```

Resultatet är fortfarande det samma: `1 3 2`.
Varför, låt oss återigen kolla:
1. `console.log('1')` skriver ut `1`
2. Vi skapar ett Promise objekt och registrerar en callback som kommer registreras som en micro task istället för en task (som ex. timeout)
3. `console.log('3')` skriver ut `3`
4. Det finns inget mer på stacken så JavaScript-motorn börjar beta av micro-task stacken, dvs. `console.log('2')` skriver ut `2`

Så nu är min fråga till dig. Vad kommer följande script att skriva ut och varför?

```js
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
```

Testa och se om du har rätt.

Om du har fem minuter till övers och tycker sånt här är intresant så kan jag rekomendera detta [klipp](https://www.youtube.com/watch?v=Lum0R6Ng6R8)

## Bonus: The end

Det finns väldigt mycket att lära sig i JavaScript, här är en lista på koncept som kan vara [bra att kunna](https://github.com/leonardomso/33-js-concepts).

Om du tycker att type coercion är intressant finns en bra [artikel](https://www.freecodecamp.org/news/js-type-coercion-explained-27ba3d9a2839/) som går igenom mycket av logiken.

Annars hjälp din granne eller lös lite uppgifter på [Exercism](https://exercism.io/tracks/javascript/exercises)
