import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UpdateInfoRequest as UpdateInfoRequestInterface,
  UpdateAllInfoRequest as UpdateAllInfoRequestInterface,
} from './interfaces';
import { BaseResponse } from '../interfaces';
import {
  CreateInfo,
  UpdateAllInfoRequest,
  UpdateInfo,
  UpdateInfoRequest,
} from './models';
import { Info } from './info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InfoService {
  constructor(
    @InjectRepository(Info)
    private infosRepository: Repository<Info>,
  ) {}

  findAll(): Promise<Info[]> {
    return this.infosRepository.find();
  }

  findOne(id: number): Promise<Info | null> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    return this.infosRepository.findOneBy({ id });
  }

  create(attrs: CreateInfo): Promise<Info> {
    return this.infosRepository.save({
      name: attrs.name,
      surname: attrs.surname,
      fiscalcode: attrs.fiscalcode,
    });
  }

  async update(id, attrs: UpdateInfo): Promise<Info> {
    const info = await this.findOne(id);
    if (!info) {
      throw new NotFoundException(`Info with id:${id} not found`);
    }

    Object.assign(info, attrs);
    return this.infosRepository.save(info);
  }

  async invoice(id: number): Promise<boolean> {
    const info = await this.findOne(id);

    if (!info || !info.surname || !info.fiscalcode) {
      return false;
    }

    return true;
  }

  async validateInfo(
    rawData: UpdateAllInfoRequestInterface,
  ): Promise<BaseResponse> {
    // class validation methods
    const isUpdateAllInfoRequest = (
      value: UpdateAllInfoRequestInterface,
    ): value is UpdateAllInfoRequestInterface => {
      return !!value?.name && !!value?.age && !!value?.birthdate;
    };

    let data = {};

    // check which class implements
    if (isUpdateAllInfoRequest(rawData)) {
      data = plainToClass(UpdateAllInfoRequest, rawData);
    } else {
      data = plainToClass(UpdateInfoRequest, rawData);
    }

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }
    return {
      success: true,
      data,
    };
  }
}
