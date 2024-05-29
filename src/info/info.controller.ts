import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { InfoService } from './info.service';
import { UpdateAllInfoRequest } from './interfaces';
import { BaseResponse } from '../interfaces';
import { Info } from './info.entity';
import { CreateInfo, UpdateInfo } from './models';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  getAll(): Promise<Info[]> {
    return this.infoService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Info> {
    const info = await this.infoService.findOne(parseInt(id));
    if (!info) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return info;
  }

  @Post('')
  create(@Body() body: CreateInfo) {
    return this.infoService.create(body);
  }

  @Patch(':id')
  updateInfo(@Param('id') id: string, @Body() body: UpdateInfo) {
    return this.infoService.update(parseInt(id), body);
  }

  @Get(':id/invoice/')
  invoice(@Param('id') id: string) {
    return this.infoService.invoice(parseInt(id));
  }

  @Post('/validate')
  getConfig(@Body() bodyRequest: UpdateAllInfoRequest): Promise<BaseResponse> {
    return this.infoService.validateInfo(bodyRequest);
  }
}
