import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Link } from "./link";
import { Comment } from "./comment";
import { Vote } from "./vote";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    public user_id!: number;

    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @OneToMany(type => Link, link => link.user)
    links!: Link[];

    @OneToMany(type => Comment, comment => comment.user)
    comments!: Comment[];

    @OneToMany(type => Vote, vote => vote.user)
    votes!: Vote[];
}