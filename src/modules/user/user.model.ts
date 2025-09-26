import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm"
import { VerifiedCode } from "@/modules/verificationCode/verification.model"
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    idUser!: number

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255})
    fullName!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @Column({ type: "boolean", default: false })
    emailVerified?: boolean;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    resetPwdToken?: string

    @Column({ type: "timestamp", nullable: true })
    resetPwdExpiry?: Date;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }) createdAt!: Date;

    @OneToMany(() => VerifiedCode, (verifiedCode) => verifiedCode.user)
    verifiedCodes!: VerifiedCode[]

} 