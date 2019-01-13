const fs = require('fs-extra');
const bodyParser = require('body-parser');
const log = require('loglevel');
let app = require('express')();

log.setLevel('debug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let init = async () => {
    let state = {
        driver: undefined,
        legs: undefined,
        stops: undefined
    };

    let promises = Object.keys(state).map((key) => {
        return fs.readFile(`initial_data/${key}.json`, 'utf8').then((contents) => {
            state[key] = JSON.parse(contents);
        });
    });
    let allRead = await Promise.all(promises);

    for (let simpleRequest in state) {
        app.get(`/${simpleRequest}`, (req, res) => {
            log.info(`GET /${simpleRequest} success`);
            res.status(200).json(state[simpleRequest]);
        });
    }

    app.put('/driver', (req, res) => {
        if (req.body.activeLegID && req.body.legProgress) {
            log.info('PUT /driver failed due to malformed body');
            res.status(400).end();
        }
        if (state.legs[req.body.activeLegID] && parseInt(req.body.legProgress, 10) !== NaN) {
            log.info('PUT /driver failed due to incorrect body contents in its keys');
            res.status(400).end();
        }
        let progress = parseInt(req.body.legProgress, 10);
        if (progress >= 0 && progress <= 100) {
            state.driver.activeLegID = req.body.activeLegID;
            state.driver.legProgress = req.body.legProgress;
            log.info('PUT /driver success');
            res.status(200).end();
        } else {
            log.info('PUT /driver failed due to legProgress not in proper range');
            res.status(400).end();
        }
    });

    app.listen(3000, () => {
        log.info('Server started.');
    });
}


init();