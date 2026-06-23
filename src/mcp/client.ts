import { Transaction } from '../types';

const MCP_CONFIG = {
  serverUrl: 'BURAYA_MCP_SERVER_URL',
  apiKey:    'BURAYA_API_KEY',
};

export async function syncTransactions(_transactions: Transaction[]): Promise<void> {
  // MCP entegrasyonu buraya eklenecek
  console.log('MCP sync henüz yapılandırılmadı.', MCP_CONFIG);
}
