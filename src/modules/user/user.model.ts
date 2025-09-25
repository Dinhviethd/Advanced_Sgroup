import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn } from 'typeorm'
@Entity()
export class User{
    @PrimaryGeneratedColumn()
    idUser!: number;
    @Column()
    username!: string;
    @Column()
    email!: string;
    @Column()
    password!: string;
    @Column({default: "false"})
    emailVerified!: boolean
    @Column()
    avatarURL?: string;
    @Column()
    phone?: string;
    @CreateDateColumn({
        type: "timestamp",
        default: ()=> "CURRENT_TIMESTAMP(6)",
    }) createdAt!: Date;
}