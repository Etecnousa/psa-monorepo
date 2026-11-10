import { Topic } from '../entities/topic.entity';

export interface ITopicRepository {
  findById(id: string): Promise<Topic | null>;
  findByBlockId(blockId: string): Promise<Topic[]>;
  create(data: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic>;
  update(id: string, data: Partial<Topic>): Promise<Topic>;
  delete(id: string): Promise<void>;
}

export const TOPIC_REPOSITORY = Symbol('TOPIC_REPOSITORY');
