import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UpdateInfoRequest as UpdateInfoRequestInterface,
  UpdateAllInfoRequest as UpdateAllInfoRequestInterface,
} from './interfaces';
import { BaseResponse } from '../interfaces';
import { UpdateAllInfoRequest, UpdateInfoRequest } from './models';

@Injectable()
export class InfoService {
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
