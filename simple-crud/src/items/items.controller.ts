import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import type { Item } from './items.service';

export class CreateItemDto {
  name: string;
  description?: string;
  price: number;
}

export class UpdateItemDto {
  name?: string;
  description?: string;
  price?: number;
}

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Item {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() itemData: CreateItemDto): Item {
    return this.itemsService.create(itemData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateItemDto): Item {
    return this.itemsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.itemsService.remove(id);
  }
}
