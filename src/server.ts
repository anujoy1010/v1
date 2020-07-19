import * as dotenv from 'dotenv';
import {once} from 'events';
import express, {Request, Response} from 'express';
import http from 'http';
import {ApplicationConfig, NoteApplication} from './application';
export {ApplicationConfig};

export class ExpressServer {
  public readonly app: express.Application;
  public readonly lbApp: NoteApplication;
  private server?: http.Server;


  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    const {IamTokenManager} = require('ibm-watson/auth');
    const serviceUrl = process.env.SPEECH_TO_TEXT_URL;
    const tokenManager = new IamTokenManager({
      apikey: process.env.STT_API_KEY || '<iam_apikey>',
    });
    this.app = express();
    // Bootstrap application settings
    //require('./config/express')(this.app);
    this.lbApp = new NoteApplication(options);
    this.app.use('/api', this.lbApp.requestHandler);

    /* this.app.get('/', function (_req: Request, res: Response) {
       res.sendFile(path.resolve('public/express.html'));
       // res.sendFile(path.join(__dirname, 'client', 'index.html'))
     });*/

    this.app.use('/', express.static('./client'));
    this.app.use('/mcq/*', express.static('./client'));
    this.app.use('/quiz/*', express.static('./client'));
    this.app.use('/voice/*', express.static('./client'));

    this.app.get('/hello', function (_req: Request, res: Response) {
      res.send('Hello world!');
    });
    this.app.get('/apii/v1/credentials', async (req, res, next) => {
      try {
        //console.log(serviceUrl)
        //	console.log(tokenManager)
        const accessToken = await tokenManager.getToken();
        res.json({
          accessToken,
          serviceUrl,
        });
      } catch (err) {
        next(err);
      }
    });

  }
  async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host || '127.0.0.1';
    this.server = this.app.listen(port, host);
    await once(this.server, 'listening');
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return;
    await this.lbApp.stop();
    this.server.close();
    // await pEvent(this.server, 'close');
    this.server = undefined;
  }
}
