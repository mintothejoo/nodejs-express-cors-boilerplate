import moment from 'moment-timezone'
import {isNumeric} from './number'


export const __getDate = (timestamp, utc) => {
    let datetime;

    if(isNumeric(timestamp)) {
        return moment.unix(timestamp);
    }

    if(timestamp) {
        datetime = new Date(timestamp);
    } else {
        datetime = new Date();
    }

    if(utc) {
        return moment.utc(datetime);
    }

    return moment(datetime);
};

export const __convertDate = (timestamp) =>  {
    return __getDate(timestamp).format();
};

export const __addDaysToDate = (date, days) => {
    if(typeof date === 'string' || typeof date === 'number') {
        date = __getDate(date);
    }
    date.add(days, 'days');
    return date;
};

export const __subDaysFromDate = (days, date) => {
    if(!date) {
        date = __getDate()
    }
    if(typeof date === 'string' || typeof date === 'number') {
        date = __getDate(date)
    }
    date.subtract(days, 'days');
    return date;
};