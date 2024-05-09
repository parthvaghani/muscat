import { GeneralIcon } from './icon';

export interface NoticeType {
  id: number;
  project_id: number;
  title: string;
  content: string;
  create_by: string;
  file: Record<string, any>; // Assuming file is an object with dynamic keys
}
