import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "./user";

@Entity()
export class Vote {

    @PrimaryGeneratedColumn()
    public vote_id!: number;

    @ManyToOne(type => User, user => user.votes)
    user!: User;

    @Column()
    public link_id!: number;

    @Column()
    public value!: boolean;
}