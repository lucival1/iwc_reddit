import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    public link_id!: number;
    @Column()
    public user_id!: number;
    @Column()
    public url!: string;
    @Column()
    public title!: string;
}