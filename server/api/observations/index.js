var express = require('express');
var router = express.Router();
var _ = require('lodash');
var jwt = require('express-jwt');
var multiparty = require('multiparty');
var minUtils = require('./min-utils');
var moment = require('moment');
var changeCase = require('change-case');
var logger = require('../../logger.js');

var jwtCheck = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

router.post('/submissions', jwtCheck, function (req, res) {
    logger.log(req.get('content-type'));
    var form = new multiparty.Form();
    form.parse(req);

    var tok = req.get('Authorization').replace(/^Bearer /, '');
    minUtils.saveSubmission(tok, form, function (err, obs) {
        if (err) {
            logger.log('info','Error saving MIN submission : %s', JSON.stringify(err));
            res.send(500, {error: 'There was an error while saving your submission.'})
        } else {
            res.json(201, obs);
        }
    });
});

router.get('/submissions', function (req, res) {
    var filters = req.query;
    logger.log('info', 'fetching submissions with fiters: %s', JSON.stringify(filters));

    minUtils.getSubmissions(filters, function (err, subs) {
        if (err) {
            res.send(500, {error: 'error retreiving submissions'})
        } else {
            res.json(subs);
        }
    });
});

router.get('/submissions/:subid', function (req, res) {
    var subid = req.params.subid;

    minUtils.getSubmission(subid, req.query.client, function (err, sub) {
        if (err) {
            res.send(500, {error: 'error retreiving submission'})
        } else if(sub === null){
            res.send(404, {error: 'No submission found'})
        } else {
            if(req.query && req.query.client){
                sub = mapWebSubResponse(sub, req);
            }
            res.json(sub);
        }
    });
});

router.get('/observations', function (req, res) {
    var filters = req.query;
    logger.log('info','fetching submissions with fiters: %s', JSON.stringify(filters));

    minUtils.getObservations(filters, function (err, obs) {
        if (err) {
            res.send(500, {message: 'error retreiving observations', error: err});
            logger.log("ERROR", 'error retreiving observations:', err);
        } else {
            logger.log('info','returning %s obs', obs.length);
            if(filters && filters.client){
                obs = mapWebObsResponse(obs, req);
            }
            res.json(obs);
        }
    });
});



function makeShareUrl(host, ob) {
    return 'http://'+host+'/mountain-information-network/submissions/' + ob.subid;
    //return 'http://'+req.get('host')+'/share/'+ changeCase.paramCase(ob.title) + '/' + ob.obid;
    //return 'http://.com/'
}

function mapWebObsResponse(obs, req){
    return _.reduce(obs, function(results, ob, key){

        results[key] = ob;
        results[key].focusUrl= 'http://'+req.get('host')+'/focus/'+ ob.obid;
        results[key].shareUrl= makeShareUrl(req.get('host'), ob);
        results[key].thumbs = ob.uploads.map(function (key) { return 'http://'+req.get('host')+'/api/min/uploads/'+key});
        results[key].dateFormatted = formatDate(ob.datetime);

        return results;
    },[]);
}

function mapWebSubResponse(subs, req){
    return _.reduce(subs, function(results, sub){

        results = sub;
        results.focusUrl= 'http://'+req.get('host')+'/focus/'+ sub.subid;
        results.shareUrl= makeShareUrl(req.get('host'), sub);
        results.thumbs = sub.uploads.map(function (key) { return 'http://'+req.get('host')+'/api/min/uploads/'+key});
        results.dateFormatted = formatDate(sub.datetime);

        return results;
    },{});
}

function getOptions(options){
    var selections = [];
    for(var option in options) {
        if(options[option]) selections.push(option);
    }

    return selections;
}

function formatDate(datetimeString){
    var datetime = moment(datetimeString);
    var offset = moment.parseZone(datetimeString).utcOffset();
    var prefixes = {
        480: 'P',
        420: 'M',
        360: 'C',
        300: 'E',
        240: 'A',
        180: 'N'
    };
    var suffix = datetime.isDST() ? 'DT' : 'ST';
    var zoneAbbr = 'UTC';

    if(offset in prefixes) {
        zoneAbbr = prefixes[offset] + suffix;
        datetime.subtract(offset, 'minutes');
    }

    return datetime.format('MMM Do, YYYY [at] HH:mm [' + zoneAbbr + ']')
}

router.get('/observations/:obid.:format?', function (req, res) {

    minUtils.getObservation(req.params.obid, function (err, ob) {
        if (err) {
            res.send(500, {error: 'error retreiving observation'})
        } else {
            if(req.params.format === 'html'){

                var ridingCond = {};
                if (typeof ob.ridingConditions !== 'undefined'){
                    ridingCond = {
                        ridingQuality: ob.ridingConditions.ridingQuality.selected || '',
                        snowConditions: getOptions(ob.ridingConditions.snowConditions.options),
                        rideType: getOptions(ob.ridingConditions.rideType.options),
                        stayedAway: getOptions(ob.ridingConditions.stayedAway.options),
                        weather: getOptions(ob.ridingConditions.weather.options)
                    }
                } else {
                    logger.warn('WARN: Riding conditions are undefined for obid=' + ob.obid);
                }
                var locals = {
                    title: ob.title || 'title',
                    datetime: formatDate(ob.datetime),
                    user: ob.user,
                    ridingConditions: ridingCond,
                    avalancheConditions: ob.avalancheConditions,
                    comment: ob.comment,
                    shareurl: makeShareUrl(req.get('host'), ob),
                    uploads: ob.uploads.map(function (key) { return 'http://'+req.get('host')+'/api/min/uploads/'+key; })
                };

                function hasValues(memo, v, k){
                    var l = v.length || +v; // +true=>1, +false=>0
                    return memo || l > 0;
                }

                locals.hasRidingConditions = _.reduce(locals.ridingConditions, hasValues, false);
                locals.hasAvalancheConditions = _.reduce(locals.avalancheConditions, hasValues, false);

                res.render('observations/ob', locals);
            } else {
                ob.thumbs = (ob.uploads)?ob.uploads.map(function (key) { return 'http://'+req.get('host')+'/api/min/uploads/'+key; }):[];
                res.json(ob);
            }
        }
    });
});

router.get('/uploads/:year/:month/:day/:uploadid', function (req, res) {
    var uploadKey = [req.params.year, req.params.month, req.params.day, req.params.uploadid].join('/');
    var size = req.query.size || 'fullsize';

    var stream = minUtils.getUploadAsStream(uploadKey, size);
    stream.on('error',function(err){
        if(err.code === 'NoSuchKey') {
            res.status(404).send('Image not found');
        } else {
            logger.log('ERROR reading from s3', JSON.stringify(err));
            res.status(500).json({error: 'ERROR reading from s3'});
        }
        return;
    });
    stream.pipe(res);
});

module.exports = router;
