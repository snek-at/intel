const mergeCodetransition = (arr: any[]) => {
  const result: any[] = [];

  arr.reduce(function (res: any, value: any) {
    const date = value.datetime.split(" ")[0];
    if (!res[date]) {
      res[date] = {
        date: date,
        insertions: 0,
        deletions: 0,
      };
      result.push(res[date]);
    }

    try {
      res[value.datetime].insertions += parseInt(value.insertions);
      res[value.datetime].deletions += parseInt(value.deletions);
    } catch {}

    return res;
  }, {});

  return result;
};

const mergeContributionFeed = (arr: any[]) => {
  const result: any[] = [];

  arr.reduce(function (res: any, value: any) {
    const date = value.datetime.split(" ")[0];
    if (!res[date]) {
      res[date] = {
        date: date,
        total: 0,
      };
      result.push(res[date]);
    }
    try {
      res[value.datetime.split(" ")[0]].total += 1;
    } catch {}

    return res;
  }, {});
  return result;
};

export { mergeCodetransition, mergeContributionFeed };
