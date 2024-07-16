import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Message } from '@web-api/persistence/repository/Message';

@Entity()
export class Case {
  @PrimaryColumn()
  docketNumber!: string;

  @Column({ nullable: true })
  trialLocation?: string;

  @Column({ nullable: true })
  trialDate?: string;

  @OneToMany(() => Message, message => message.docketNumber)
  messages?: Message[];
}
