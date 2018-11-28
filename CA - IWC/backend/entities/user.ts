import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public user_id!: number;
    @Column()
    public email!: string;
    @Column()
    public password!: string;
}