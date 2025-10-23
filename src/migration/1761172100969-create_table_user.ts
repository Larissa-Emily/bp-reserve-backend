import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1761172100969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public."user"(
                id SERIAL NOT NULL PRIMARY KEY,
                name character varying NOT NULL,
                sector character varying NOT NULL,
                email character varying NOT NULL,
                password character varying NOT NULL,
                role character varying NOT NULL
            );

            CREATE SEQUENCE public.user_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;

            ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;

            ALTER TABLE ONLY public."user"
            ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public."user";
        `);
    }

}
