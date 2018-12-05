import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "./user";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public comment_id!: number;

    @ManyToOne(type => User, user => user.comments)
    user!: User;

    @Column()
    public link_id!: number;

    @Column()
    public value!: string;
}