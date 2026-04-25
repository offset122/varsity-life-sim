export interface Building {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
}

export interface Vehicle {
  id: string;
  type: 'rocket' | 'car' | 'bike';
  name: string;
  speed: number;
  acceleration: number;
  price: number;
  owned: boolean;
  color: string;
}

export interface Inhabitant {
  id: string;
  name: string;
  status: 'Working' | 'Resting' | 'Mischief';
  activity: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'accessory' | 'tool';
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'vehicle' | 'weapon' | 'clothing';
  icon: string;
  category: string;
}