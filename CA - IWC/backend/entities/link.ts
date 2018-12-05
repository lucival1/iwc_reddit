import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import {User} from "./user";

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
}