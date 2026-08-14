export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  date?: string;
  location?: string;
  category: 'all' | 'adventures' | 'smiles' | 'special' | 'candid';
  rotation?: number;
}

export interface WishItem {
  id: string;
  text: string;
  date: string;
  tag: string;
  lanternColor: string;
}
