import * as migration_20260426_060025 from './20260426_060025';
import * as migration_20260524_013301_add_tag_description from './20260524_013301_add_tag_description';

export const migrations = [
  {
    up: migration_20260426_060025.up,
    down: migration_20260426_060025.down,
    name: '20260426_060025',
  },
  {
    up: migration_20260524_013301_add_tag_description.up,
    down: migration_20260524_013301_add_tag_description.down,
    name: '20260524_013301_add_tag_description'
  },
];
