/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class AddRoleToUsers1776049000000 {
  /**
   * @param {QueryRunner} queryRunner
   */
  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "role" varchar NOT NULL DEFAULT 'user'`,
    );
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  async down(queryRunner) {
    // SQLite doesn't support DROP COLUMN easily, but we can do it if needed.
    // For simplicity in this dev environment:
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
