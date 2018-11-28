import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    public vote_id!: number;
    @Column()
    public user_id!: number;
    @Column()
    public link_id!: number;
    @Column()
    public value!: boolean;
}