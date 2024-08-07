import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(query: string) {
    console.log(query);
    const esQuery = {
      index: "products",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['material', 'collection.collectionName', 'texture.texture_name', 'coating.coating_name', 'masonry.masonry_name', 'colors.color.color']
          }
        }
      }
    }
    try {
      const response = await this.elasticsearchService.search<any>(esQuery);

      console.log('Search results:', response.hits.hits);

      return response.hits.hits.map(hit => hit._source);
    } catch (error) {
      console.error('Elasticsearch query error:', error);
      throw error;
    }
  }
}
