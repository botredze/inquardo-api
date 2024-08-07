// import { Injectable } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';

// @Injectable()
// export class SearchService {
//   constructor(private readonly elasticsearchService: ElasticsearchService) {}

//   async search(query: string) {
//     const esQuery = {
//       index: 'products',
//       body: {
//         query: {
//           bool: {
//             should: [
//               {
//                 fuzzy: {
//                   material: {
//                     value: query,
//                     fuzziness: 'AUTO',
//                   },
//                 },
//               },
//               {
//                 fuzzy: {
//                   'collection.collectionName': {
//                     value: query,
//                     fuzziness: 'AUTO',
//                   },
//                 },
//               },
//               {
//                 fuzzy: {
//                   'texture.texture_name': {
//                     value: query,
//                     fuzziness: 'AUTO',
//                   },
//                 },
//               },
//               {
//                 fuzzy: {
//                   'coating.coating_name': {
//                     value: query,
//                     fuzziness: 'AUTO',
//                   },
//                 },
//               },
//               {
//                 fuzzy: {
//                   'masonry.masonry_name': {
//                     value: query,
//                     fuzziness: 'AUTO',
//                   },
//                 },
//               },
//               {
//                 nested: {
//                   path: 'colors',
//                   query: {
//                     fuzzy: {
//                       'colors.color.color': {
//                         value: query,
//                         fuzziness: 'AUTO',
//                       },
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       },
//     };

//     console.log('Elasticsearch query:', JSON.stringify(esQuery, null, 2));

//     try {
//       const response = await this.elasticsearchService.search<any>(esQuery);

//       console.log('Search results:', response.hits.hits);

//       return response.hits.hits.map(hit => hit._source);
//     } catch (error) {
//       console.error('Elasticsearch query error:', error);
//       throw error;
//     }
//   }
// }
