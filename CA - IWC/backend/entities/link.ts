import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";

@Entity()
export class Link {

    @PrimaryGeneratedColumn()
    public link_id!: number;

    @ManyToOne(type => User, user => user.links)
    user!: User;

    @Column()
    public title!: string;

    @Column()
    public url!: string;

    @OneToMany(type => Comment, comment => comment.link)
    comments!: Comment[];
}