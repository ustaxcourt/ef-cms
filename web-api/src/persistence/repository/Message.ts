import { Case } from '@web-api/persistence/repository/Case';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Message {
  @Column('jsonb', { nullable: true })
  attachments?: {
    documentId: string;
  }[];

  @Column('varchar')
  caseStatus!: string;

  @Column('varchar')
  caseTitle!: string;

  @Column('varchar', { nullable: true })
  completedAt?: string;

  @Column('varchar', { nullable: true })
  completedBy?: string;

  @Column('varchar', { nullable: true })
  @Index()
  completedBySection?: string;

  @Column('varchar', { nullable: true })
  @Index()
  completedByUserId?: string;

  @Column('varchar', { nullable: true })
  completedMessage?: string;

  @Column('varchar')
  createdAt!: string;

  @Column('varchar')
  @Index()
  docketNumber!: string;

  @Column('varchar')
  docketNumberWithSuffix!: string;

  @Column('varchar')
  from!: string;

  @Column('varchar')
  @Index()
  fromSection!: string;

  @Column('varchar')
  @Index()
  fromUserId!: string;

  @Column('bool')
  isCompleted!: boolean;

  @Column('bool')
  isRead!: boolean;

  @Column('bool')
  isRepliedTo!: boolean;

  @Column('varchar', { nullable: true })
  leadDocketNumber?: string;

  @Column('varchar')
  message!: string;

  @PrimaryColumn('varchar')
  messageId!: string;

  @Column('varchar')
  @Index()
  parentMessageId!: string;

  @Column('varchar')
  subject!: string;

  @Column('varchar')
  to!: string;

  @Column('varchar')
  @Index()
  toSection!: string;

  @Column('varchar')
  @Index()
  toUserId!: string;

  @ManyToOne(() => Case, item => item.docketNumber)
  @JoinColumn({ name: 'docketNumber' })
  case!: Case;
}
