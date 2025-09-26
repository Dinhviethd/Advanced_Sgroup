import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import { VerifiedCode } from "@/modules/verificationCode/verification.model"
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    idUser!: number

    @Column()
    email!: string;

    @Column()
    fullName!: string;

    @Column()
    phone?: string;

    @Column({ default: false })
    emailVerified?: boolean;

    @Column()
    password!: string;

    @Column()
    avatar?: string;

    @Column()
    resetPwdToken?: string

    @Column()
    resetPwdExpiry?: Date;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }) createdAt!: Date;

    @OneToMany(() => VerifiedCode, (verifiedCode) => verifiedCode.user)
    verifiedCodes!: VerifiedCode[]

} 