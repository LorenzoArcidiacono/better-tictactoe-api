import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDB } from './test.utils';
import { Info } from 'src/info/info.entity';

describe('Create info entry (e2e)', () => {
	let app: INestApplication;
	let server;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);
		await app.init();
		server = app.getHttpServer();
	});

	afterAll(async () => {
		await clearDB(app);
		server.close();

		await app.close();
		// Close the server instance after each test
	});

	describe('Correct update', () => {
		it('Path /info/:id', async () => {
			let last: Info;
			await request(server)
				.post('/info')
				.send({
					name: 'Giovanni',
				})
				.then((res) => {
					last = res.body;
				});

			await request(server)
				.patch(`/info/${last.id}`)
				.send({
					surname: 'Rossi',
					fiscalcode: 'ANDR123BCS',
				})
				.expect(200)
				.then((res) => {
					const { id, name, surname, fiscalcode } = res.body;
					expect(id).toBe(last.id);
					expect(name).toBe(last.name);
					expect(surname).toBe('Rossi');
					expect(fiscalcode).toBe('ANDR123BCS');
				});
		});
	});

	describe('Update errors', () => {
		it('Patch /info/:id error setting name to " "', async () => {
			let last: Info;
			await request(server)
				.post('/info')
				.send({
					name: 'Andrea',
				})
				.then((res) => {
					last = res.body;
				});

			await request(server)
				.patch(`/info/${last.id}`)
				.send({
					name: '',
					surname: 'Rossi',
					fiscalcode: 'ANDR123BCS',
				})
				.expect(400);
		});

		it('Patch /info/:id error id not found', async () => {
			await request(server)
				.patch(`/info/1`)
				.send({
					name: 'Lorenzo',
					surname: 'Rossi',
					fiscalcode: 'ANDR123BCS',
				})
				.expect(404)
				.then((res) => {
					expect(res.body.message).toContain(
						'Info with id:1 not found',
					);
					expect(res.body.error).toBe('Not Found');
				});
		});
	});
});
