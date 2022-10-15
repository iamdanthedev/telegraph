import { Collection, MongoClient } from 'mongodb';
import { AssociationValue, SagaStateRepository, SagaState } from '@telegraph/sagas';
import { SagaStateEntity } from './entity/saga-state.entity';

export interface MongoSagaStateRepositoryOptions {
  uri: string;
}

export class MongoSagaStateRepository implements SagaStateRepository {
  private client: MongoClient;
  private sagaStateCollection!: Collection<SagaStateEntity>;
  private initialized = false;

  constructor(private readonly config: MongoSagaStateRepositoryOptions) {
    this.client = new MongoClient(config.uri);
  }

  async init() {
    await this.client.connect();
    this.sagaStateCollection = this.client.db().collection('telegraph_saga_state');
    this.initialized = true;
  }

  async find(sagaId: string, associationValue: AssociationValue): Promise<SagaState | null> {
    this.assertInitialized();

    const item = await this.sagaStateCollection.findOne({
      sagaId,
      associationValues: {
        $elemMatch: {
          key: associationValue.key,
          value: associationValue.value,
        },
      },
    });

    if (!item) {
      return null;
    }

    return {
      sagaInstanceId: item._id.toString(),
      sagaId: item.sagaId,
      state: item.state,
      revision: item.revision,
      associationValues: item.associationValues,
      completed: item.completed,
    };
  }

  async save(state: SagaState): Promise<void> {
    await this.sagaStateCollection.updateOne(
      {
        _id: state.sagaInstanceId,
      },
      {
        $set: {
          state: state.state,
          completed: state.completed,
          updatedAt: new Date(),
        },
        $inc: {
          revision: 1,
        },
        $setOnInsert: {
          sagaId: state.sagaId,
          associationValues: state.associationValues,
          // revision: 0,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
      }
    );

    this.assertInitialized();
    return Promise.resolve(undefined);
  }

  private assertInitialized() {
    if (!this.initialized) {
      throw new Error('MongoSagaStateRepository is not initialized. Call init() first.');
    }
  }
}
