import { Case } from '@web-api/persistence/repository/Case';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @Column('jsonb', { nullable: true })
  attachments?: {
    documentId: string;
  }[];

  @Column()
  caseStatus!: string;

  @Column()
  caseTitle!: string;

  @Column({ nullable: true })
  completedAt?: string;

  @Column({ nullable: true })
  completedBy?: string;

  @Column({ nullable: true })
  completedBySection?: string;

  @Column({ nullable: true })
  completedByUserId?: string;

  @Column({ nullable: true })
  completedMessage?: string;

  @Column()
  createdAt!: string;

  @Column()
  docketNumber!: string;

  @Column()
  docketNumberWithSuffix!: string;

  @Column()
  from!: string;

  @Column()
  fromSection!: string;

  @Column()
  fromUserId!: string;

  @Column()
  isCompleted!: boolean;

  @Column()
  isRead!: boolean;

  @Column()
  isRepliedTo!: boolean;

  @Column({ nullable: true })
  leadDocketNumber?: string;

  @Column()
  message!: string;

  @PrimaryColumn()
  messageId!: string;

  @Column()
  parentMessageId!: string;

  @Column()
  subject!: string;

  @Column()
  to!: string;

  @Column()
  toSection!: string;

  @Column()
  toUserId!: string;

  @ManyToOne(() => Case, item => item.docketNumber)
  @JoinColumn({ name: 'docketNumber' })
  case!: Case;
}
