import { Controller, Post, Body } from '@nestjs/common';
import { InfoService } from './info.service';
import { UpdateInfoRequest, UpdateAllInfoRequest } from './interfaces';
import { BaseResponse } from '../interfaces';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Post('/validate')
  getConfig(@Body() bodyRequest: UpdateAllInfoRequest): Promise<BaseResponse> {
    return this.infoService.validateInfo(bodyRequest);
  }
}
