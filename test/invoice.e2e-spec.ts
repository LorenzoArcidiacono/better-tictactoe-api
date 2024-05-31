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

	describe('Get invoice status', () => {
		it('GET /info/:id/invoice false', async () => {
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
				.get(`/info/${last.id}/invoice`)
				.expect(200)
				.then((res) => {
					expect(res.text).toBe('false');
				});
		});

		it('GET /info/:id/invoice true', async () => {
			let last: Info;
			await request(server)
				.post('/info')
				.send({
					name: 'Giovanni',
					surname: 'Rossi',
					fiscalcode: 'ABC123DEF',
				})
				.then((res) => {
					last = res.body;
				});

			await request(server)
				.get(`/info/${last.id}/invoice`)
				.expect(200)
				.then((res) => {
					expect(res.text).toBe('true');
				});
		});
	});

	describe('Get invoice status error', () => {
		it('GET /info/:id/invoice error', async () => {
			await request(server)
				.get(`/info/1/invoice`)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('Info with id:1 not found');
					expect(res.body.error).toBe('Not Found');
				});
		});
	});
});
