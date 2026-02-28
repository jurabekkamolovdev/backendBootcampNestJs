import { Injectable, NotFoundException } from '@nestjs/common';

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
}

@Injectable()
export class ItemsService {
  private readonly items: Map<string, Item> = new Map<string, Item>();

  findAll(): Item[] {
    return Array.from(this.items.values());
  }

  findOne(id: string): Item {
    const item = this.items.get(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  create(itemData: Omit<Item, 'id'>): Item {
    const id = Date.now().toString(); // simple ID generation
    const newItem: Item = { id, ...itemData };
    this.items.set(id, newItem);
    return newItem;
  }

  update(id: string, updateData: Partial<Item>): Item {
    const existingItem = this.findOne(id);
    const updatedItem = { ...existingItem, ...updateData };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  remove(id: string): void {
    if (!this.items.has(id)) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.items.delete(id);
  }
}
