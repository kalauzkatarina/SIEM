import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("log_hashes") // Tabela u bazi se može zvati log_hashes
export class IntegrityLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    eventId!: number; // ID iz MySQL 'event' tabele

    @Column({ type: "varchar", length: 64 })
    hash!: string; // SHA-256 hash (podaci + prethodni hash)

    @Column({ type: "varchar", length: 64, nullable: true })
    previousHash!: string; // "Lanac" koji povezuje sa prethodnim logom

    @Column({ default: false })
    isCompromised!: boolean; // Flag za narušen integritet

    @CreateDateColumn()
    createdAt!: Date;
}