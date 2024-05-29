import { Controller, Post, Body, Get } from '@nestjs/common';
import { InfoService } from './info.service';
import { UpdateInfoRequest, UpdateAllInfoRequest } from './interfaces';
import { BaseResponse } from '../interfaces';
import { Info } from './info.entity';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  getAll(): Promise<Info[]> {
    return this.infoService.findAll();
  }

  @Post('')
  create(@Body() body: { name: string }) {
    return this.infoService.create(body.name);
  }

  @Post('/validate')
  getConfig(@Body() bodyRequest: UpdateAllInfoRequest): Promise<BaseResponse> {
    return this.infoService.validateInfo(bodyRequest);
  }
}


