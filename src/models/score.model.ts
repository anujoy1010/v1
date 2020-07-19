import {Entity, model, property} from '@loopback/repository';

@model()
export class Score extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  quizID: string;

  @property({
    type: 'number',
  })
  mcqscore?: number;

  @property({
    type: 'number',
  })
  voicescore?: number;

  @property({
    type: 'number',
  })
  total?: number;


  constructor(data?: Partial<Score>) {
    super(data);
  }
}

export interface ScoreRelations {
  // describe navigational properties here
}

export type ScoreWithRelations = Score & ScoreRelations;
