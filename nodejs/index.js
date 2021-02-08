const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser());
const router = Router();

router.get('/hello/:name', (context) => {
  context.body = `Hello ${context.params}`;
});

app.use(router.routes());
app.use((context) => {
  context.body = "Hello world!";
})

app.listen(3000, () => {
  console.log('We are listening to port 3000!');
});
