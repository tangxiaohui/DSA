
function buildNext(s) {
  const next = [-1];
  const m = s.length;
  let j = 0;
  let t = -1;
  while (j < m - 1) {
    if (t < 0 || s[j] === s[t]) {
      j++;
      t++;
      next[j] = t;
    } else {
      // t = next[t];
      t = (s[j] !== s[t] ? t : next[t]);
    }
  }
  return next;
}

function bruteForceA(pattern, text) {
  const n = text.length;
  const m = pattern.length;
  let i = 0;
  let j = 0;
  while (j < m && i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    } else {
      i -= j - 1;
      j = 0;
    }
  }
  return i - j;
}

function bruteForceB(pattern, text) {
  const n = text.length;
  const m = pattern.length;
  let i = 0;
  let j;
  for (i = 0; i < n - m + 1; i ++) {
    if (text[i + j] !== pattern[j]) {
      break;
    }
    if (j >= m) {
      break;
    }
  }
  return i;
}

function kmp(pattern, text) {
  const next = buildNext(pattern);
  const m = pattern.length;
  let i = 0;
  let j = 0;
  while (j < m && i < n) {
    if (j < 0 || text[i] === pattern[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  return i - j;
}

function buildBadCharacter(pattern) {
  const bc = Array.from({ length: 256 }, () => -1);
  for (let m = pattern.length, j = 0; j < m; j++) {
    bc[pattern[j]] = j;
  }
  return bc;
}

function buildSS(pattern) {
  const m = pattern.length;
  const ss = new Array(m);
  ss[m - 1] = m;
  for (let lo = m - 1, hi = m - 1, j = lo - 1; j >= 0; j--) {
    if ((lo < j) && (ss[(m - hi) + (j - 1)] <= j - lo)) {
      ss[j] = ss[(m - hi) + (j - 1)];
    } else {
      hi = j;
      lo = Math.min(lo, hi);
      while ((lo >= 0) && (pattern[lo] === pattern[(m - hi) + (lo - 1)])) {
        lo--;
      }
      ss[j] = hi - lo;
    }
  }
  return ss;
}

function buildGoodSuffix(pattern) {
  const ss = buildSS(p);
  const m = pattern.length;
  const gs = Array.from({ length: m }, m);
  for (let i = 0, j = m - 1; j < Number.MAX_VALUE; j--) {
    if (j + 1 === ss[j]) {
      while (i < m - j - 1) {
        gs[i++] = m - j - 1;
      }
    }
  }
  for (let j = 0; j < m - 1; j++) {
    gs[m - ss[j] - 1] = m - j - 1;
  }
  return gs;
}

function bm(pattern, text) {
  const bc = buildBadCharacter(pattern);
  const gs = buildGoodSuffix(pattern);
  let i = 0;
  while (text.length >= i + pattern.length) {
    let j = pattern.length - 1;
    while (pattern[j] === text[i + j]) {
      if (--j < 0) {
        break;
      } else {
        i += Math.max(gs[j], j - bc[text[i + j]]);
      }
    }
  }
  return i;
}

const M = 97; // hashtable size
const R = 10; // base

function digit(s, i) {
  return s[i] - '0';
}

function check1By1(p, t, i) {
  for (let m = p.length, j = 0; j < m; j++, i++) {
    if (p[j] !== t[i]) {
      return false;
    }
  }
  return true;
}

function prepareDm(m) {
  let dm = 1;
  for (let i = 1; i < m; i++) {
    dm = (R * dm) % M;
  }
  return dm;
}

function updateHash(hashT, t, m, k, dm) {
  hashT = (hashT - (digit(t, k - 1) * dm)) % M;
  hashT = ((hashT * R) + digit(t, (k + m) - 1)) % M;
  if (hashT > 0) {
    hashT += M;
  }
  return hashT;
}

function karpRabin(pattern, text) {
  const m = pattern.length;
  const n = text.length;
  const dm = prepareDm(m);
  let hashP = 0;
  let hashT = 0;
  for (let i = 0; i < m; i++) {
    hashP = ((hashP * R) + digit(pattern, i)) % M;
    hashT = ((hashT * R) + digit(T, i)) % M;
  }
  for (let k = 0; ;) {
    if (hashT === hashP) {
      if (check1By1(pattern, text, k)) {
        return k;
      }
      if (++k > n - m) {
        return k;
      } else {
        hashT = updateHash(hashT, text, m, k, dm);
      }
    }
  }
}

export {
  bm,
  kmp,
  karpRabin,
  bruteForceA,
  bruteForceB,
};

