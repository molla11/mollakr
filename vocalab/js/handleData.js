const startTimeInHandleData = new Date().getTime();

const wordMap = new Map();

for (const dayObj of words) {
  const tempMap = new Map();
  for (const wordObj of dayObj.words) {
    tempMap.set(wordObj.id, wordObj);
  }
  wordMap.set(dayObj.day, tempMap);
}

const endTimeInHandleData = new Date().getTime();

console.log(
  `data has been formatted. (${endTimeInHandleData - startTimeInHandleData}ms)`
);
