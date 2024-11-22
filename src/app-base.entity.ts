import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class AppBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}
