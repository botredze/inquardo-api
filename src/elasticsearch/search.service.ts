import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(query: string) {
    const response = await this.elasticsearchService.search<any>({
      index: 'products',
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: [
                    'productName^3',
                    'colors.colorName^2',
                    'coating.coatingName^2',
                    'category.name^2',
                    'sizes.sizeName^2',
                    'status.name^2',
                  ],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                  operator: 'and',
                },
              },
              {
                match: {
                  productName: {
                    query,
                    fuzziness: 'AUTO',
                    operator: 'and',
                    boost: 3,
                  },
                },
              },
              {
                nested: {
                  path: 'colors',
                  query: {
                    match: {
                      'colors.colorName': {
                        query,
                        fuzziness: 'AUTO',
                        operator: 'and',
                        boost: 2,
                      },
                    },
                  },
                },
              },
              {
                nested: {
                  path: 'sizes',
                  query: {
                    match: {
                      'sizes.sizeName': {
                        query,
                        fuzziness: 'AUTO',
                        operator: 'and',
                        boost: 2,
                      },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    });
    return response.hits.hits.map(hit => hit._source);
  }
}
