import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Author extends BaseModel {
  @Column()
  name: string;
}
