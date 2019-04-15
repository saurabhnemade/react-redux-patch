import createHashHistory from 'history/createHashHistory';
import qhistory from 'qhistory';
import { stringify, parse } from 'qs';

let history = null;

export function createHistory(config) {
    history = qhistory(
        createHashHistory(config),
        stringify,
        parse
    );
    return history;
}

export function getHistory() {
    if (!history) {
        return createHistory();
    }
    return history;
}