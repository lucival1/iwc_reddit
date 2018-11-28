import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    public comment_id!: number;
    @Column()
    public user_id!: number;
    @Column()
    public link_id!: number;
    @Column()
    public value!: string;
}