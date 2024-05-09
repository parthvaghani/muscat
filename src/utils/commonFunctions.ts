import axiosPost from '@pages/axiosWrapper';
import { notification } from 'antd';
 
/**
 * 시간(time) 관련
 */
// 현재 시간(epoch)
export function nowEpoch(): any {
  return new Date().getTime() / 1000;
}

// 시간 차이로 보기
export function timeDiffFromUTCEpoch(epochUTC: any): string {
  if (epochUTC === '' || epochUTC === 0) {
    return '-';
  }
  const inputEpoch = parseInt(epochUTC, 10) * 1000;
  const nowEpoch = new Date().getTime();
  let diff = '';
  const absDiff = Math.abs(nowEpoch - inputEpoch) / 1000;

  interface localeDataType {
    [key: string]: any;
  }

  const timeEncode: localeDataType = {
    ko: {
      sec: '초',
      min: '분',
      hour: '시간',
      day: '일',
      month: '개월',
      year: '년',
      now: '지금',
    },
    ja: {
      sec: '秒',
      min: '分',
      hour: '時間',
      day: '日',
      month: 'ヶ月',
      year: '年',
      now: '現在',
    },
    en: {
      sec: 'sec',
      min: 'min',
      hour: 'hour',
      day: 'days',
      month: 'month',
      year: 'year',
      now: 'now',
    },
  };

  const localStorageLang = localStorage.getItem('language');
  const lang = localStorageLang && timeEncode[localStorageLang];

  if (absDiff !== 0) {
    if (absDiff < 61) {
      // 초단위 차이로 처리
      diff = String(parseInt(String(absDiff), 10)) + lang.sec;
    } else if (absDiff < 3601) {
      // 분단위 차이
      diff = String(parseInt(String(absDiff / 60), 10)) + lang.min;
    } else if (absDiff < 86401) {
      // 시간단위 차이
      diff = String(parseInt(String(absDiff / 3600), 10)) + lang.hour;
    } else if (absDiff < 2592001) {
      // 일단위 차이
      diff = String(parseInt(String(absDiff / 86400), 10)) + lang.day;
    } else if (absDiff < 31536001) {
      // 월단위 차이
      diff = String(parseInt(String(absDiff / 2592000), 10)) + lang.month;
    } else {
      // 년단위 차이
      diff = String(parseInt(String(absDiff / 31536000), 10)) + lang.year;
    }
  } else {
    // 현재
    diff = lang.now;
  }

  return diff;
}

export function fitTwoDigit(n: any) {
  return n < 10 ? `0${n}` : n;
}

// epoch 시간을 utc 시간으로 변환
export function timeFormatFromUTCEpoch(epochUTC: any, formatType?: any) {
  epochUTC = Number(epochUTC);
  if (!epochUTC) {
    return '-';
  }
  if (typeof formatType === 'undefined') {
    formatType = 1;
  }

  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(epochUTC);

  const yyyy = d.getFullYear();
  const MM = d.getMonth() + 1;
  const dd = d.getDate();
  const hh = d.getHours();
  const mm = d.getMinutes();
  const ss = d.getSeconds();

  if (localStorage.getItem('language') === 'en') {
    if (formatType === 1) {
      return `${fitTwoDigit(MM)}/${fitTwoDigit(dd)}/${yyyy} ${fitTwoDigit(hh)}:${fitTwoDigit(
        mm,
      )}:${fitTwoDigit(ss)}`;
    }
    if (formatType === 2) {
      return `${fitTwoDigit(MM)}/${fitTwoDigit(dd)}/${yyyy} ${fitTwoDigit(hh)}:${fitTwoDigit(mm)}`;
    }
    if (formatType === 3) {
      return `${fitTwoDigit(MM)}/${fitTwoDigit(dd)}/${yyyy}`;
    }
    if (formatType === 10) {
      return `${fitTwoDigit(hh)}:${fitTwoDigit(mm)}:${fitTwoDigit(ss)}`;
    }
  } else if (formatType === 1) {
    return `${yyyy}-${fitTwoDigit(MM)}-${fitTwoDigit(dd)} ${fitTwoDigit(hh)}:${fitTwoDigit(
      mm,
    )}:${fitTwoDigit(ss)}`;
  } else if (formatType === 2) {
    return `${yyyy}-${fitTwoDigit(MM)}-${fitTwoDigit(dd)} ${fitTwoDigit(hh)}:${fitTwoDigit(mm)}`;
  } else if (formatType === 3) {
    return `${yyyy}-${fitTwoDigit(MM)}-${fitTwoDigit(dd)}`;
  } else if (formatType === 4) {
    return `${yyyy}-${fitTwoDigit(MM)}`;
  } else if (formatType === 10) {
    return `${fitTwoDigit(hh)}:${fitTwoDigit(mm)}:${fitTwoDigit(ss)}`;
  }

  return false;
}

