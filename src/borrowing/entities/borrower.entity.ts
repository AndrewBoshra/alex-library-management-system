import { BaseModel } from '@/common/entity/base-model.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Borrower extends BaseModel {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    name: 'registered_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registeredAt: Date;
}
