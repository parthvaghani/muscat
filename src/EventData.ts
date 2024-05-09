const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

export interface EventType {
  title?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
}

const Events: EventType[] = [
  {
    title: '이행점검 보완제출 기간 연기1',
    allDay: true,
    start: new Date(y, m, 3),
    end: new Date(y, m, 5),
    color: 'default',
  },
 
  {
    title: '계정 생성',
    start: new Date(y, m, d + 7, 12, 0),
    end: new Date(y, m, d + 7, 14, 0),
    allDay: false,
    color: 'red',
  },
  {
    title: '자가 점검 제출',
    start: new Date(y, m, d - 2),
    end: new Date(y, m, d - 2),
    allDay: true,
    color: 'azure',
  },
  {
    title: '현장 점검(주-000)',
    start: new Date(y, m, d + 1, 19, 0),
    end: new Date(y, m, d + 1, 22, 30),
    allDay: false,
    color: 'transparent',
  },
  {
    title: '이행점검 보완제출 기간',
    start: new Date(y, m, 23),
    end: new Date(y, m, 25),
    color: 'warning',
  },
  {
    title: '이행점검 보완제출 마감',
    start: new Date(y, m, 19),
    end: new Date(y, m, 22),
    color: 'default',
  },
];

export default Events;
