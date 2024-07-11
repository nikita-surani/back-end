import { ApiProperty } from '@nestjs/swagger';

export class JsonPatchDocumentDto {
  @ApiProperty({ example: 'Value1' })
  public value: any;

  @ApiProperty({ example: '/path' })
  public path: string;

  @ApiProperty({ example: 'replace' })
  public op: string;
}
