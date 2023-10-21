import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;
}
