const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookie = require('cookie-session');
const createError = require('http-errors');
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');
const routes = require('./routes');
const { request, response } = require('express');

const app = express();
const port = 3000;
app.locals.siteName = 'ROUX Meetups';
app.set('trust-proxy', 1);
app.use(
  cookie({
    name: 'session',
    keys: ['ksdfjlskdjflskjflks', 'weiruoweiurowieur'],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});
app.use(express.static(path.join(__dirname, './static')));
app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);
app.use((request, response, next) => next(createError(404, 'File not found')));
app.use((err, request, response, next) => {
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('./pages/error');
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
