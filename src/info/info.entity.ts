import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Info {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname?: string;

  @Column()
  fiscalcode?: string;
}
