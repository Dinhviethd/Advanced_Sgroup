import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, CreateDateColumn } from 'typeorm'
import { verifiedCodeType } from '@/common/const/constants'
import { User } from '@/modules/user/user.model'
@Entity()
export class VerifiedCode {
    @PrimaryGeneratedColumn()
    idVerifiedCode!: number;

    @Column({ type: "timestamp" })
    ExpiredAt!: Date;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    createdAt!: Date;

    @Column({ type: "enum", enum: verifiedCodeType })
    type!: verifiedCodeType;

    @ManyToOne(() => User, (user) => user.verifiedCodes)
    user!: User;
}