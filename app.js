import express from 'express';
import path from 'path';

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.info(`App listening on port ${port}`));
