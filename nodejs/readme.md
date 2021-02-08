# Node.js server

Låt oss sätta upp en http server på din lokala dator 😻

## Steg 0 - All systems go

1. Först klonar vi ner detta repo: `git clone git@git.valtech.se:talangprogrammet/javascript-exercise.git`, och navigera sedan in till `nodejs` mappen
2. Kontrollera sedan att du har Node.js installerat, till exempel genom att skriva `node --version` i en terminal. Om du inte har det kan du till exempel använda [brew](http://brew.sh/) (för macOS) eller så kan du ladda ner nodeJS från dess officiella sida (https://nodejs.org/en/). Har du 10.9.0 eller senare? Perfekt!
3. Installera projektets dependencies: `npm i`. På Mac kan du få ett fel om
> \> node-gyp rebuild
>
>/bin/sh: pg_config: command not found

då måste du manuellt installera postgresql, vilket lämpligast görs genom: `brew install postgresql`.

## Steg 1 - Hello World

1. Låt oss nu prova Node.js applikationen, kör `node index.js` och öppna "localhost:3000" i din favoritbrowser. Får du "Hello world!" som svar från vår server? Fint!

    När du gör ändringar i koden måste du köra om node-scriptet. Detta blir lätt jobbigt, vilket är varför man kan använda "filewatchers" av olika slag som tittar efter ändringar i filer, och då startar om scriptet. I denna labb har vi lagt till [nodemon](https://github.com/remy/nodemon), som är ett ganska enkelt verktyg. Skriv `nodemon` istället för `node`, dvs `nodemon index.js`. Du kommer se att den startar om varje gång du gör ändringar. Installera nodemon via (Windows) `npm install -g nodemon` eller (mac) `yarn global add nodemon`

2. Ofta är det bra att komma åt saker ur ett request som når servern, vare sig det är cookies, delar av en route, eller annat. I denna app gör vi det genom att en cool route tar ut request path:en och skickar tillbaka den som del av en mer dynamisk hälsning! Prova att besöka "localhost:3000/hello/you".

    Fast den verkar inte må så bra visar det sig. Vi verkar få ett ganska konstigt svar då "Hello [object Object]"...? Får vi det på alla routes under "/hello"? Öppna `index.js` och se om du kan fixa felet i den routen. Vi vill alltså att servern skickar tillbaka den sista delen i URL:en.

    Tips: Routen vi letar efter har ett litet speciellt format, "/hello/:name". Kan vi komma åt "name" på något sätt...?
3. Tänk om vi kunde skriva skriva ut något annat häftigt från requestet? Går det att få ut vad det var för user-agent som requestade till exempel?

    Tips: [Dokumentationen](https://koajs.com/#request) för koa kan vara till nytta för att se vad vi kan hämta.

## Steg 2 - Bygg ett API

Nu har vi fått en server att läsa lite ur ett request och svara med något. Men ännu bättre vore att testa på att skriva API:et vi använde i [talang-api](https://git.valtech.se/talangprogrammet/talang-api)-labben till att köras med Node istället.

1. Börja med att plocka bort vår "hello" route. Det är alltid bra att hålla ordning i koden och rensa gammal kod! Skapa två hårdkodade svar för GET-anropen för som svarar med alla respektive en specifik todo:
    ```js
    router.get('/api/todo/', (context) => {
      context.body = [{
        id: 123456,
        name: "Do something",
        isComplete: false
      }]
    });

    router.get('/api/todo/:id', (context) => {
      context.body = {
        id: context.params.id,
        name: "Do something",
        isComplete: false
      }
    });
    ```
2. Använd Postman eller något annat liknande verktyg för att anropa servern och se att du får tillbaka data från de två endpointsen.

## Steg 3 - Lägg till en databas
1. Installera databasen [PostgreSQL](https://www.postgresql.org/download/) om du inte redan gjort det,

    ```sh
    brew install postgresql
    brew services start postgresql
    ```

    Skapa en databas, i terminalen kan du göra detta:
    ```sh
    createdb todo-api
    ```

    Kör `psql todo-api` och se om du har lyckats installera databasen. Psql är ett cli-klient (command line interface) för Postgre där du kan lista databaser med `\l`, välja databas med `\c <databasename>` och lista tabeller i vald databas med `\d`. Du kan även köra vanliga databasqueries. Du avslutar psql genom att köra `\q`.

2. När databasen är installerad lägg till [knexjs](https://knexjs.org/) som är en SQL-query builder i ditt projekt. När du skapar databasmodeller vill du kunna skapa upp samma databas igen och då är det bra att ha det sparat i ett skript. Vill man sen göra en ändring i databasen behöver man utgå från hur databasen såg ut tidigare och göra ändringar sett från det och därför behöver man spara migreringsscript. Du kan skapa dessa skript själv eller så kan du ta hjälp av Knex för det. Det finns även andra verktyg som kan lösa det här åt dig. En påbyggnad av SQL-buildern kan vara en ORM (Object-relational Mapper) (tex [Objection](https://github.com/Vincit/objection.js), [Bookshelf](https://bookshelfjs.org/)) som abstraherar bort databasen ännu mer.
    ```bash
    npm install knex --save
    npm install pg --save
    ```

    Se till att titta i `package.json` och `package-lock.json` efter installationen. Vad är det som hänt? Varför kan det vara viktigt att låta lock-filen commitas och bli en del av repositoriet?
3. Nu ska vi börja skapa upp modellerna, (För att kunna köra command line knex behöver du antingen `npx`, eller lägga till node_modules i din path med `export PATH=./node_modules/.bin:$PATH` i din ~/.bashrc fil och köra `export PATH=./node_modules/.bin:$PATH` i terminalen, eller installera knex globalt `npm install knex -g`). Så initiera Knex med `knex init` eller `npx knex init`. Då bör du ha fått en fil kallad `knexfile.js` skapad i mappen terminalen "pekar" på. Öppna den, och uppdatera development-blocket till:

    ```js
      development: {
        client: 'postgresql',
        connection: {
          user: '<firstname.lastname>',
          database: 'todo-api'
        }
      },
    ```
    OBS: Byt ut `<firstname.lastname>` mot ditt användarnamn.

4. Kör sen `knex migrate:make init_database` och öppna den genererade filen `migrations/20190201102439_init_database.js` där timestampen kommer vara annorlunda och lägg till följande kod (exports.down behövs för att kunna göra en rollback) som skapar upp en tabell för todos:
    ```js
      exports.up = function (knex, Promise) {
        return knex.schema.createTable('todos', function (t) {
          t.increments('id').unsigned().primary();
          t.text('name').notNull();
          t.boolean('isComplete').notNull();
        })
      }
      exports.down = function (knex, Promise) {
        return knex.schema.dropTable('todos');
      }
    ```
5. Kör migreringsskriptet för att uppdatera databasen med den nya tabellen `knex migrate:latest`, om skriptet inte gjorde det du ville kan man göra en rollback med `knex migrate:rollback`.
6. Skapa en fil `touch databaseService.js` och fyll den med koden nedan (med ändringar så den fungerar med ditt username) och kör `node databaseService` och du kommer se att vi har lagt till en todo i databasen.

    ```js
    const knex = require('knex')({
      client: 'pg',
      connection: {
        user: '<firstname.lastname>',
        database: 'todo-api'
      },
      searchPath: ['knex', 'public'],
    });

    const run = async () => {
      await knex('todos').insert({
        name: 'Do some stuff',
        isComplete: false
      });
      const result = await knex.select().from('todos');
      console.log(result);
      process.exit(0);
    }
    run();
    ```
7. Anslut till databasen genom `psql todo-api` och kolla att det nya datat verkligen hamnat där. (Se punkt 1 för hjälp med hur psql fungerar).

## Steg 4 - Koppla upp mot databasen
1. Ändra i vår `index.js` fil så att de två GET-metoderna vi lagt till hämtar data ur vår nyligen skapade databas. Den ena endpointen hämtar alla todos, den andra en specifik mappad mot ett id som skickas in i path:en.
2. Skapa en endpoint som via POST kan lägga till en helt ny todo. För att komma åt body-datat i en request använder vi `koa-bodyparser`, som tillgängliggör den datan genom `context.request.body`.
3. Skapa en endpoint som kan ändra en existerande todo.
4. Skapa en endpoint som kan ta bort en existerande todo.

## Steg 5: The end
- Du var en snabb en! 🏎️💨
- Du kan fortsätta med https://github.com/leonardomso/33-js-concepts.
- Eller hjälp din granne
- Eller om du vill fortsätta skriva JavaScript kod gör uppgifter i JavaScript spåret på [Exercism](https://exercism.io/), instruktioner för att sätta upp finns i [slutet på C# labben](https://git.valtech.se/talangprogrammet/c-sharp#labb-7-the-end)
