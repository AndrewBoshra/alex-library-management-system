import { PageMetaDto } from '@common/dto/page-meta.dto';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PageDto } from '@common/dto/page.dto';
import { SelectQueryBuilder } from 'typeorm';

export class QueryService<T> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<T>,
    private readonly pageOptionsDto: PageOptionsDto,
  ) {}

  apply(cb: (queryBuilder: SelectQueryBuilder<T>) => void) {
    cb(this.queryBuilder);
    return this;
  }

  applyIf(
    condition: boolean,
    cb: (queryBuilder: SelectQueryBuilder<T>) => void,
  ) {
    if (condition) {
      this.apply(cb);
    }
    return this;
  }

  paginateQuery() {
    const { take, skip } = this.pageOptionsDto;
    this.queryBuilder.skip(skip).take(take);
    return this;
  }

  async toResponse<D>(mapper = (entity: T) => entity as unknown as D) {
    const data = await this.queryBuilder.getMany();
    const itemCount = await this.queryBuilder.getCount();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: this.pageOptionsDto,
    });

    return new PageDto(data.map(mapper), pageMetaDto);
  }
}
