import { Test, TestingModule } from '@nestjs/testing';
import { InfoService } from './info.service';
import { CreateInfo } from './models';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Info } from './info.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('InfoService', () => {
	let testModule: TestingModule;
	let service: InfoService;
	let MockInfoRepository;

	beforeEach(async () => {
		const infos: Info[] = [];
		let lastId = 0;

		MockInfoRepository = {
			find: () => Promise.resolve(infos),
			findOneBy: (value: { id: number }): Promise<Info> =>
				Promise.resolve(infos.find((info) => info.id === value.id)),
			save: (attrs: CreateInfo): Promise<Info> => {
				const id = ++lastId;
				infos.push({ ...attrs, id: id });
				return Promise.resolve({ ...attrs, id: id });
			},
		};

		testModule = await Test.createTestingModule({
			providers: [
				InfoService,
				{
					provide: getRepositoryToken(Info),
					useValue: MockInfoRepository,
				},
			],
		}).compile();

		service = testModule.get(InfoService);
	});

	describe('General validation', () => {
		it('Create an instance of InfoService', async () => {
			expect(service).toBeDefined();
		});
	});

	describe('GETTERS', () => {
		it('Find all', async () => {
			MockInfoRepository.save({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			MockInfoRepository.save({
				name: 'Chiara',
				surname: 'Arcidiacono',
			});
			const result = await service.findAll();
			expect(result).toEqual([
				{
					name: 'Lorenzo',
					surname: 'Arcidiacono',
					fiscalcode: 'ABC123DEF123',
					id: 1,
				},
				{
					name: 'Chiara',
					surname: 'Arcidiacono',
					id: 2,
				},
			]);
		});

		it('Find all: empty table', async () => {
			const result = await service.findAll();
			expect(result).toEqual([]);
		});

		it('Find one', async () => {
			MockInfoRepository.save({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			const result = await service.findOne(1);
			expect(result).toEqual({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
				id: 1,
			});
		});

		it('Get invoice correctly', async () => {
			MockInfoRepository.save({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			const result = await service.invoice(1);
			expect(result).toEqual(true);
		});

		it('Get invoice false', async () => {
			// Test info not completed
			MockInfoRepository.save({
				name: 'Lorenzo',
			});

			const result = await service.invoice(1);
			expect(result).toEqual(false);
		});
	});

	describe('SETTERS', () => {
		it('Save an Info', async () => {
			const result = await service.create({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			expect(result).toEqual({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
				id: 1,
			});
		});

		it('Update info', async () => {
			const user = await service.create({
				name: 'Lorenzo',
			});
			user.id += 1;

			const result = await service.update(1, {
				fiscalcode: 'ABC123DEF123',
			});
			expect(result).toEqual({
				...user,
				fiscalcode: 'ABC123DEF123',
			});
		});
	});

	describe('ERRORS', () => {
		it('Find one error', () => {
			expect(
				async () => await service.findOne(null),
			).rejects.toThrowError(BadRequestException);
		});

		it('Get invoice BadRequest error', async () => {
			expect(
				async () => await service.invoice(null),
			).rejects.toThrowError(BadRequestException);
		});

		it('Get invoice NotFound error', async () => {
			expect(async () => await service.invoice(1)).rejects.toThrowError(
				NotFoundException,
			);
		});

		it('Update info error', () => {
			expect(
				async () =>
					await service.update(1, {
						fiscalcode: 'ABC123DEF123',
					}),
			).rejects.toThrowError(NotFoundException);
		});
	});
});
