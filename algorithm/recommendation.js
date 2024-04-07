export const recommendationModel = (allPackages, userHistory) => {
  const keywords = [];
  userHistory.forEach((value) => {
    keywords.push(...value.p_keywords);
  });
  let count = {};
  for (let k of keywords) {
    count[k] = count[k] ? count[k] + 1 : 1;
  }
  console.log(count);
  // const unique = Array.from(new Set(keywords));
  const recommendedPackages = allPackages.filter((value, index) => {
    return value.p_keywords.some(
      (k) =>
        count[k] >= Math.min(...Object.values(count)) + 1 &&
        count[k] <= Math.max(...Object.values(count))
    );
  });

  return recommendedPackages;
};
