import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_HOST } from './constants';

const elasticsearchClient = new Client({
  node: ELASTICSEARCH_HOST,
});

export default elasticsearchClient;
