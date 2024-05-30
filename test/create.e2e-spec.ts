import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Create info entry (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
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
	});

	it('POST /info', () => {
		return request(app.getHttpServer())
			.post('/info')
			.send({ name: 'Andrea' })
			.expect(201)
			.then((res) => {
				const { id, name } = res.body;
				expect(id).toBeDefined();
				expect(name).toBe('Andrea');
			});
	});

	it('POST /info -> surname, fiscalcode', () => {
		return request(app.getHttpServer())
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
