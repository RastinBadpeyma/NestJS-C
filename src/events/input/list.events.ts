export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
}

export enum WhenEventFilter {
  All = 1,
  Today, //2
  Tommorow, //3
  ThisWeek, //4
  NextWeek  //5
}