/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  if (!name || !name.trim()) {
    return null;
  }

  const mealPriceByType = {
    veg: 80, nonveg: 120, jain: 90
  }

  if (!Object.hasOwn(mealPriceByType, mealType)) {
    return null;
  }

  const mealPricePerDay = mealPriceByType[mealType];
  const totalCost = mealPricePerDay * days;

  return { name, mealType, days, dailyRate: mealPricePerDay, totalCost }
}

export function combinePlans(...plans) {
  if (!plans || !plans.length) {
    return null;
  }

  return plans.reduce((acc, plan) => {
    if (plan) {
      acc.totalCost += 1;
      acc.totalRevenue += plan.totalCost;
      acc.totalCustomers += 1;
      acc.mealBreakdown[plan.mealType] = acc.mealBreakdown[plan.mealType] ? acc.mealBreakdown[plan.mealType] + 1 : 1
    }

    return acc;
  }, { totalCustomers: 0, totalRevenue: 0, mealBreakdown: {} })
}

export function applyAddons(plan, ...addons) {
  if (!plan) {
    return null;
  }
  const { name, mealType, days, dailyRate, totalCost } = plan;

  const addonNames = addons.map(({ name }) => name);
  const totalAddonCost = addons.reduce((acc, { price }) => acc + price, 0);

  const finalDailyRate = dailyRate + totalAddonCost;


  const updatedPlan = { name, mealType, days, dailyRate: finalDailyRate, totalCost: finalDailyRate * days, addonNames };

  return updatedPlan;
}
