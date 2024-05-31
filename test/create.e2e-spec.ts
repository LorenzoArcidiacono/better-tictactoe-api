import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { clearDB } from './test.utils';

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

	describe('Create an info', () => {
		it('POST /info', async () => {
			return await request(server)
				.post('/info')
				.send({ name: 'Andrea' })
				.expect(201)
				.then((res) => {
					const { id, name } = res.body;
					expect(id).toBeDefined();
					expect(name).toBe('Andrea');
				});
		});

		it('POST /info -> surname, fiscalcode', async () => {
			return await request(server)
				.post('/info')
				.send({
					name: 'Giovanni',
					surname: 'Rossi',
					fiscalcode: 'ANDR123BCS',
				})
				.expect(201)
				.then((res) => {
					const { id, name, surname, fiscalcode } = res.body;
					expect(id).toBeDefined();
					expect(name).toBe('Giovanni');
					expect(surname).toBe('Rossi');
					expect(fiscalcode).toBe('ANDR123BCS');
				});
		});
	});

	describe('Create an info errors', () => {
		it('POST /info -> try adding wrong password info entry', async () => {
			return await request(server)
				.post('/info')
				.send({
					name: 'Giovanni',
					password: '123abc',
				})
				.expect(201)
				.then((res) => {
					const { id, name, password } = res.body;
					expect(id).toBeDefined();
					expect(name).toBe('Giovanni');
					expect(password).not.toBeDefined();
				});
		});

		it('POST /info -> try adding wrong type info entry', async () => {
			return await request(server)
				.post('/info')
				.send({
					name: '',
					surname: 123,
					fiscalcode: 123,
				})
				.expect(400)
				.then((res) => {
					expect(res.body.message).toContain(
						'name should not be empty',
					);
					expect(res.body.message).toContain(
						'surname must be a string',
					);
					expect(res.body.message).toContain(
						'fiscalcode must be a string',
					);
				});
		});
	});
});
