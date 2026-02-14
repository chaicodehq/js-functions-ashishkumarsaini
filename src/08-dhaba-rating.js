/**
 * 🍛 Highway Dhaba Rating System - Higher-Order Functions
 *
 * Highway pe dhabas ki rating system bana raha hai. Higher-order functions
 * (HOF) use karne hain — aise functions jo doosre functions ko parameter
 * mein lete hain YA return karte hain.
 *
 * Functions:
 *
 *   1. createFilter(field, operator, value)
 *      - Returns a FUNCTION that filters objects
 *      - Operators: ">", "<", ">=", "<=", "==="
 *      - e.g., createFilter("rating", ">=", 4) returns a function that
 *        takes an object and returns true if object.rating >= 4
 *      - Unknown operator => return function that always returns false
 *
 *   2. createSorter(field, order = "asc")
 *      - Returns a COMPARATOR function for Array.sort()
 *      - order "asc" => ascending, "desc" => descending
 *      - Works with both numbers and strings
 *
 *   3. createMapper(fields)
 *      - fields: array of field names, e.g., ["name", "rating"]
 *      - Returns a function that takes an object and returns a new object
 *        with ONLY the specified fields
 *      - e.g., createMapper(["name"])({name: "Dhaba", rating: 4}) => {name: "Dhaba"}
 *
 *   4. applyOperations(data, ...operations)
 *      - data: array of objects
 *      - operations: any number of functions to apply SEQUENTIALLY
 *      - Each operation takes an array and returns an array
 *      - Apply first operation to data, then second to result, etc.
 *      - Return final result
 *      - Agar data not array, return []
 *
 * Hint: HOF = functions that take functions as arguments or return functions.
 *   createFilter returns a function. applyOperations takes functions as args.
 *
 * @example
 *   const highRated = createFilter("rating", ">=", 4);
 *   highRated({ name: "Punjab Dhaba", rating: 4.5 }) // => true
 *
 *   const byRating = createSorter("rating", "desc");
 *   [{ rating: 3 }, { rating: 5 }].sort(byRating)
 *   // => [{ rating: 5 }, { rating: 3 }]
 */
export function createFilter(field, operator, value) {
  return (dataObj) => {
    if (!Object.hasOwn(dataObj, field)) {
      return false
    };

    const dataValue = dataObj[field];

    switch (operator) {
      case '>': return dataValue > value;
      case '<': return dataValue < value;
      case '>=': return dataValue >= value;
      case '<=': return dataValue <= value;
      case '===': return dataValue === value;
      default: return false;
    }
  }
}

export function createSorter(field, order = "asc") {
  return (obj1, obj2) => {
    const field1 = obj1[field];
    const field2 = obj2[field];

    if (typeof field1 === 'string') {
      return order === 'asc' ? field1.localeCompare(field2) : field2.localeCompare(field1)
    }

    return order === 'asc' ? field1 - field2 : field2 - field1

  }
}

export function createMapper(fields) {
  return (obj) => {
    const newObj = {};

    fields.forEach((field) => {
      newObj[field] = obj[field];
    })

    return newObj;
  }
}

export function applyOperations(data, ...operations) {
  if (!Array.isArray(data)) {
    return [];
  }

  if (!operations.length) {
    return data;
  }

  const apply = (dataProvided, operationsProvided) => {
    if (operationsProvided.length <= 0) {
      return dataProvided;
    }

    const operation = operationsProvided[0];

    const calculatedData = operation(dataProvided);

    return apply(calculatedData, operationsProvided.slice(1))
  }

  return apply(data, operations);
}
