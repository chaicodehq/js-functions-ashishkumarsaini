/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const registeredVoterList = new Map();
  const candidatedVoted = {};

  return {
    registerVoter: (voter) => {
      if (!voter?.id || registeredVoterList.has(voter.id) || voter.age < 18) {
        return false;
      }

      registeredVoterList.set(voter.id, voter);
      return true;
    },
    castVote: (voterId, candidateId, onSuccess, onError) => {
      if (!candidates.find((candid) => candid.id === candidateId)) {
        return onError("Wrong candidate!")
      }

      if (!registeredVoterList.has(voterId)) {
        return onError("Unauthorized voter!")
      }

      if (Object.hasOwn(candidatedVoted, voterId) && candidatedVoted[voterId].voted) {
        return onError("Already voted!");
      }

      candidatedVoted[voterId] = { voted: true, candidateId, voterId };

      return onSuccess({ voterId, candidateId });
    },
    getResults: (sortFn) => {
      const candidateWithVotesCount = candidates.map((candidate) => {
        const candidateVotedArr = Object.values(candidatedVoted);

        return {
          ...candidate,
          votes: candidateVotedArr.filter((voter) => voter.candidateId === candidate.id).length
        }
      });

      return candidateWithVotesCount.sort((candid1, candid2) => sortFn ? sortFn(candid1, candid2) : candid2.votes - candid1.votes);
    },
    getWinner: function () {
      const results = this.getResults();
      const candidateWithHighestVotes = results[0];

      return candidateWithHighestVotes.votes > 0 ? candidateWithHighestVotes : null
    }
  }
}

export function createVoteValidator(rules) {
  return (voter) => {
    if (voter.age < rules.minAge) {
      return { valid: false, reason: "Votes is less in age!" }
    }

    const isValid = rules.requiredFields.every((rule) => Object.hasOwn(voter, rule));

    if (isValid) {
      return { valid: true }
    } else {
      return {
        valid: false,
        reason: "Voter should have required fields"
      }
    }
  }
}

export function countVotesInRegions(regionTree) {
  if (!regionTree) {
    return 0;
  }

  const { votes, subRegions } = regionTree;


  const calcVotes = (providedRegions) => {
    return providedRegions.reduce((acc, subRegion) => {
      if (subRegion?.subRegions?.length) {
        return acc + subRegion.votes + calcVotes(subRegion.subRegions);
      }

      return acc + subRegion.votes;
    }, 0)
  }

  const subRegionsVotes = calcVotes(subRegions);

  return votes + subRegionsVotes;
}

export function tallyPure(currentTally, candidateId) {
  if (!Object.hasOwn(currentTally, candidateId)) {
    return { ...currentTally, [candidateId]: 1 };
  }

  const candidateValue = currentTally[candidateId];

  return { ...currentTally, [candidateId]: candidateValue + 1 }
}
