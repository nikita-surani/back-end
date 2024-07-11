import { ApiProperty } from '@nestjs/swagger';

export class BoolResult {
  @ApiProperty({ example: true })
  public value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}
