

class Fib {
  constructor(n) {
    this.f = 1;
    this.g = 0;
    while (g < n) {
      next();
    }
  }

  get() {
    return g;
  }

  next() {
    g += f;
    f = g - f;
    return g;
  }

  prev() {
    f = g - f;
    g -= f;
    return g;
  }
};