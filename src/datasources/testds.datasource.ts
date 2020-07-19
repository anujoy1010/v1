import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
   name: 'cloudant',
  connector: 'cloudant',
  url: process.env.CLOUDANT_URL,
  host:process.env.CLOUDANT_HOST,
  database: process.env.CLOUDANT_DB,
  username: process.env.CLOUDANT_USER,
  password: '',
  modelIndex: 'Quiz',
  plugins: {
    "iamauth": { "iamApiKey": process.env.CLOUDANT_APIKEY}
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TestdsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'testds';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.testds', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}