import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';

let dataSource: DataSource | null = null;

export async function getDataSource() {
  if (dataSource && dataSource.isInitialized) return dataSource;

  if (!dataSource) {
    dataSource = AppDataSource;
  }

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}
