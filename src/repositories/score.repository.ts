import {DefaultCrudRepository} from '@loopback/repository';
import {Score, ScoreRelations} from '../models';
import {CloudantDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ScoreRepository extends DefaultCrudRepository<
  Score,
  typeof Score.prototype.id,
  ScoreRelations
> {
  constructor(
    @inject('datasources.cloudant') dataSource: CloudantDataSource,
  ) {
    super(Score, dataSource);
  }
}
