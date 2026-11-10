import { Block } from '../entities/block.entity';

export interface IBlockRepository {
  findById(id: string): Promise<Block | null>;
  findByCourseId(courseId: string): Promise<Block[]>;
  create(data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>): Promise<Block>;
  update(id: string, data: Partial<Block>): Promise<Block>;
  delete(id: string): Promise<void>;
}

export const BLOCK_REPOSITORY = Symbol('BLOCK_REPOSITORY');
