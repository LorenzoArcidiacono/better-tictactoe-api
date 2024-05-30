import { Test, TestingModule } from "@nestjs/testing";
import { InfoService } from "./info.service";
import { Info } from "./info.entity";
import { CreateInfo, UpdateInfo } from "./models";
import { InfoController } from "./info.controller";
import { NotFoundException } from "@nestjs/common";
import { BaseResponse } from "src/interfaces";


describe('InfoController', () => {
	let testModule: TestingModule;
    let controller: InfoController;
	let MockService: Partial<InfoService>;

	beforeEach(async () => {
		const infos: Info[] = [];
		let lastId = 0;

		MockService = {
			findAll: (): Promise<Info[]> => Promise.resolve(infos),
			findOne: (id: number ): Promise<Info> =>
				Promise.resolve(infos.find((info) => info.id === id)),
			create: (attrs: CreateInfo): Promise<Info> => {
				const id = ++lastId;
				infos.push({ ...attrs, id: id });
				return Promise.resolve({ ...attrs, id: id });
			},
            update:(id, attrs: UpdateInfo): Promise<Info> =>{
                const info = infos.find((info) => info.id === id);
                if (!info) {
                    throw new NotFoundException(`Info with id:${id} not found`);
                }

                Object.assign(info, attrs);
                return Promise.resolve(info);
            },
            invoice: (id: number): Promise<boolean> => {
                const info = infos.find((info) => info.id === id);
                if (!info) {
                    throw new NotFoundException(`Info with id:${id} not found`);
                  }
              
                  if ( !info.surname || !info.fiscalcode) {
                    return Promise.resolve(false);
                  }
              
                  return Promise.resolve(true);
            },
            validateInfo:(rawData) : Promise<BaseResponse> => Promise.resolve(null)
		};

		testModule = await Test.createTestingModule({
			providers: [
				{
					provide: InfoService,
					useValue: MockService,
				},
			],
            controllers:[InfoController],
		}).compile();

        controller = testModule.get(InfoController);
	});

    describe('General validation', () => {
		it('Create an instance of InfoService', async () => {
			expect(controller).toBeDefined();
		});
	});

    describe('GETTERS', () => {
		it('GET /info', async () => {
			MockService.create({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			MockService.create({
				name: 'Chiara',
				surname: 'Arcidiacono',
			});
			const result = await controller.getAll();
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

		it('GET /info : empty table', async () => {
			const result = await controller.getAll();
			expect(result).toEqual([]);
		});

		it('GET /info/:id', async () => {
			MockService.create({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});

			const result = await controller.get("1");
			expect(result).toEqual({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
				id: 1,
			});
		});

		it('Get /info/:id/invoice', async () => {
			MockService.create({
				name: 'Lorenzo',
				surname: 'Arcidiacono',
				fiscalcode: 'ABC123DEF123',
			});
			const result = await controller.invoice("1");
			expect(result).toEqual(true);
		});

		it('Get /info/:id/invoice -> false', async () => {
			// Test info not completed
			MockService.create({
				name: 'Lorenzo',
			});

			const result = await controller.invoice("1");
			expect(result).toEqual(false);
		});
	});

    describe('SETTERS', () => {
		it('POST /info', async () => {
			const result = await controller.create({
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

		it('PATCH /info/:id', async () => {
			const user = await controller.create({
				name: 'Lorenzo',
			});

			const result = await controller.updateInfo("1", {
				fiscalcode: 'ABC123DEF123',
			});
			expect(result).toEqual({
				...user,
				fiscalcode: 'ABC123DEF123',
			});
		});
	});

	describe('ERRORS', () => {
		it('GET /info/:id', () => {
			expect(
				async () => await controller.get(null),
			).rejects.toThrowError(NotFoundException);
		});

		it('GET /info/:id/invoice', async () => {
			expect(
				async () => await controller.invoice(null),
			).rejects.toThrowError(NotFoundException);
		});

		it('GET /info/:id/invoice', async () => {
			expect(async () => await controller.invoice("1")).rejects.toThrowError(
				NotFoundException,
			);
		});

		it('PATCH /info/:id', () => {
			expect(
				async () =>
					await controller.updateInfo("1", {
						fiscalcode: 'ABC123DEF123',
					}),
			).rejects.toThrowError(NotFoundException);
		});

	});
});