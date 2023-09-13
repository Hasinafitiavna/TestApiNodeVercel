import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Utilisateur extends BaseEntity{
    @PrimaryGeneratedColumn()
    idutilisateur: number;

    @Column({default: "a"})
    nom: string;

    @Column({default: "a"})
    prenom: string;

    @Column({default: "a"})
    email: string;

    @Column({default: "a"})
    password: string;
}
