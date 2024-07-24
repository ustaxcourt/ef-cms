import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Message } from '@web-api/persistence/repository/Message';

@Entity({ name: 'case' })
export class Case {
  @PrimaryColumn('varchar')
  docketNumber!: string;

  @Column('varchar', { nullable: true })
  trialLocation?: string;

  @Column('varchar', { nullable: true })
  trialDate?: string;

  // @OneToMany(() => Message, message => message.docketNumber, { nullable: true })
  // messages?: Message[];
}
