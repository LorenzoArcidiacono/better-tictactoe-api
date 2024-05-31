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

	describe('Get all info', () => {
		it('GET /info empty', async () => {
			await request(server)
				.get('/info')
				.expect(200)
				.then((res) => {
					expect(res.body.length).toBe(0);
				});
		});

		it('GET /info not empty', async () => {
			await request(server).post('/info').send({ name: 'Andrea' });

			await request(server)
				.get('/info')
				.expect(200)
				.then((res) => {
					expect(res.body.length).toBe(1);
					res.body.forEach((info) => {
						const { id, name, surname, fiscalcode } = info;
						expect(id).toBeDefined();
						expect(name).toBe('Andrea');
						expect(surname).toBe(null);
						expect(fiscalcode).toBe(null);
					});
				});
		});

		it('GET /info multiple entries', async () => {
			await request(server)
				.post('/info')
				.send({ name: 'Lorenzo', surname: 'Arcidiacono' });

			await request(server)
				.get('/info')
				.expect(200)
				.then((res) => {
					expect(res.body.length).toBe(2);
				});
		});
	});

	describe('Get single info', () => {
		it('GET /info/:id', async () => {
			let last: Info;
			await request(server)
				.post('/info/')
				.send({ name: 'Lorenzo', surname: 'Arcidiacono' })
				.then((res) => {
					last = res.body;
				});

			await request(server)
				.get(`/info/${last.id}`)
				.expect(200)
				.then((res) => {
					const { id, name, surname, fiscalcode } = res.body;
					expect(id).toBe(last.id);
					expect(name).toBe(last.name);
					expect(surname).toBe(last.surname);
					expect(fiscalcode).toBe(null);
				});
		});

		it('GET /info/:id wrong id', async () => {
			await request(server)
				.get(`/info/1`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('User 1 not found');
					expect(res.body.error).toBe('Not Found');
				});
		});
	});
});
