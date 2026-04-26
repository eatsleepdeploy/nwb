import * as migration_20260426_060025 from './20260426_060025';

export const migrations = [
  {
    up: migration_20260426_060025.up,
    down: migration_20260426_060025.down,
    name: '20260426_060025'
  },
];
