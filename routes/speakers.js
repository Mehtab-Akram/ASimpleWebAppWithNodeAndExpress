const express = require('express');
const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakersService.getList();
      const allArtwork = await speakersService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Speakers!',
        template: 'speakers',
        speakers,
        allArtwork,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.get('/:shortname', async (request, response, next) => {
    try {
      const speaker = await speakersService.getSpeaker(request.params.shortname);
      const artworkForSpeaker = await speakersService.getArtworkForSpeaker(
        request.params.shortname
      );
      return response.render('layout', {
        pageTitle: 'Speaker',
        template: 'speakers-detail',
        speaker,
        allArtwork: artworkForSpeaker,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
