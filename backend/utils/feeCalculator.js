// Utility to compute compulsory sanitation fee for a household.
// Formula: 6,000 VND per month * 12 months * total members of the household.
export const calculateCompulsoryFeeAmount = (household) => {
  const memberCount = household?.members?.length || 0;
  const monthlyRate = 6000;
  const monthsPerYear = 12;
  return {
    memberCount,
    amount: memberCount * monthlyRate * monthsPerYear,
  };
};
