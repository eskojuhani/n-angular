import { StoreService } from '../../services/store.service';

export function memo<T extends Function>(fnToMemoize: T): T {
  let prevArgs = [{}];
  let result;

  return function (...newArgs) {
    if (hasDifferentArgs(prevArgs, newArgs)) {
      result = fnToMemoize(...newArgs);
      prevArgs = newArgs;
    }
    return result;
  } as any;
}

function hasDifferentArgs(prev: unknown[], next: unknown[]) {
  if (prev.length !== next.length) return true;
  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) return true;
  }
  return false;
}
/*
function dayAddition(date, days) {
  var from = new Date(date);
  from.setDate(from.getDate() + days);

  return from.toISOString().slice(0, 10);
}

function fetchTeamShortHistory(teamId, gameDate) {
  var metadata = {
    "table": "vPerformanceMA",
    "where": [JSON.stringify([
      { "teamId = ": teamId }, 
      { "season = ": '2022-2023' },
      { "gameDate > ": gameDate },
      { "gameDate < ": dayAddition(gameDate, 10) }
    ])],
    "order": "row_num desc"
  };

  storeService.selectAll(metadata)
    .subscribe(response => {
      if (response) {
        this.homePerformance = response;
      }
    }),
    err => {
      console.log("Error occured.")
    };
}
*/
