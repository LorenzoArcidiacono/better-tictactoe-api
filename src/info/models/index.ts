import {
  UpdateInfoRequest as UpdateInfoRequestInterface,
  UpdateAllInfoRequest as UpdateAllInfoRequestInterface,
} from '../interfaces';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Min,
  Max,
  IsBoolean,
  IsInt,
  IsDateString,
  ValidateIf,
  IsDefined,
  MaxLength,
  IsOptional,
} from 'class-validator';
import * as moment from 'moment';

export class UpdateInfoRequest implements UpdateInfoRequestInterface {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;
}

export class UpdateAllInfoRequest implements UpdateAllInfoRequestInterface {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(150)
  age: number;

  @ValidateIf((o) => o.age >= 18)
  @IsNotEmpty()
  @IsBoolean()
  married?: boolean;

  @IsNotEmpty()
  @IsDateString()
  birthdate: string;

  // Can't use custom validators because comparison between two values
  @ValidateIf((o) => {
    const date = moment(o.birthdate);
    const now = moment();
    const years = now.diff(date, 'year');
    return !(years === o.age);
  })
  @IsDefined({ message: 'Age must be coherent with birth date' })
  readonly checkAge: undefined;
}

export class CreateInfo {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fiscalcode?: string;
}

export class UpdateInfo {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fiscalcode?: string;
}