// 초 단위 시간 변환
export function timeDiffFromSeconds(seconds: any) {
  if (seconds === '' || seconds === 0) {
    return '-';
  }

  const timeEncode: any = {
    ko: {
      sec: '초',
      min: '분',
      hour: '시간',
      day: '일',
      month: '개월',
      year: '년',
      now: '지금',
    },
    ja: {
      sec: '秒',
      min: '分',
      hour: '時間',
      day: '日',
      month: 'ヶ月',
      year: '年',
      now: '現在',
    },
    en: {
      sec: 'sec',
      min: 'min',
      hour: 'hour',
      day: 'days',
      month: 'month',
      year: 'year',
      now: 'now',
    },
  };

  const diff = [];
  const localLang: any = localStorage.getItem('language') || 'ko';
  const lang = timeEncode[localLang];

  if (seconds) {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;

    if (hour > 0) {
      diff.push(hour + lang.hour);
    }

    if (min > 0) {
      diff.push(min + lang.min);
    }

    if (sec > 0) {
      diff.push(sec + lang.sec);
    }
  }

  return diff.join(' ');
}

// [{},{}] 구조에서 followOrder 적용 배열 리턴
export const getFollowOrderArray = (
  data: Array<{ [key: string]: any }>,
  mainKey: string,
  orderKey: string,
) => {
  if (
    typeof data !== 'object' ||
    typeof mainKey === 'undefined' ||
    typeof orderKey === 'undefined'
  ) {
    return [];
  }
  const orderArray = [];
  const orderMapper: { [key: string]: any } = {};
  const orderParameter: { [key: string]: any } = {};
  const reverseMapper: { [key: string]: any } = {};
  for (let i = 0; i < data.length; i += 1) {
    const obj = data[i];
    if (obj[orderKey] === '') {
      orderArray.push(i);
    } else {
      orderParameter[obj.parameter] = i;
      reverseMapper[obj[orderKey]] = obj.parameter;
      orderMapper[obj[orderKey]] = i;
    }
  }
  // followOrder 가 공백이 아닌것으로 시작하는 경우
  if (orderArray.length === 0) {
    Object.keys(orderMapper).forEach((key) => {
      if (String(key) in orderMapper) {
        if (typeof orderParameter[key] === 'undefined') {
          orderArray.push(orderParameter[reverseMapper[key]]);
          delete orderMapper[key];
        }
      }
    });
  }
  let orderArraySize = 0;
  while (orderArraySize !== orderArray.length) {
    orderArraySize = orderArray.length;
    const nextOrderKey: any = data[orderArray[orderArraySize - 1]][mainKey];
    if (nextOrderKey in orderMapper && orderMapper[nextOrderKey] !== 'undefined') {
      orderArray.push(orderMapper[nextOrderKey]);
    }
  }

  if (data.length !== orderArray.length) {
    return [];
  }

  return orderArray;
};

// 시간을 epoch시간으로 변환
export function epochFromDate(dateString: any): any {
  const epoch = new Date(dateString).getTime() / 1000;
  if (Number.isNaN(epoch)) {
    return '-';
  }
  if (epoch < 0) {
    return '-';
  }

  return epoch;
}

// 우측 영역 알림 팝업(기존 스낵바와 같은 기능)
export const openNotification = (message: string, option?: any) => {
  notification.success({
    message: message,
    duration: 3,
    ...option,
  });
};

// 파일 사이즈 변환
export const fileSizeTransform = (size: any, decimal?: any) => {
  size = Number(size);
  if (size === 0) {
    return { common: '0B', size: '0', unit: 'B' };
  }

  decimal = typeof decimal !== 'undefined' ? decimal : 0;
  const s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const e = Math.floor(Math.log(size) / Math.log(1024));

  return {
    common: (size / 1024 ** e).toFixed(decimal) + s[e], // (= Math.pow(1024, e))
    size: (size / 1024 ** e).toFixed(decimal),
    unit: s[e],
  };
};

export const humanFileSize = (bytes: number) => {
  if (Math.abs(bytes) < 1024) {
    return `${bytes} B`;
  }

  // const units = thresh === 1000
  //   ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  //   : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let u = -1;
  do {
    bytes /= 1024;
    u += 1;
  } while (Math.abs(bytes) >= 1024 && u < units.length - 1);

  return `${bytes.toFixed(1)} ${units[u]}`;
};

export const commaNumber = (number: number) => {
  return number.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};

// 태그 초성 추출
export const getInitialTag = (text: string) => {
  if (text.length < 1) return false;

  const koChar = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
  ];

  // 초성 추출
  if (text.charCodeAt(0) && text.charCodeAt(0) >= 0xac00) {
    const unicode = text.charCodeAt(0) - 0xac00;
    const first: number = (unicode - (unicode % 28)) / 28 / 21;
    return koChar[Math.floor(first)];
  }
  // 초성이 아닐 시 문자열 첫 글자 추출
  return text.charAt(0);
};
