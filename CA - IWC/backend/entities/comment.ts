import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Link } from "./link";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public comment_id!: number;

    @ManyToOne(type => User, user => user.comments)
    user!: User;

    @ManyToOne(type => Link, link => link.comments, { onDelete: "CASCADE" })
    link!: Link;

    @Column()
    public value!: string;
}